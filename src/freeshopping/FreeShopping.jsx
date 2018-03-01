import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Tabs, Modal, Toast } from 'antd-mobile';
import './FreeShopping.scss';
import banner from './imgs/banner1.jpg';
import gift from './imgs/lw.png';
import conner from './imgs/conner.png';
import present from './imgs/gift.png';
import x from './imgs/X.png';

import { getSessionKey, goPage } from '../common/NativeApi';
import { ajaxGet } from '../common/AjaxApi';
import PlatformExchangeList from './PlatformExchangeList';
import UserExchangeList from './UserExchangeList';
import FeedBack from './FeedBack';
// 活动介绍（0元购特享标）
const ActiveIntroduce = () => (
  <div className="active-introduce cf">
    <h4 className="first">
      <span>活动期间投资</span>
      <span>0元购特享标</span>
    </h4>
    <h4 className="second">
      <span>即可</span>
      <span>免费兑换超值好礼</span>
    </h4>
    <div>line</div>
    <h6>
      资产透明：家庭消费用户分期项目
    </h6>
    <img src={gift} alt="gift" />
  </div>
);

// 活动规则公式
const RuleFormula = () => (
  <div className="rule-formula">
    <Flex>
      <Flex.Item>
        <div className="top-contain">
          <p>
            <span className="num">270</span>
            <span>天</span>
          </p>
          <p>0元购特享标</p>
          <p className="mid">超高收益</p>
          <p>8%+礼品=<span className="spect">12.5%</span>
          </p>
        </div>
        <div className="conner">
          <img src={conner} alt="conner" />
        </div>
        <p className="bottom">
          每投资<span className="num">1600</span>元=<span className="num">10</span>心愿值
        </p>
      </Flex.Item>
      <Flex.Item>
        <div className="top-contain">
          <p>
            <span className="num">360</span>
            <span>天</span>
          </p>
          <p>0元购特享标</p>
          <p className="mid">超高收益</p>
          <p>8%+礼品=<span className="spect">13.5%</span>
          </p>
        </div>
        <div className="conner">
          <img src={conner} alt="conner" />
        </div>
        <p className="bottom">
          每投资<span className="num">1000</span>元=<span className="num">10</span>心愿值
        </p>
      </Flex.Item>
    </Flex>
  </div>
);

// 标签栏
const TabPane = Tabs.TabPane;

const TabRecord = ({ sessionKey }) => (
  <Tabs defaultActiveKey="1" swipeable={false}>
    <TabPane tab="兑换记录" key="1">
      <PlatformExchangeList sessionKey={sessionKey} />
    </TabPane>
    <TabPane tab="我的兑换" key="2">
      <UserExchangeList sessionKey={sessionKey} />
    </TabPane>
  </Tabs>
);
TabRecord.propTypes = {
  sessionKey: PropTypes.string
};


class FreeShopping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionKey: getSessionKey(),
      ruleModal: false,
      vitality: 0,
      exchangeList: [],
      pageNo: 0,
      pageSize: 5
    };
    this.getVitality();
  }

  // 查询个人活力值
  getVitality() {
    if (this.state.sessionKey) {
      ajaxGet({ url: '/uam/zerobuy/my/vitality' }).then(({ data }) => {
        this.setState({ vitality: data.vitality });
      }, ({ message }) => {
        console.log(message);
        this.setState({ sessionKey: '' });
      });
    }
  }

  goFinanceList() {
    goPage('gotoProductList');
  }
  showRuleModal() {
    this.setState({ ruleModal: true });
  }
  testLoad() {
    window.location.reload();
  }
  hiddenRuleModal() {
    this.setState({ ruleModal: false });
  }
  render() {
    return (
      <div className="free-shopping-wrap">
        <div className="banner-contain">
          <img className="banner" src={banner} alt="banner" />
        </div>
        <ActiveIntroduce />
        <RuleFormula />
        <div className="present">
          <img src={present} alt="present" />
        </div>
        <p className="wish-value">
          您目前剩余<span>{this.state.vitality || '--'}</span>心愿值
        </p>
        <div className="big-button cf">
          <a onClick={() => this.goFinanceList()}>投资得心愿值</a>
          <a onClick={() => this.props.history.push('/exchange')}>兑换礼品</a>
        </div>
        <div className="record-wrap">
          <TabRecord
            goLogin={() => this.goLogin}
            exchangeList={this.state.exchangeList}
            sessionKey={this.state.sessionKey}
          />
        </div>
        <p className="wish-bar">许愿填写你希望添加到兑换区的礼品</p>
        <FeedBack />
        <p className="ownership">本活动最终解释权归领投鸟所有</p>

        <span className="rule-btn" onClick={() => this.showRuleModal()}>活动规则</span>

        <Modal transparent maskClosable={false} visible={this.state.ruleModal} platform="ios">
          <div className="rule-content">
            <img src={x} alt="x" onClick={() => this.hiddenRuleModal()} />
            <h4>活动规则</h4>
            <p>
              1、“0元购特享标”不支持使用返现券及鸟币，不支持转让；
            </p>
            <p>
              2、礼品在兑换后15个工作日内寄送，红包（3-5张返现券组合）在兑换后1个工作日内发放到账户；
            </p>
            <p>
              3、如对礼品颜色有要求请添加微信好友：lingtouniao88 进行咨询沟通，如兑换后5个工作日内未沟通则按活动图片中颜色发货；
            </p>
            <p>
              4、投资“0元购特享标”不可重复享受平台其他优惠活动；
            </p>
            <p>
              5、活动结束时未使用的心愿值将失效。
            </p>
            <p className="red-color">
              注：按单笔投资金额计算心愿值，且获得心愿值只能为10的整数倍。例：投资两笔1500元总计3000元360天标，可获得20点心愿值。
            </p>
          </div>
        </Modal>

      </div>
    );
  }
}

FreeShopping.propTypes = {
  history: PropTypes.object
};

export default FreeShopping;

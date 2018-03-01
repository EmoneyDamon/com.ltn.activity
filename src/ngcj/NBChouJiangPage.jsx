import React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Modal, Toast } from 'antd-mobile';
import { ajaxPost, ajaxGet } from '../common/AjaxApi';
import './NBChouJiangPage.scss';
import BaiYing from './BaiYing';
import HuangJing from './HuangJing';
import BaiJing from './BaiJing';
import banner from './imgs/banner.png';
import footer from './imgs/footer.png';

import { login, getSessionKey } from '../common/NativeApi';


class NBChouJiangPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      myRecod: [],
      sid: getSessionKey(),
      ruleModal: false,
      tips: false,
      active: -1,
      modType: 1,
      prize: -1, // 中奖id
      canStop: false // 是可以开始进入旋转衰减
    };
    this.rollStats = null;
    this.getActDetail();
  }
  componentDidMount() {
    this.initRollState();
    // 用户登录，查询中奖数据
    if (this.state.sid) {
      this.getMyWinReward();
    }
  }
  // 查询获取情况
  getActDetail() {
    ajaxPost({
      url: '/uam/investLottery618/getActDetail'
    })
    .then((resData) => {
      const { userStatus, actStatus } = resData.data;
      this.setState({
        actStatus
      });
      // 没有权限
      if (userStatus === '-1') {
        this.setState({
          tips: true
        });
      } else if (userStatus === '-2') {
        // 未登录、或者登录超时
        sessionStorage.removeItem('ltn_sessionKey');
        this.setState({
          sid: null
        });
      } else {
        const { goldCount = '0', silverCount = '0', platinumCount = '0' } = resData.data;
        // 有权限参加
        this.setState({
          gold: goldCount,
          silver: silverCount,
          platinum: platinumCount
        });
      }
    }, (error) => {
      Toast.fail(error.message);
    });
  }
  // 获取个人抽奖记录
  getMyWinReward() {
    ajaxPost({
      url: '/uam/investLottery618/my/WinReward'
    })
    .then((resData) => {
      const { data } = resData;
      this.setState({
        myRecod: data
      });
    }, (error) => {
      const { resultCode } = error.data;
      if (resultCode === '10000006' || resultCode === '10000005') {
        this.setState({
          sid: null
        });
        sessionStorage.removeItem('ltn_sessionKey');
        this.setState({
          sid: null
        });
      } else {
        Toast.fail(error.message);
      }
    });
  }
  // 去抽奖
  getPrize(lotteryType) {
    ajaxPost({
      url: '/uam/investLottery618/actLottery',
      params: {
        lotteryType
      }
    })
    .then((resData) => {
      this.setState({
        prize: parseInt(resData.data.awardIndex, 10),
        canStop: true,
        prizeName: resData.data.awardName
      });
      this.getActDetail();
    }, (error) => {
      Toast.fail(error.message);
      this.setState({
        prize: -1,
        active: -1,
        canStop: true,
        strop: true
      });
      this.getActDetail();
    });
  }
  // 初始化转盘
  initRollState() {
    this.rollStats = {
      index: 0,
      timer: null,
      prize: -1,
      speed: 25, // 匀速旋转  速度,
      minSpeed: 200, // 最低旋转速度
      canStop: false, // 是可以开始进入旋转衰减
      isRolling: false, // 当前是否正在旋转
      rollNum: 0, // 状态切换次数
      minRollNum: 70// 最少切换速度，保障转盘效果
    };
    this.setState({
      strop: false,
      active: -1,
      prize: -1, // 中奖id
      canStop: false // 是可以开始进入旋转衰减
    });
  }
  // 开始转盘
  startRoll(lotteryType) {
    // 判断是否在转
    if (this.rollStats.isRolling) {
      return false;
    }
    // 判断活动是否结束
    if (this.state.actStatus !== 'NORMAL') {
      this.setState({
        tips2: true
      });
      return false;
    }
    // 判断是否登录
    if (!this.state.sid) {
      this.goLogin();
      return false;
    }
    // 判断是否有对应的机会
    if (!this.hasChang(lotteryType)) {
      // 没机会
      this.setState({
        noChang: true
      });
      return false;
    }
    // 初始化
    this.initRollState();
    this.rollStats.isRolling = true;
    // 抽奖
    this.getPrize(lotteryType);
    // 开始转盘
    this.changeRollIndex();
    return true;
  }
  // 判断转盘是否有机会
  hasChang(lotteryType) {
    const { gold = '0', silver = '0', platinum = '0' } = this.state;
    switch (lotteryType) {
      case 'gold':
        if (gold === '0') {
          return false;
        }
        break;
      case 'silver':
        if (silver === '0') {
          return false;
        }
        break;
      case 'platinum':
        if (platinum === '0') {
          return false;
        }
        break;
      default:

    }
    return true;
  }
  // 修改转盘转动的位置
  changeRollIndex() {
    let { index, speed, rollNum } = this.rollStats;
    const { minRollNum, minSpeed } = this.rollStats;
    const { canStop, prize, strop } = this.state;
    index += 1;
    if (index > 8) {
      index = 1;
    }
    this.setState({
      active: index
    });
    this.rollStats.index = index;
    // 抽奖结果返回
    if (canStop) {
      // 开始计算最低次数
      rollNum += 1;
      this.rollStats.rollNum = rollNum;
      // 满足最低次数，开始衰减
      if (rollNum > minRollNum) {
        speed = ((rollNum - minRollNum) * 10) + speed;
        this.rollStats.speed = speed;
        // 达到最低转速，开始寻找中奖点
        if (speed > minSpeed && index === prize) {
          this.stopRoll();
          return false;
        }
      }
    }
    if (strop) {
      window.clearTimeout(this.rollStats.timer);
      this.setState({
        prize: -1,
        active: -1,
        canStop: true,
        strop: true
      });
      this.initRollState();
      return false;
    }
    this.rollStats.timer = setTimeout(() => {
      this.changeRollIndex();
    }, speed);
    return true;
  }
  // 停止转盘处理
  stopRoll() {
    window.clearTimeout(this.rollStats.timer);
    this.rollStats.isRolling = false;
    if (this.state.prize !== -1) {
      this.setState({
        prizeModal: true
      });
    }
  }
  // 切换转盘
  changeTab(type) {
    if (!this.rollStats.isRolling) {
      this.initRollState();
      this.setState({
        modType: type
      });
    }
  }
  // 查看规则
  showRuleModal() {
    if (!this.state.ruleModal) {
      this.setState({
        ruleModal: true
      });
    }
  }
  // 关闭弹出层
  closeModal(type) {
    switch (type) {
      case 'rule':
        this.setState({
          ruleModal: false
        });
        break;
      case 'prizeModal':
        this.setState({
          prizeModal: false
        });
        this.getActDetail();
        this.getMyWinReward();
        break;
      case 'tips2':
        this.setState({
          tips2: false
        });
        break;
      case 'noChang':
        this.setState({
          noChang: false
        });
        break;
      case 'tips':
        window.location.href = '/native/home/home.html';
        break;
      default:

    }
  }
  // 登录
  goLogin() {
    login(window.location.href);
  }
  render() {
    const { modType, active, sid, myRecod, gold = '0', silver = '0', platinum = '0' } = this.state;
    return (
      <div className="nbcj-page">
        <div className="banner-wrap">
          <img src={banner} alt="领头鸟618活动" />
        </div>
        <p className="title">
          <span>幸运转盘</span>
        </p>
        <p className="sub-title">活动现场完成一定额度的投资即可参与抽奖活动</p>
        <p className="tab-wrap">
          <button className={modType === 1 ? 'active' : ''} onClick={() => this.changeTab(1)} >白银转盘</button>
          <button className={modType === 2 ? 'active' : ''} onClick={() => this.changeTab(2)} >黄金转盘</button>
          <button className={modType === 3 ? 'active' : ''} onClick={() => this.changeTab(3)} >白金转盘</button>
        </p>

        <div className="zhuanpan-wrap">
          {
            modType === 1 && <BaiYing
              active={active}
              startRoll={lotteryType => this.startRoll(lotteryType)} sid={sid} silver={silver}
            />
          }
          {
            modType === 2 && <HuangJing
              active={active}
              startRoll={lotteryType => this.startRoll(lotteryType)} sid={sid} gold={gold}
            />
          }
          {
            modType === 3 && <BaiJing
              active={active}
              startRoll={lotteryType => this.startRoll(lotteryType)} sid={sid} platinum={platinum}
            />
          }
        </div>
        <p className="title">
          <span>获奖记录</span>
        </p>
        <div className="jilu-wrap">
          <p className="head">
            <span>序号</span>
            <span>抽中奖品</span>
          </p>
          {
            sid && myRecod.length > 0 && myRecod.map((obj, index) => (
              <p className="item" key={lodash.uniqueId('item')}>
                <span>{index + 1}</span>
                <span>{obj.awardName}</span>
              </p>
            ))
          }
          {
            sid && myRecod.length === 0 && <p className="no-data">
              <a>暂无数据</a>
            </p>
          }
          {
            !sid && <p className="no-login">
              <a onClick={() => this.goLogin()}>登录查看</a>
            </p>
          }
        </div>
        <div className="footer-wrap">
          <img src={footer} alt="领头鸟" />
        </div>
        <div className="rule-btn" onClick={() => this.showRuleModal()}>
          活动规则
        </div>
        <Modal
          platform="ios"
          title="活动规则"
          transparent
          maskClosable={false}
          visible={this.state.ruleModal}
          footer={[{ text: '知道了', onPress: () => this.closeModal('rule') }]}
        >
          <div className="rule-content">
            <p>1、参与抽奖用户需要在宁波活动现场进行签到，然后投资抽奖。</p>
            <p>2、以上3个转盘总计最多只能抽奖3次。</p>
            <p>3、旅游、iphone7、迪士尼门票、扫地机器人这4项奖品在6月30日前寄送，其他奖品现场领奖。</p>
            <p>4、转让标体验标除外。</p>
          </div>
        </Modal>
        <Modal
          platform="ios"
          title="中奖了"
          transparent
          maskClosable={false}
          visible={this.state.prizeModal}
          footer={[{ text: '好的', onPress: () => this.closeModal('prizeModal') }]}
        >
          <div className="rule-content">
            {this.state.prizeName}
          </div>
        </Modal>
        <Modal
          platform="ios"
          title="温馨提示"
          transparent
          maskClosable={false}
          visible={this.state.tips}
          footer={[{ text: '好的', onPress: () => this.closeModal('tips') }]}
        >
          <div className="rule-content">
            该活动仅限宁波现场参加！
          </div>
        </Modal>
        <Modal
          platform="ios"
          title="温馨提示"
          transparent
          maskClosable={false}
          visible={this.state.tips2}
          footer={[{ text: '好的', onPress: () => this.closeModal('tips2') }]}
        >
          <div className="rule-content">
            活动已经结束，下次再来吧!
          </div>
        </Modal>
        <Modal
          platform="ios"
          title="温馨提示"
          transparent
          maskClosable={false}
          visible={this.state.noChang}
          footer={[{ text: '好的', onPress: () => this.closeModal('noChang') }]}
        >
          <div className="rule-content">
            机会用完了！
          </div>
        </Modal>
      </div>
    );
  }
}


export default NBChouJiangPage;

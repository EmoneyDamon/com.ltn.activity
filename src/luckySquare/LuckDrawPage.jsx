import React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Modal, Toast } from 'antd-mobile';
import { ajaxPost } from '../common/AjaxApi';
import './LuckDrawPage.scss';
import BaiYing from './BaiYing';
import goResult from './images/go-result.png';

import { getSessionKey, reauthorize } from '../common/NativeApi';

class LuckDrawPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      light: 'zhuanpan-wrap',
      myRecod: [],
      sid: getSessionKey(),
      ruleModal: false,
      prizeModal: false,
      tips: '',
      prizeName: '',
      active: -1,
      prize: -1, // 中奖id
      canStop: false // 是可以开始进入旋转衰减
    };
    this.rollStats = null;
  }
  componentDidMount() {
    this.initRollState();
    this.lightLend();
  }

  //定时亮灯
  lightLend() {
    const Light = this.state.light;
    if (Light === 'zhuanpan-wrap') {
      this.setState({
        light: 'zhuanpan-light-wrap'
      });
    } else {
      this.setState({
        light: 'zhuanpan-wrap'
      });
    }
    setTimeout(() => {
      this.lightLend();
    },500);
  }

  // 去抽奖
  getPrize() {
    ajaxPost({
      url: '/luam/squareDance/dance/draw',
      params: {
        openId    : window.localStorage.getItem("openId"),
        sessionKey: window.sessionStorage.getItem("ltn_sessionKey")
      }
    })
    .then((resData) => {
      const awardCode = resData.data.code;
      let awardIndex = 7; //默认设置奖券
      let tips = '请去账户查看';
      if (awardCode === "500001") {
        awardIndex = 1;
        tips = '请在比赛现场寻找工作人员兑换';
      } else if (awardCode === "500002") {
        awardIndex = 2;
        tips = '请在比赛现场寻找工作人员兑换';
      } else if (awardCode === "500006") {
        awardIndex = 3;
        tips = '将于15个工作日内自动充值到您的手机账户';
      } else if (awardCode === "500007") {
        awardIndex = 4;
        let tips = '请去账户查看';
      } else if (awardCode === "500004") {
        awardIndex = 5;
        tips = '请在比赛现场寻找工作人员兑换';
      } else if (awardCode === "500005") {
        awardIndex = 6;
        tips = '将于15个工作日内自动充值到您的手机账户';
      } else if (awardCode === "500008") {
        awardIndex = 7;
        let tips = '请去账户查看';
      } else if (awardCode === "500003") {
        awardIndex = 8;
        tips = '请在比赛现场寻找工作人员兑换';
      } else {
        awardIndex = 7;
      }
      if (resData.data.awardName === "手机扣环"){
        this.setState({
          prize     : awardIndex,
          canStop   : true,
          prizeName : "指甲刀套装",
          tips      : tips
        });
      } else {
        this.setState({
          prize     : awardIndex,
          canStop   : true,
          prizeName : resData.data.awardName,
          tips      : tips
        });
      }
    }, (error) => {
      const resultCode = error.data.resultCode;
      if (resultCode === "000001040") {
        Toast.info("活动已经结束啦，下次再来吧",2);
      } else if (resultCode === "000001044") {
        Toast.info("您已经抽过奖啦，将跳转至结果页",2);
        this.props.history.push("/result.html");
      } else {
        Toast.info(error.data.resultMessage,2);
        reauthorize();
      }
      this.setState({
        prize: -1,
        active: -1,
        canStop: true,
        strop: true
      });
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
  startRoll() {
    // 判断是否在转
    if (this.rollStats.isRolling) {
      return false;
    }
    // 初始化
    this.initRollState();
    this.rollStats.isRolling = true;
    // 抽奖
    this.getPrize();
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

  render() {
    const { active, sid, myRecod, gold = '0', silver = '0', platinum = '0' } = this.state;
    return (
      <div className="nbcj-page">
        <div className="cj-bg-banner">
          <div className={this.state.light}>
            <div className="zhuanpan-contain">
              <BaiYing
                active={active}
                startRoll={lotteryType => this.startRoll(lotteryType)} sid={sid} silver={silver}
              />
            </div>
          </div>
          <p className="shiwu">实物仅限比赛现场领取</p>
        </div>
        <Modal className="new-modal" transparent maskClosable={false} visible={this.state.prizeModal} platform="ios">
          <div className="rule-content">
            <img onClick={() => this.props.history.push("/result.html")} className="go-result" src={goResult} alt="去查看" />
            <p className="award">{this.state.prizeName}</p>
            <p className="tips">Tips：<br />{this.state.tips}</p>
          </div>
        </Modal>
      </div>
    );
  }
}


export default LuckDrawPage;

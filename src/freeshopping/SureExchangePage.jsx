import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import './SureExchangePage.scss';
import { ajaxGet } from '../common/AjaxApi';
import { login, goPage } from '../common/NativeApi';
import x from './imgs/X.png';

class SureExchangePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeSuccessModel: false,
      vitality: props.match.params.value,
      awardName: '',
      failExchange: false,
      goLogin: false,
      lackVitalityModal: false,
      gameOver: false
    };
    this.getAwardsName(props.match.params.id);
  }

  // 获取兑换奖品名
  getAwardsName(id) {
    ajaxGet({ url: '/uam/zerobuy/getAward', params: { awardId: id } }).then((res) => {
      this.setState({
        awardName: res.data.awardName
      });
    });
  }

  // 确认兑换
  sureExchange(id) {
    history.replaceState({}, 'page', '/activity/freeshopping/');
    ajaxGet({ url: '/uam/zerobuy/cash', params: { awardId: id } }).then((res) => {
      if (res.resultCode === '0') {
        this.showExchangeSuccessModell();
        this.setState({ vitality: res.data.vitality });
      }
    }, ({ message }) => {
      if (message.resultCode === '10000009') {
        this.showLackVitalityModal();
      } else if (message.resultCode === '10000006') {
        this.showGoLoginModal();
      } else if (message.resultCode === '10000007' || message.resultCode === '10000008') {
        this.showFailExchangeModell();
      } else if (message.resultCode === '10000010') {
        this.showGameOver();
      } else {
        this.showFailExchangeModell();
      }
    });
  }

  // 显示兑换成功弹框
  showExchangeSuccessModell() {
    this.setState({
      exchangeSuccessModel: true
    });
  }

  // 隐藏兑换成功弹框
  hiddenExchangeSuccessModell() {
    this.setState({
      exchangeSuccessModel: false
    });
  }

  // 显示兑换失败弹框
  showFailExchangeModell() {
    this.setState({
      failExchange: true
    });
  }

  // 隐藏兑换失败弹框
  hiddenFailExchangeModell() {
    this.setState({
      failExchange: false
    });
  }

  // 显示去登陆弹框
  showGoLoginModal() {
    this.setState({ goLogin: true });
  }

  // 隐藏去登陆弹框
  hiddenGoLoginModal() {
    this.setState({ goLogin: false });
  }

  // 去登陆
  goLogin() {
    this.hiddenGoLoginModal();
    login(window.location.href);
  }

  // 去投资列表
  goFinanceList() {
    goPage('gotoProductList');
  }

  // 显示心愿值不足弹框
  showLackVitalityModal() {
    this.setState({ lackVitalityModal: true });
  }

  // 隐藏心愿值不足弹框
  hiddenLackVitalityModal() {
    this.setState({ lackVitalityModal: false });
  }

  // 隐藏心愿值不足弹框
  hiddenGameOver() {
    this.setState({ gameOver: false });
  }

  // 显示心愿值不足弹框
  showGameOver() {
    this.setState({ gameOver: true });
  }

  // 取消兑换
  cancelExchange() {
    this.setState({
      buttonRight: '',
      buttonLeft: 'active'
    });
    history.replaceState({}, 'page', '/activity/freeshopping/');
    this.props.history.push('/exchange');
  }
  render() {
    return (
      <div className="sure-exchange-page">
        <div className="text-content">
          <p>您将使用<span>{this.props.match.params.value}</span>点心愿值兑换<span>{this.state.awardName}</span></p>
          <p>礼品将寄往：</p>
          <p>{this.props.match.params.address}</p>
          <p>您可以到“APP-我的-账户设置-收货地址”中修改</p>
        </div>
        <div className="button cf">
          <span onClick={() => this.cancelExchange()}>我再想想</span>
          <span className="active" onClick={() => this.sureExchange(this.props.match.params.id)}>确认兑换</span>
        </div>
        <Modal transparent maskClosable={false} visible={this.state.exchangeSuccessModel} platform="ios">
          <div className="modal-content">
            <p>
              兑换成功，您目前的心愿值为{this.state.vitality}点
            </p>
            <p className="investment" onClick={() => this.goFinanceList()}>投资赚心愿值</p>
            <p className="changeAgain" onClick={() => this.props.history.go(-1)}>继续兑换</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.failExchange} platform="ios">
          <div className="modal-content">
            <p>
              兑换失败
            </p>
            <p className="click" onClick={() => this.hiddenFailExchangeModell()}>再兑一次</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.goLogin} platform="ios">
          <div className="modal-content">
            <img src={x} alt="x" onClick={() => this.hiddenGoLoginModal()} />
            <p>
              请登陆参与活动
            </p>
            <p className="click" onClick={() => this.goLogin()}>去登陆</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.lackVitalityModal} platform="ios">
          <div className="modal-content">
            <img src={x} alt="x" onClick={() => this.hiddenLackVitalityModal()} />
            <p>
              您的心愿值不足
            </p>
            <p>
              您目前的心愿值为{this.state.vitality}点
            </p>
            <p className="click" onClick={() => this.goFinanceList()}>投资赚心愿值</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.gameOver} platform="ios">
          <div className="modal-content">
            <p>
              活动已经结束
            </p>
            <p className="click" onClick={() => this.hiddenGameOver()}>知道了</p>
          </div>
        </Modal>
      </div>
    );
  }
}
SureExchangePage.propsTypes = {
  history: PropTypes.object
};
export default SureExchangePage;

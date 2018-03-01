import React from 'react';
import loadsh from 'lodash';

import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';
import bag from './imgs/bag.jpg';
import x from './imgs/X.png';
import './ExChangePage.scss';

import { getSessionKey, login, goPage } from '../common/NativeApi';
import { ajaxGet } from '../common/AjaxApi';


class ExChangePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionKey: getSessionKey(),
      vitality: '',
      address: '',
      wishValue: '',
      awardName: '',
      isAjaxLoading: false,
      lackVitalityModal: false,
      goLogin: false,
      noAddress: false,
      data: []
    };
    this.awardsList();
    this.getAddress();
    this.getVitality();
  }

  // 查询个人活力值
  getVitality() {
    if (this.state.sessionKey) {
      ajaxGet({ url: '/uam/zerobuy/my/vitality' }).then(({ data }) => {
        this.setState({ vitality: data.vitality });
      }, ({ message }) => {
        console.log(message);
        this.setState({ vitality: 'relogin' });
      });
    }
  }
  // 查询用户地址
  getAddress() {
    ajaxGet({ url: '/v3/addressManage/getAddress' }).then((data) => {
      if (data.resultCode === '0' && data.data.location !== undefined) {
        this.setState({
          address: data.data.location + data.data.detailAddress
        });
      }
    });
  }
  // 奖品展示列表
  awardsList() {
    ajaxGet({ url: '/uam/zerobuy/awardsList' }).then((res) => {
      res.data.push({
        type: 'more'
      });
      this.setState({
        data: res.data
      });
    });
  }

  // 判断是否可以兑换
  isCanExchange(wishValue, award = '礼品', id, address) {
    if (!this.state.sessionKey) {
      this.showGoLoginModal();
    } else if (this.state.vitality === 'relogin') {
      this.showGoLoginModal();
    } else if (this.state.vitality < wishValue) {
      this.showLackVitalityModal();
    } else if (this.state.address.length < 1) {
      this.showNoAddressModal(wishValue, award);
    } else {
      this.props.history.push(`/sure/exchange/${id}/${wishValue}/${address}`);
    }
  }

  // 显示心愿值不足弹框
  showLackVitalityModal() {
    this.setState({ lackVitalityModal: true });
  }

  // 隐藏心愿值不足弹框
  hiddenLackVitalityModal() {
    this.setState({ lackVitalityModal: false });
  }

  // 显示去登陆弹框
  showGoLoginModal() {
    this.setState({ goLogin: true });
  }

  // 隐藏去登陆弹框
  hiddenGoLoginModal() {
    this.setState({ goLogin: false });
  }

  // 显示没有填写地址弹框
  showNoAddressModal(wishValue, awardName) {
    this.setState({
      noAddress: true,
      wishValue,
      awardName
    });
  }

  // 隐藏没有填写地址弹框
  hiddenNoAddressModal() {
    this.setState({ noAddress: false });
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

  render() {
    return (
      <div className="exchange-gift-wrap">
        <div className="cf">
          {
            this.state.data.map((item) => {
              if (item.type) {
                return (
                  <div className="liwu-item-wrap expend" key={loadsh.uniqueId(item.type)}>
                    <p>MORE</p>
                    <p>更多礼品敬请期待</p>
                  </div>
                );
              }
              const vitality = item.vitality;
              const awardName = item.awardName;
              const awardId = item.id;
              const address = this.state.address;
              return (
                <div className="liwu-item-wrap" key={loadsh.uniqueId(item.id)}>
                  <img className="product-picture" src={item.picUrl} alt="headphone" />
                  <div className="text-content">
                    <p className="name">{item.awardName}</p>
                    <p className="price cf">
                      <span className="red-price">¥{item.price}</span>
                      {
                        item.redBag !== undefined && (
                          <span>
                            <i>+</i>
                            <img src={bag} alt="bag" />
                            <i>¥{item.redBag}</i>
                          </span>
                        )
                      }
                    </p>
                    <p className="button" onClick={() => this.isCanExchange(vitality, awardName, awardId, address)} ><span>{item.vitality}</span>心愿值兑换</p>
                  </div>
                </div>
              );
            })
          }
        </div>
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
        <Modal transparent maskClosable={false} visible={this.state.goLogin} platform="ios">
          <div className="modal-content">
            <img src={x} alt="x" onClick={() => this.hiddenGoLoginModal()} />
            <p>
              请登陆参与活动
            </p>
            <p className="click" onClick={() => this.goLogin()}>去登陆</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.noAddress} platform="ios">
          <div className="modal-content">
            <p>
              您将使用{this.state.wishValue}点心愿值兑换{this.state.awardName}
            </p>
            <p>
              您尚未填写收货地址
            </p>
            <p>
              请到“APP-我的-账户设置-收货地址”中添加
            </p>
            <p className="click" onClick={() => this.hiddenNoAddressModal()}>知道了</p>
          </div>
        </Modal>
      </div>
    );
  }
}

ExChangePage.propsTypes = {
  history: PropTypes.object
};
export default ExChangePage;

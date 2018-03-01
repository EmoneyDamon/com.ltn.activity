import React from 'react';
import { Modal, Toast } from 'antd-mobile';
import './FreeShopping.scss';

import { getSessionKey, login } from '../common/NativeApi';
import { ajaxPost } from '../common/AjaxApi';
import x from './imgs/X.png';

class FeedBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionKey: getSessionKey(),
      feedBackContent: '',
      goLogin: false,
      modal: false
    };
  }
  feedBackContentChange(e) {
    this.setState({
      feedBackContent: e.target.value
    });
  }
  submitFeedBack() {
    const { feedBackContent } = this.state;
    if (!this.state.sessionKey) {
      this.showGoLoginModal();
    } else if (!feedBackContent || feedBackContent.length === 0) {
      Toast.fail('请输入许愿内容');
    } else if (feedBackContent.length > 30) {
      Toast.fail('许愿内容最多为30个字');
    } else {
      ajaxPost({
        url: '/uam/zerobuy/submitFeedBack',
        params: {
          feedBackContent: this.state.feedBackContent
        }
      })
      .then(() => {
        this.setState({
          modal: true
        });
      }, (error) => {
        if (error.data.resultCode === '-1000') {
          Toast.fail('许愿次数已达上限，每人最多许愿5次。');
        } else if (error.data.resultCode !== '0') {
          this.showGoLoginModal();
        }
      });
    }
  }
  hideModal() {
    this.setState({
      modal: false,
      feedBackContent: ''
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

  render() {
    return (
      <div className="witsh-wrap">
        <input
          name="feedBackContent"
          type="text"
          value={this.state.feedBackContent}
          placeholder="我想要一台IPHONE7"
          onChange={e => this.feedBackContentChange(e)}
        /><button onClick={() => this.submitFeedBack()}>许愿</button>
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.modal}
          platform="ios"
        >
          <div className="modal-content wish-modal">
            <h4>许愿成功</h4>
            <p>
              您的心愿我们已经收到
            </p>
            <p>
              您心怡的礼品将有机会出现在兑换区
            </p>
            <p>
              祝您梦想成真！
            </p>
            <p className="btn-wrap"><span onClick={() => this.hideModal()}>知道了</span></p>
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
      </div>
    );
  }
}

export default FeedBack;

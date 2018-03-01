import React from 'react';
import { Modal, Toast, Carousel } from 'antd-mobile';
import { ajaxPost } from '../common/AjaxApi';
import { getSessionKey, reauthorize } from '../common/NativeApi';
import './IndexPage.scss';
import message from './images/message.png';
import password from './images/lock.png';
import phone from './images/phone.png';
import picCode from './images/pic.png';
import dui from './images/dui.png';
import slide1 from './images/slide/1.png';
import slide2 from './images/slide/2.png';
import slide3 from './images/slide/3.png';
import slide4 from './images/slide/4.png';
import slide5 from './images/slide/5.png';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data          : [slide2, slide1, slide3, slide4, slide5],
      initialHeight : 200,
      goState       : 0,
      phone         : '',
      picCode       : '',
      password      : '',
      mobileCode    : '',
      machineNo     : this.innitMachineNo(),
      passwordModal : false,
      loginModal    : false,
      mobileModal   : false,
      successModal  : false,
      count         : 60,
      liked         : true
    }
  }

  componentDidMount() {
    const Search = window.location.search;
    const Substr = Search.match(/code=(\S*)&/);
    const code = Substr ? Substr[1] : '';
    ajaxPost({
      url: '/luam/squareDance/select/page',
      params: {
        weChatCode  : code,
        sessionKey  : getSessionKey()
      }
    }).then((res) => {
    }, (mes) => {
      if (mes.data.resultCode === "000001041") {
        //code过期,从新获取code
        reauthorize();
      } else if(mes.data.resultCode === "000001034") {
        //用户没有绑定手机号，goState状态修改为弹出验证手机号弹窗
        window.localStorage.setItem("openId",mes.data.data.openId);
        this.setState({
          goState: 1
        });
      } else if(mes.data.resultCode === "000001037") {
        //用户已经登陆并绑定手机号，goState状态修改为跳转到答题页面
        window.localStorage.setItem("openId",mes.data.data.openId);
        this.setState({
          goState: 2
        });
      } else if(mes.data.resultCode === "000001039") {
        //用户已经登陆并绑定手机号企且参与过抽奖，goState状态修改为跳转到获奖结果页面
        window.localStorage.setItem("openId",mes.data.data.openId);
        this.setState({
          goState: 3
        });
      } else if(mes.data.resultCode === "000001040") {
        //活动已结束
        this.setState({
          goState: 4
        });
      } else {
        //未知状态
        this.setState({
          goState: 1
        });
      }
    });
  }

  //立即参与
  goNext() {
    const { goState } = this.state
    if (goState === 1) {
      this.showMobileModal();
    } else if (goState === 2) {
      this.goAnswer();
    } else if (goState === 3) {
      this.props.history.push('/result.html');
    } else if (goState === 4) {
      Toast.info("活动已结束，下次再来吧",3);
    } else {
      Toast.loading('Loading...',3);
      reauthorize();
    }
  }

  //显示手机号弹窗
  showMobileModal() {
    this.setState({ mobileModal: true });
  }

  //隐藏手机号弹窗
  hiddenMobileModal() {
    this.setState({ mobileModal: false });
  }

  //显示登录弹窗
  showLoginModal() {
    this.setState({ loginModal: true });
  }

  //隐藏登录弹窗
  hiddenLoginModal() {
    this.setState({ loginModal: false });
  }

  //显示注册弹窗
  showPasswordModal() {
    this.setState({ passwordModal: true });
  }

  //隐藏注册弹窗
  hiddenPasswordModal() {
    this.setState({ passwordModal: false });
  }

  //显示注册成功弹窗
  showSuccessModal() {
    this.setState({ successModal: true });
  }

  //隐藏注册成功弹窗
  hiddenSuccessModal() {
    this.setState({ successModal: false });
  }

  // 手机号码onchange绑定
  onPhoneChange(event) {
    const value = event.target.value;
    this.setState({
      phone: value
    });
  }

  // 图片验证码value变化
  onPictureCodeChange(event) {
    const value = event.target.value;
    this.setState({
      picCode: value
    });
  }

  // 手机验证码value变化
  onMobileCodeChange(event) {
    const value = event.target.value;
    this.setState({
      mobileCode: value
    });
  }

  // 设置密码
  onChangePassword(event) {
    const value = event.target.value;
    this.setState({
      password: value
    });
  }

  // 验证手机号码
  checkPhone() {
    const temporaryPhone = this.state.phone;
    if (temporaryPhone.length < 11 || !(/^1[34578]\d{9}$/.test(temporaryPhone))) {
      Toast.info("请输入正确的手机号码",3);
    } else {
      ajaxPost({
        url: '/luam/squareDance/check/register/status',
        params: {
          mobileNo  : this.state.phone,
          openId    : window.localStorage.getItem("openId")
        }
      }).then((res) => {
        //已经注册的平台用户 弹出登录窗口
        this.hiddenMobileModal();
        this.showLoginModal();
      }, (mes) => {
        const resultCode = mes.data.resultCode;
        if (resultCode === "000001036") {
          //新用户，弹出注册弹窗
          this.hiddenMobileModal();
          this.showPasswordModal();
        } else if (resultCode === "000001041") {
          //openId 不正确 重新授权
          reauthorize();
        } else if (resultCode === "000001000") {
          //手机号输入不合法
          Toast.info("您输入的手机号码格式不正确，请重新输入",3);
        } else if (resultCode === "000001043") {
          //该手机号已经被另一个微信账号绑定，需要更换手机号码
          Toast.info("该手机号码已被另一个微信账号使用，请更换手机号码。如有疑问请联系微信客服或现场工作人员。",4);
        } else if (resultCode === "000001045") {
          //恶意试探手机号码是否是我平台用户
          Toast.info("您涉嫌恶意试探手机号码是否是我平台用户的操作，该微信账号无法参与本次活动。如有疑问请联系微信客服或现场工作人员。",5);
        } else {
          Toast.info("服务器开小差，请稍后再试。");
        }
      });
    }
  }

  // 获取手机验证码
  getMobileCode() {
    if (this.state.picCode.length === 4) {
      if (this.state.liked) {
        ajaxPost({
          url: '/v3/mobile/mobilecode/h5/getMobileCode/byMachineNo',
          params: {
            sendType: 1,
            clientType: 'W',
            mobileNo: this.state.phone,
            pictureCode: this.state.picCode,
            machineNo: this.state.machineNo
          }
        }).then((res) => {
          if (res.resultCode === '0') {
            this.handleClick();
            Toast.success('验证码已发送，请注意查收');
          }
        }, (message) => {
          this.machineNoChange();
          console.log(message);
          if (message.data.resultCode === '10000001') {
            Toast.info("图片验证码验证错误，请点击刷新图片验证码",3);
          } else if (message.data.resultCode === '10000011') {
            Toast.info("手机号已注册，请直接登录",3);
            this.hiddenPasswordModal();
            this.showLoginModal();
            Toast.info("您已经来过一次了，输入密码开始答题吧。",3);
          } else {
            Toast.info("服务器开小差，请联系服务人员",3);
          }
        });
      }
    } else {
      Toast.info("请输入至少4位图片验证码",3);
    }
  }

  // 提交注册表单数据
  submitForm() {
    if (this.state.picCode.length === 4 && this.state.mobileCode.length === 4 && (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(this.state.password))) {
      ajaxPost({
        url: '/v3/user/register/registerH5User',
        params: {
          clientType: 'W',
          readAndAgree: 1,
          mobileNo: this.state.phone,
          password: this.state.password,
          mobileCode: this.state.mobileCode
        }
      }).then((res) => {
        if (res.resultCode === '0') {
          sessionStorage.setItem('ltn_sessionKey',res.data.sessionKey);
          this.bindMobileWithOpenid();
        }
      }, (message) => {
        if (message.data.resultCode === "10000011") {
            this.hiddenPasswordModal();
            this.showLoginModal();
            Toast.info("您已经来过一次了，输入密码开始答题吧。",3);
        } else {
          Toast.info(message.data.resultMessage,2);
        }
      });
    } else {
      Toast.info('请正确填写信息，密码至少为6位，只能使用且必须同时包含数字和字母',4);
    }
  }

  //登录接口
  loginForm() {
    ajaxPost({
      url: '/v3/user/login/login',
      params: {
        clientType: 'W',
        mobileNo: this.state.phone,
        password: this.state.password,
        machineNo: this.state.machineNo,
        pictureCode: this.state.picCode
      }
    }).then((res) => {
      if (res.resultCode === '0') {
        sessionStorage.setItem('ltn_sessionKey',res.data.sessionKey);
        this.bindMobileWithOpenid();
      }
    }, (message) => {
      if (message.data.resultCode === "10000004") {
        Toast.info("您的密码错啦，仔细想想吧。",2);
      } else if (message.data.resultCode === "800005") {
        Toast.info("请完整填写信息",2);
      } else {
        Toast.info(message.data.resultMessage,2);
      }
    });
  }

  //绑定用户openId和手机号
  bindMobileWithOpenid() {
    ajaxPost({
      url: '/luam/squareDance/user/bind',
      params: {
        openId    : window.localStorage.getItem("openId"),
        sessionKey: getSessionKey()
      }
    }).then((res) => {
      //绑定成功，弹出验证成功弹窗
      this.hiddenLoginModal();
      this.hiddenPasswordModal();
      this.showSuccessModal();
    }, (mes) => {
      const resultCode = mes.data.resultCode;
      if (resultCode === "000001035") {
        //用户未登录
        this.hiddenPasswordModal();
        this.showLoginModal();
        Toast.info("验证超时，请重新登录验证");
      } else if (resultCode === "000001040") {
        //活动已结束
        this.hiddenPasswordModal();
        this.hiddenLoginModal();
        Toast.info("活动已经结束啦，下次再来吧。");
      } else if (resultCode === "000001041") {
        //openid 错误 从新授权换取openID
        this.hiddenPasswordModal();
        this.hiddenLoginModal();
        Toast.info("非法进入，请重新验证");
        reauthorize();
      } else if (resultCode === "000001043") {
        //该手机号已经被绑定
        this.hiddenPasswordModal();
        this.hiddenLoginModal();
        this.showMobileModal();
        Toast.info("您输入的手机号码已经被其他微信账号使用过，请重新输入或联系客服。",3);
      } else {
        Toast.info("服务器开小差，请稍后再试。");
      }
    });
  }

  //跳转至答题页面
  goAnswer() {
    this.hiddenSuccessModal();
    this.props.history.push('/answer.html');
  }
  // 初始机械码
  innitMachineNo() {
    const temporaryMachineNo = Date.now();
    return temporaryMachineNo;
  }

  // 生成机械码
  machineNoChange() {
    const temporaryMachineNo = Date.now();
    this.setState({
      machineNo: temporaryMachineNo
    });
  }

  // 倒计时
  handleClick() {
    if (this.state.liked) {
      const timer = setInterval(() => {
        let count = this.state.count;
        this.state.liked = false;
        count -= 1;
        if (count < 1) {
          window.clearInterval(timer);
          this.setState({
            liked: true
          });
          count = 60;
        }
        this.setState({
          count
        });
      }, 1000);
    }
  }

  render() {
    const text = this.state.liked ? '获取验证码' : `${this.state.count}秒后重发`;
    const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    return(
      <div className="index-page-wrap">
        <div className="text-contain">
          <div className="carousel-contain">
            <Carousel
              className="my-carousel"
              autoplay={true}
              infinite
              selectedIndex={1}
              swipeSpeed={35}
            >
              {this.state.data.map(ii => (
                <a key={ii} style={hProp}>
                  <img
                    src={ii}
                    alt="icon"
                  />
                </a>
              ))}
            </Carousel>
          </div>
          <p>（云南品质游、理财金券、雨伞、指甲刀套装、保温杯、话费、鸟币等礼品等你拿）</p>
        </div>
        <p onClick={() => this.goNext()} className="btn-join">立即参与</p>
        <div className="rule-wrap">
          <p>本次有奖问答仅限比赛现场的人员参加</p>
          <p>每人可参加一次</p>
          <p>完成答题后便可参与抽奖</p>
        </div>
        <Modal transparent maskClosable={false} visible={this.state.mobileModal} platform="ios">
          <div className="rule-content">
            <h4>输入手机号码参与答题</h4>
            <div className="long-contain">
              <img src={phone} alt="phone" />
              <input
                type="tel"
                maxLength="11"
                autoFocus="autofocus"
                value={this.state.phone}
                onChange={(e) => this.onPhoneChange(e)}
                placeholder="输入手机号码参与答题抽奖"
              />
            </div>
            <p onClick={() => this.checkPhone()} className="btn-submit">确定</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.loginModal} platform="ios">
          <div className="rule-content">
            <p className="note-text">
              话费奖励将直接充值到此号码
            </p>
            <div className="short-contain">
              <img className="icon" src={picCode} alt="picCode" />
              <input
                type="tel"
                maxLength="4"
                value={this.state.picCode}
                onChange={(e) => this.onPictureCodeChange(e)}
                placeholder="请输入图形验证码"
              />
              <img
              className="picCode" onClick={() => this.machineNoChange()}
              src={`/v3/user/register/pictureCode/${this.state.machineNo}`}
              alt="pictureCode"
              />
            </div>
            <div className="long-contain">
              <img src={password} alt="password" />
              <input
                type="password"
                maxLength="18"
                min="6"
                onChange={(e) => this.onChangePassword(e)}
                value={this.state.password}
                placeholder="请输入领投鸟账户密码"
              />
            </div>
            <p onClick={() => this.loginForm()} className="btn-submit">提交验证</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.passwordModal} platform="ios">
          <div className="rule-content">
            <p className="note-text">
              话费奖励将直接充值到此号码
            </p>
            <div className="short-contain">
              <img className="icon" src={picCode} alt="picCode" />
              <input
                type="tel"
                maxLength="4"
                value={this.state.picCode}
                onChange={(e) => this.onPictureCodeChange(e)}
                placeholder="请输入图形验证码"
              />
              <img
              className="picCode" onClick={() => this.machineNoChange()}
              src={`/v3/user/register/pictureCode/${this.state.machineNo}`}
              alt="pictureCode"
              />
            </div>
            <div className="short-contain">
              <img className="icon" src={message} alt="message" />
              <input
                type="tel"
                maxLength="4"
                value={this.state.mobileCode}
                onChange={(e) => this.onMobileCodeChange(e)}
                placeholder="请输入短信验证码"
              />
            <span onClick={() => this.getMobileCode()}>{text}</span>
            </div>
            <div className="long-contain">
              <img src={password} alt="password" />
              <input
                type="password"
                maxLength="18"
                min="6"
                onChange={(e) => this.onChangePassword(e)}
                value={this.state.password}
                placeholder="请输入6位以上字母与数字组合"
              />
            </div>
            <p onClick={() => this.submitForm()} className="btn-submit">提交验证</p>
          </div>
        </Modal>
        <Modal transparent maskClosable={false} visible={this.state.successModal} platform="ios">
          <div className="rule-content">
            <h4>提示</h4>
            <div className="success-content">
              <img src={dui} alt="对号" />
            <span>恭喜您，验证成功！</span>
            </div>
            <p onClick={() => this.goAnswer()} className="btn-submit">开始答题</p>
          </div>
        </Modal>
      </div>
    )
  }
}
export default IndexPage;

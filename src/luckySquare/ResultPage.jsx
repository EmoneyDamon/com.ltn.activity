import React from 'react';
import './ResultPage.scss';
import { ajaxPost } from '../common/AjaxApi';
import { reauthorize, login } from '../common/NativeApi';
import banner1 from './images/result/1.png';
import banner2 from './images/result/2.png';
import banner3 from './images/result/3.png';
import banner4 from './images/result/4.png';
import banner5 from './images/result/5.png';
import banner6 from './images/result/6.png';
import banner7 from './images/result/7.png';
import banner8 from './images/result/8.png';

class ResultPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      award1 : '',
      award2 : '',
      award3 : '',
      award4 : '',
      award5 : '',
      award6 : '',
      award7 : '',
      award8 : ''
    }
  }

  componentDidMount() {
    ajaxPost({
      url:'/luam/squareDance/select/user/award',
      params: {
        openId      : window.localStorage.getItem("openId"),
        sessionKey  : window.sessionStorage.getItem("ltn_sessionKey")
      }
    }).then((res) => {
      const awardCode = res.data.code;
      if (awardCode === '500001') {
        this.setState({
          award1:res.data.awardName
        });
      } else if (awardCode === '500002') {
        this.setState({
          award2:res.data.awardName
        });
      } else if (awardCode === '500003') {
        this.setState({
          award3:res.data.awardName
        });
      } else if (awardCode === '500004') {
        this.setState({
          award4:res.data.awardName
        });
      } else if (awardCode === '500005') {
        this.setState({
          award5:res.data.awardName
        });
      } else if (awardCode === '500006') {
        this.setState({
          award6:res.data.awardName
        });
      } else if (awardCode === '500007') {
        this.setState({
          award7:res.data.awardName
        });
      } else if (awardCode === '500008') {
        this.setState({
          award8:res.data.awardName
        });
      } else {
        this.setState({
          award8:res.data.awardName
        });
      }
    }, (mes) => {
      reauthorize();
    });
  }

  render() {
    return(
      <div className="result-wrap">
        {
          !!this.state.award1 && <div>
            <div className="banner">
              <img src={banner1} alt="奖品" />
            </div>
            <p className="gift">您已抽中<span>云南双人游</span></p>
            <p>请凭此页面至现场领奖台进行领奖！</p>
          </div>
        }
        {
          !!this.state.award2 && <div>
            <div className="banner">
              <img src={banner2} alt="奖品" />
            </div>
            <p className="gift">您已抽中<span>雨伞</span></p>
            <p>请凭此页面至现场领奖台进行领奖！</p>
          </div>
        }
        {
          !!this.state.award3 && <div>
            <div className="banner">
              <img src={banner4} alt="奖品" />
            </div>
            <p className="gift">您已抽中<span>指甲刀套装</span></p>
            <p>请凭此页面至现场领奖台进行领奖！</p>
          </div>
          }
          {
            !!this.state.award4 && <div>
                <div className="banner">
                  <img src={banner3} alt="奖品" />
                </div>
              <p className="gift">您已抽中<span>保温杯</span></p>
              <p>请凭此页面至现场领奖台进行领奖！</p>
            </div>
          }
          {
            !!this.state.award5 && <div>
                <div className="banner">
                  <img src={banner6} alt="奖品" />
                </div>
              <p className="gift">您已抽中<span>话费50元</span></p>
              <p>请凭此页面至现场领奖台进行领奖！</p>
            </div>
          }
          {
            !!this.state.award6 && <div>
                <div className="banner">
                  <img src={banner5} alt="奖品" />
                </div>
              <p className="gift">您已抽中<span>话费10元</span></p>
              <p>请凭此页面至现场领奖台进行领奖！</p>
            </div>
          }
          {
            !!this.state.award7 && <div>
                <div className="banner">
                  <img src={banner7} alt="奖品" />
                </div>
              <p className="gift">您已抽中<span>10鸟币</span></p>
              <p onClick={() => window.location.href = "/native/account_viewall/account_viewall.html?source=h5"}>去领投鸟查看</p>
            </div>
          }
          {
            !!this.state.award8 && <div>
                <div className="banner">
                  <img src={banner8} alt="奖品" />
                </div>
              <p className="gift">您已抽中<span>68元返现券</span></p>
              <p onClick={() => window.location.href = "/native/account_viewall/account_viewall.html?source=h5"}>去领投鸟查看</p>
            </div>
          }
      </div>
    )
  }
}
export default ResultPage;

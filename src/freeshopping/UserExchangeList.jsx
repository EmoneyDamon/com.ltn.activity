import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'antd-mobile';
import loadsh from 'lodash';
import moment from 'moment';
import { login } from '../common/NativeApi';
import { ajaxGet } from '../common/AjaxApi';

class UserExchangeList extends React.Component {
  constructor(props) {
    console.log(props.sessionKey);
    super(props);
    this.state = {
      isAjaxLoading: false,
      pageNo: 0,
      pageSize: 5,
      totalPage: 0,
      exchangeList: []
    };
  }
  componentDidMount() {
    this.getVitalityList(this.state.pageNo);
  }

  // 查询平台兑奖记录
  getVitalityList(tempPageNo) {
    Toast.loading('数据加载...', 0);
    ajaxGet({
      url: '/uam/zerobuy/my/exchangeList',
      params: {
        pageNo: tempPageNo,
        pageSize: this.state.pageSize
      }
    }).then(({ data }) => {
      this.setState({
        totalPage: Math.ceil(data.total / this.state.pageSize) - 1,
        exchangeList: data.data
      });
      Toast.hide();
    }, ({ message }) => {
      console.log(message);
      Toast.hide();
    });
  }
  page(type) {
    let tempPageNo;
    if (type === 'pre' && this.state.pageNo > 0) {
      tempPageNo = this.state.pageNo - 1;
      this.setState({ pageNo: tempPageNo });
      this.getVitalityList(tempPageNo);
    } else if (type === 'next' && this.state.pageNo < this.state.totalPage) {
      tempPageNo = this.state.pageNo + 1;
      this.setState({ pageNo: tempPageNo });
      this.getVitalityList(tempPageNo);
    }
  }
  goLogin() {
    login(window.location.href);
  }
  render() {
    return (
      <div>
        {// 未登陆
        !this.props.sessionKey && (
          <div className="user">
            <p>
              <span>
                <a role="button" className="login-btn" onClick={this.goLogin}>登录查看</a>
              </span>
            </p>
          </div>
        )
        }
        {// 登陆
          this.props.sessionKey && <div className="user">
            <p className="title">
              <span>兑换日期</span>
              <span>心愿值</span>
              <span>兑换奖品</span>
            </p>
            {
              this.state.exchangeList.length === 0 && (
                <p className="page">
                  <span />
                  <span>暂无数据</span>
                  <span />
                </p>
              )
            }
            {
             this.state.exchangeList.map(data => (
               <p key={loadsh.uniqueId(data.awardId)}>
                 <span>{moment(data.exchangeDate).format('MM.DD')}</span>
                 <span>{data.useVitality}</span>
                 <span>{data.awardShortName}</span>
               </p>
            ))
            }
            {
              this.state.exchangeList.length !== 0 && (
                <p className="page">
                  <span onClick={() => this.page('pre')}>上一页</span>
                  <span>{this.state.pageNo + 1}/{this.state.totalPage + 1}</span>
                  <span onClick={() => this.page('next')}>下一页</span>
                </p>
              )
            }
          </div>
        }
      </div>
    );
  }
}
UserExchangeList.propTypes = {
  sessionKey: PropTypes.string.isRequired
};

export default UserExchangeList;

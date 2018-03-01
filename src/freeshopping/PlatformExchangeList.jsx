import React from 'react';
import { Toast } from 'antd-mobile';
import loadsh from 'lodash';
import moment from 'moment';
import { ajaxGet } from '../common/AjaxApi';

class PlatformExchangeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAjaxLoading: false,
      pageNo: 1,
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
      url: '/uam/zerobuy/platform/exchangeList',
      params: {
        pageNo: tempPageNo - 1,
        pageSize: this.state.pageSize
      }
    }).then(({ data }) => {
      this.setState({
        totalPage: Math.ceil(data.total / this.state.pageSize),
        exchangeList: data.data
      });
      Toast.hide();
    }, ({ message }) => {
      Toast.fail(message);
      Toast.hide();
    });
  }
  page(type) {
    let tempPageNo;
    if (type === 'pre' && this.state.pageNo > 1) {
      tempPageNo = this.state.pageNo - 1;
      this.setState({ pageNo: tempPageNo });
      this.getVitalityList(tempPageNo);
    } else if (type === 'next' && this.state.pageNo < this.state.totalPage) {
      tempPageNo = this.state.pageNo + 1;
      this.setState({ pageNo: tempPageNo });
      this.getVitalityList(tempPageNo);
    }
  }
  render() {
    return (
      <div className="platform">
        <p className="title">
          <span>账号</span>
          <span>兑换日期</span>
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
              <span>{data.mobileNo}</span>
              <span>{moment(data.exchangeDate).format('MM.DD')}</span>
              <span>{data.awardShortName}</span>
            </p>
         ))
        }
        {
          this.state.exchangeList.length !== 0 && (
            <p className="page">
              <span onClick={() => this.page('pre')}>上一页</span>
              <span>{this.state.pageNo}/{this.state.totalPage}</span>
              <span onClick={() => this.page('next')}>下一页</span>
            </p>
          )
        }
      </div>
    );
  }
}

export default PlatformExchangeList;

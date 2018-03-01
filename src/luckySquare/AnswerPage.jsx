import React from 'react';
import { Toast } from 'antd-mobile';
import './AnswerPage.scss';
import banner from './images/answer-banner.png';

class AnswerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueList : [
        {value:false},
        {value:false},
        {value:false}
      ]
    }
  }

  onChange(value,checked) {
    const valueList = this.state.valueList;
    valueList[value].value = checked;
    this.setState({
      valueList,
    });
    if (!checked) {
      Toast.info("本题答错了，换个选项试试！",3);
    }
  };

  goLuckDraw() {
    const valueList = this.state.valueList;
    if(valueList[0].value && valueList[1].value && valueList[2].value) {
      this.props.history.push("/sweepstake.html");
    } else {
      Toast.info("您有题目未答或答错啦，快去修改吧。");
    }
  }

  render() {
    return(
      <div className="answer-page-wrap">
        <div className="banner">
          <img src={banner} alt="领投鸟介绍" />
        </div>
        <div className="introduce-contain">
          <p>领投鸟是一家消费金融服务平台，注册资本<span>1亿元</span>，平台注册用户超过<span>34万人</span>，累计为用户赚取收益<span>2500余万元</span>。领投鸟遵从合规、透明、稳定的发展理念，通过大数据、接入银行存管、电子合同等风控手段，为用户提供放心的互联网金融服务。</p>
        </div>
        <div className="question-contain-wrap">
          <p className="start">开始答题</p>
          <div className="question">
            <p className="num"><span>1</span>/3</p>
          <p className="question-name">领投鸟是什么样的平台？</p>
            <div onClick={() => this.onChange(0,true)} className="selection">
              <input name="what" type="radio" id="jinrong" />
              <label htmlFor="jinrong">家庭消费金融服务平台</label>
            </div>
            <div onClick={() => this.onChange(0,false)} className="selection">
              <input name="what" type="radio" id="dianshang" />
              <label htmlFor="dianshang">电子商务平台</label>
            </div>
          </div>
          <div className="question">
            <p className="num"><span>2</span>/3</p>
          <p className="question-name">领投鸟注册资本已增加至:</p>
            <div onClick={() => this.onChange(1,false)} className="selection">
              <input name="ziben" type="radio" id="wan" />
              <label htmlFor="wan">5000万</label>
            </div>
            <div onClick={() => this.onChange(1,true)} className="selection">
              <input name="ziben" type="radio" id="yi" />
              <label htmlFor="yi">1亿</label>
            </div>
          </div>
          <div className="question">
            <p className="num"><span>3</span>/3</p>
            <p className="question-name">你可以在领投鸟实现？</p>
            <div onClick={() => this.onChange(2,true)} className="selection">
              <input name="shixian" type="radio" id="licai" />
              <label htmlFor="licai">投资理财</label>
            </div>
            <div onClick={() => this.onChange(2,false)} className="selection">
              <input name="shixian" type="radio" id="qiche" />
              <label htmlFor="qiche">买卖汽车</label>
            </div>
          </div>
        </div>
        <p onClick={() => this.goLuckDraw()} className="submit">提交</p>
      </div>
    )
  }
}
export default AnswerPage;

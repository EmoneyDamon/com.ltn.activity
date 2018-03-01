import React from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';

import img1 from './imgs/huangjing/1.png';
import img2 from './imgs/huangjing/2.png';
import img3 from './imgs/huangjing/3.png';
import img4 from './imgs/huangjing/4.png';
import img5 from './imgs/huangjing/5.png';
import img6 from './imgs/huangjing/6.png';
import img7 from './imgs/huangjing/7.png';
import img8 from './imgs/huangjing/8.png';
import cjbtn from './imgs/cjbtn.png';

const HuangJingPrizeArray = [
  {
    id: 1,
    name: '领投鸟公仔',
    img: img1
  },
  {
    id: 2,
    name: 'U型枕头',
    img: img2
  },
  {
    id: 3,
    name: '谢谢参与',
    img: img3
  },
  {
    id: 8,
    name: '佰草集新玉润套餐',
    img: img8
  },
  {
    id: 9,
    name: '这是按钮',
    img: cjbtn
  },
  {
    id: 4,
    name: '佰草集新恒美套装',
    img: img4
  },
  {
    id: 7,
    name: '上海迪士尼1日游套票(两大一小)',
    img: img7
  },
  {
    id: 6,
    name: '谢谢参与',
    img: img6
  },
  {
    id: 5,
    name: '科沃斯扫地机器人',
    img: img5
  }
];

const HuangJing = (props) => {
  const { active, startRoll, sid, gold } = props;
  return (
    <div className="zp baiying cf">
      {
          HuangJingPrizeArray.map((prize) => {
            if (prize.id === 9) {
              return (
                <div key={lodash.uniqueId(`item${prize.id}`)} className="item btn" onClick={() => startRoll('gold')}>
                  <img src={prize.img} alt={prize.name} />
                </div>
              );
            }
            return (
              <div
                key={lodash.uniqueId(`item${prize.id}`)}
                className={prize.id === active ? 'item active' : 'item'}
              >
                <img src={prize.img} alt={prize.name} />
              </div>
            );
          })
        }
      <div className="cf" />
      <p className="cj-changes cf">当前黄金转盘还有
        {
          sid && <span>{gold}</span>
        }
        {
          !sid && <span>--</span>
        }
            次抽奖机会</p>
    </div>
  );
};
HuangJing.propTypes = {
  active: PropTypes.number.isRequired,
  gold: PropTypes.string.isRequired,
  sid: PropTypes.string,
  startRoll: PropTypes.func.isRequired
};
HuangJing.defaultProps = {
  sid: null
};
export default HuangJing;

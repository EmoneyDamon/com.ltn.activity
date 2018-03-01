import React from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';

import img1 from './imgs/baiying/1.png';
import img2 from './imgs/baiying/2.png';
import img3 from './imgs/baiying/3.png';
import img4 from './imgs/baiying/4.png';
import img5 from './imgs/baiying/5.png';
import img6 from './imgs/baiying/6.png';
import img7 from './imgs/baiying/7.png';
import img8 from './imgs/baiying/8.png';
import cjbtn from './imgs/cjbtn.png';

const BaiYingPrizeArray = [
  {
    id: 1,
    name: '指甲刀套装',
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
    name: '领投鸟公仔',
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
    name: '佰草集新玉润套装',
    img: img7
  },
  {
    id: 6,
    name: '谢谢参与',
    img: img6
  },
  {
    id: 5,
    name: '扫地机器人',
    img: img5
  }
];

const BaiYing = (props) => {
  const { active, startRoll, sid, silver } = props;
  return (
    <div className="zp baiying cf">
      {
          BaiYingPrizeArray.map((prize) => {
            if (prize.id === 9) {
              return (
                <div key={lodash.uniqueId(`item${prize.id}`)} className="item btn" onClick={() => startRoll('silver')}>
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
      <p className="cj-changes cf">当前白银转盘还有
        {
          sid && <span>{silver}</span>
        }
        {
          !sid && <span>--</span>
        }
          次抽奖机会</p>
    </div>
  );
};

BaiYing.propTypes = {
  active: PropTypes.number.isRequired,
  silver: PropTypes.string.isRequired,
  sid: PropTypes.string,
  startRoll: PropTypes.func.isRequired
};
BaiYing.defaultProps = {
  sid: null
};
export default BaiYing;

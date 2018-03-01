import React from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';

import img1 from './images/1.png';
import img2 from './images/2.png';
import img3 from './images/3.png';
import img4 from './images/4.png';
import img5 from './images/5.png';
import img6 from './images/6.png';
import img7 from './images/7.png';
import img8 from './images/8.png';
import cjbtn from './images/cjbtn.png';

const BaiYingPrizeArray = [
  {
    id: 1,
    name: '云南双人游',
    img: img1
  },
  {
    id: 2,
    name: '雨伞',
    img: img2
  },
  {
    id: 3,
    name: '话费',
    img: img3
  },
  {
    id: 8,
    name: '指甲刀',
    img: img8
  },
  {
    id: 9,
    name: '开始抽奖',
    img: cjbtn
  },
  {
    id: 4,
    name: '鸟币',
    img: img4
  },
  {
    id: 7,
    name: '话费',
    img: img7
  },
  {
    id: 6,
    name: '理财金券',
    img: img6
  },
  {
    id: 5,
    name: '保温杯',
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

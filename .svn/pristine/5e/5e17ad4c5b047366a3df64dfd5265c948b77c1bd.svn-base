
// 弹幕
const { addAPIConfig } = require('../utils/config.js');
const { getRequest } = require('../utils/request.js');

addAPIConfig('BULLET_INDEX', '/message/m/index');
addAPIConfig('BULLET_DETAIL', '/message/m/detail');

const getBulletIndex = () => {
  return getRequest('BULLET_INDEX');
}

const getBulletDetail = (spuid) => {
  return getRequest('BULLET_DETAIL', {
    spuid: spuid
  });
}

module.exports = {
  getBulletIndex,
  getBulletDetail
}  
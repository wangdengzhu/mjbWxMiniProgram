
const { addAPIConfig } = require('../utils/config.js');
const { getRequest } = require('../utils/request.js');

addAPIConfig('ACTIVITY_BG', '/goods/m/activities/h5page');
addAPIConfig('ACTIVITY_GOODS', '/goods/m/activities/goods');

const getActivityBg = (activityid) => {
  return getRequest('ACTIVITY_BG', {
    activityid: activityid
  });
}

const getActivityGoods = (activityid) => {
  return getRequest('ACTIVITY_GOODS', {
    activityid: activityid
  });
}

module.exports = {
  getActivityBg,
  getActivityGoods
}
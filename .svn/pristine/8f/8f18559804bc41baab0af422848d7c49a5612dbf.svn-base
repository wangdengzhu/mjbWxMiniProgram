
const { addAPIConfig } = require('../utils/config.js');
const { getRequest } = require('../utils/request.js');

addAPIConfig('SHOP_INFO', '/shop/m/info');

const getShopInfo = () => {
  return getRequest('SHOP_INFO');
}

module.exports = {
  getShopInfo
}
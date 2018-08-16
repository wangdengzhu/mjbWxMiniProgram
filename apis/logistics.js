/**
 * 物流信息
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');
// 增加接口映射
addAPIConfig('get_express_list', '/order/m/express'); // 查看物流
addAPIConfig('get_details', '/order/m/details'); // 查看订单详情
// 获取物流信息
const getExpressList = ({
  shipmentId = '',
  expressNo = ''
}) => {
  return getRequest({
    name: 'get_express_list',
    data: {
      shipmentId,
      expressNo
    }
  })
}
// 查看订单详情
const getDetails = ({
  orderNo = '',
}) => {
  return getRequest({
    name: 'get_details',
    data: {
      orderNo
    }
  })
}

module.exports = {
  getExpressList,
  getDetails
}
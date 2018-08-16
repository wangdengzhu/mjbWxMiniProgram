/**
 * 售后
*/
const { addAPIConfig, getAPIUrl } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('AFTERSALE_LIST', '/aftersale/m/list');
addAPIConfig('AFTERSALE_DETAIL', '/aftersale/m/detail');
addAPIConfig('CANCEL_AFTERSALE', '/aftersale/m/cancel');
addAPIConfig('GET_EXPRESSLIST', '/aftersale/m/expressList');
addAPIConfig('RETURN', '/aftersale/m/return');
addAPIConfig('GET_EXPRESS_INFO', '/aftersale/m/afterexpress');
addAPIConfig('AFTERSALE_UPLOADEVIDENCE', '/aftersale/m/uploadEvidence');
addAPIConfig('AFTERSALE_CREATE', '/aftersale/m/create');
addAPIConfig('CONFRIMRECEIPT', '/aftersale/m/confirmreceipt');
addAPIConfig('APPLY_PLATFORM', '/aftersale/m/platformHandle');

// 申请平台
// 这里实际是asorderno 后端参数写错
const applyPlatform = ({
  orderNo
}, autoShowLoading = true) => {
  return postRequest({
    name: 'APPLY_PLATFORM',
    data: {
      orderNo
    },
    autoShowLoading
  });
}

// 确认售后收货
const confirmReceiving = ({
  asOrderNo
}, autoShowLoading = true) => {
  return getRequest({
    name: 'CONFRIMRECEIPT',
    data: {
      asOrderNo
    },
    autoShowLoading
  });
}

// 申请记录
const getAfterList = ({
  pageindex = 1,
  pagesize = 10,
  status = 0,
}, autoShowLoading = true) => {
  return postRequest({
    name: 'AFTERSALE_LIST',
    data: {
      pageindex,
      pagesize,
      status
    },
    autoShowLoading
  });
}

// 售后详情
const aftersaleDetail = (options, asOrderNo) => {
  options.url = getAPIUrl('AFTERSALE_DETAIL') + `/${asOrderNo}`
  return getRequest(options);
}

// 撤销申请
// const cancelAftersale = ({
//   asOrderNo,
//   closeType
// }, autoShowLoading = true) => {
//   return postRequest({
//     name: 'CANCEL_AFTERSALE',
//     data: {
//       asOrderNo,
//       closeType
//     },
//     autoShowLoading
//   });
// }

const cancelAftersale = (options, data) => {
  options.name = "CANCEL_AFTERSALE";
  return postRequest(options, data);
}

// 快递列表
const getExpress = () => {
  return getRequest('GET_EXPRESSLIST')
}

// 提交退货单
const submitReturn = ({
  asOrderNo,
  expressNo,
  expressName,
  asExpressId,
  evidenceName
}, autoShowLoading = true) => {
  return postRequest({
    name: 'RETURN',
    data: {
      asOrderNo,
      expressNo,
      expressName,
      asExpressId,
      evidenceName
    },
    autoShowLoading
  });
}

// 获取退货物流信息
const getExpressInfo = ({
  reqInfo
}, autoShowLoading = true) => {
  return getRequest({
    name: 'GET_EXPRESS_INFO',
    data: {
      reqInfo
    },
    autoShowLoading
  })
}

const createAftersale = (data, autoShowLoading = true) => {
  return postRequest({
    name: 'AFTERSALE_CREATE',
    data: data,
    autoShowLoading
  })
}

module.exports = {
  getAfterList,
  aftersaleDetail,
  cancelAftersale,
  getExpress,
  submitReturn,
  getExpressInfo,
  createAftersale,
  confirmReceiving,
  applyPlatform
}
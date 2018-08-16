/**用户*/
const { addAPIConfig, getAPIUrl } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('USER_GETFEEDBACKTYPE','/user/m/getfeedbacktype');// 反馈类型
addAPIConfig('USER_ADDFEEDBACK2','/user/m/addfeedbackv2');// 添加反馈2
addAPIConfig('USER_UPLOADVOUCHER','/user/m/uploadvoucher');// 上传凭证

// 获取反馈类型
const getFeedBackType = (options = {}) => {
  options.name = 'USER_GETFEEDBACKTYPE';
  return getRequest(options)
}

// 添加反馈
const addFeedback = (options = {}) => {
  options.name = 'USER_ADDFEEDBACK2';
  return postRequest(options)
}

module.exports={
  getFeedBackType,
  addFeedback
}
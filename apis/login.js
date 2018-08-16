/**
 * 登录授权相关
*/
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('AUTH', '/wx/m/getopenid');
addAPIConfig('GET_SHOPID', '/wx/m/getshopid');
addAPIConfig('AUTO_LOGIN', '/wx/m/miniautologin');

addAPIConfig('GET_CODE', '/user/m/getcode');
addAPIConfig('LOGIN', '/user/m/login');

addAPIConfig('BIND_WECHAT_INFO', '/wx/m/bindwechatface');
addAPIConfig('GET_USER_INFO', '/user/m/getuserinfo');
addAPIConfig('MOBILE_IS_CAN_BIND', '/wx/m/mobileiscanbind');

const mobileCanUse = (options, data) => {
  options.name = 'MOBILE_IS_CAN_BIND';
  return getRequest(options, data)
};

const getUserInfo = (options) => {
  options.name = 'GET_USER_INFO';
  return getRequest(options);
};

const bindWechatInfo = (options, data) => {
  options.name = 'BIND_WECHAT_INFO';
  return postRequest(options, data);
};

const getAuth = (data, autoShowLoading = false, autoHideLoading=true) => {
  return getRequest({
    name: 'AUTH',
    data: data,
    autoShowLoading,
    autoHideLoading,
    isCustomError:true
  });
};

const autoLogin = (options={}) => {
  options.name ="AUTO_LOGIN";
  options.isCustomError = options.isCustomError||true;
  options.autoShowLoading = options.autoShowLoading||false;
  return getRequest(options);
};

const getCode = (phone => {
  return postRequest('GET_CODE', {
    mobile: phone,
    smstype: 1
  });
});

const login = (options, data) => {
  options.name = 'LOGIN';
  return postRequest(options, data);
};

const getShopId = (options={}) => {
  options.name ="GET_SHOPID";
  options.autoShowLoading=false;
  return getRequest(options);
};

module.exports = {
  getAuth,
  getCode,
  login,
  getShopId,
  autoLogin,
  bindWechatInfo,
  getUserInfo,
  mobileCanUse
}
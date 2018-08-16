/**
 * 项目公共资源配置文件
 * ***/
const GLOBALVARS = {
  env: 'test' //production:线上 test: 测试 development: 开发
}
//商品和购物车购买上限
const GOODS_NUM_LIMIT = 200;
const CARTS_NUM_LIMIT = 99;
// API服务器地址
const SERVERS = {
  // 默认接口数据服务器
  "production": "https://api.manjd.com/api", // 正式环境
  "development": 'http://devapi.manjd.com/api', // 开发环境
  "test": 'https://checkapi.manjd.com/api', // 测试环境
  //socket服务器
  "socket": '',
  //图片服务器
  "image": "https://devskin.manjd.net/miniprogram/images",
  "productionChat": "https://m.manjd.com",
  "developmentChat": "http://devm.manjd.com",
  "testChat": "http://checkm.manjd.com"
};

let configs = {}
let addAPIConfig = createConfig(GLOBALVARS.env);
let getAPIUrl = createReadConfig(GLOBALVARS.env);

let addImageConfig = createConfig('image');
let getImageUrl = createReadConfig('image');

let addChatDomain = createConfig(GLOBALVARS.env + 'Chat')
let getChatDomain = createReadConfig(GLOBALVARS.env + 'Chat');

addImageConfig('empty', '/empty/empty-no-goods.png')
addImageConfig('logo', '/bind-logo.png')
addImageConfig('share', '/share2.png')
addImageConfig('goods-close', '/goods/close.png?v=1')
addImageConfig('goods-shipping', '/goods/Shipping.png')
addImageConfig('goods-7day', '/goods/7day.png')
addImageConfig('goods-24Ship', '/goods/24Ship.png')
addImageConfig('goods-quality', '/goods/quality.png')
addImageConfig('evaluate-empty', '/goods/evaluate-empty.png')
addImageConfig('pay-success', '/order/pay-success.png')
addImageConfig('pay-fail', '/order/pay-fail.png')

// empty图标
addImageConfig('empty-add-goods', '/empty/empty-add-goods.png')
addImageConfig('empty-cart-no-goods', '/empty/empty-cart-no-goods.png')
addImageConfig('empty-loading-fail', '/empty/empty-loading-fail.png')
addImageConfig('empty-no-apply-aftersale', '/empty/empty-no-apply-aftersale.png')
addImageConfig('empty-no-canevaluate', '/empty/empty-no-canevaluate.png')
addImageConfig('empty-no-data', '/empty/empty-no-data.png')
addImageConfig('empty-no-evaluate', '/empty/empty-no-evaluate.png')
addImageConfig('empty-no-goods', '/empty/empty-no-goods.png')
addImageConfig('empty-no-net', '/empty/empty-no-net.png')
addImageConfig('empty-no-order', '/empty/empty-no-order.png')
addImageConfig('empty-no-specifically', '/empty/empty-no-specifically.png')
addImageConfig('emtpy-no-address', '/empty/emtpy-no-address.png')



addChatDomain('chatDomain', '/buyer/chat');

/**
 * 创建添加配置函数，
 * @param {string} serverName 服务器配置名
 * @return {function}
*/
function createConfig(serverName) {
  if (!SERVERS.hasOwnProperty(serverName)){
    throw `crateConfig name:${serverName} not exist`
  }
  var _configs = configs[serverName] = {};
  return function(name, value) {
    if (_configs[name]) {
      throw new Error('该配置名已存在')
    }
    _configs[name] = value;
  }
}
/**
 * 创建读取配置函数，
 * @param {string} serverName 服务器配置名
 * @return {function}
*/
function createReadConfig(serverName) {
  if (!SERVERS.hasOwnProperty(serverName)) {
    throw `createReadConfig name:${serverName} not exist`
  }
  var serverAddress = SERVERS[serverName];
  var _configs = configs[serverName];
  return function(name) {
    let url = _configs[name];
    if (!url) {
      throw "config  not found " + name;
    }
    if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
      return url;
    }
    return serverAddress + url;
  }
}

module.exports = {
  GOODS_NUM_LIMIT,
  CARTS_NUM_LIMIT,
  GLOBALVARS,
  addImageConfig,
  getImageUrl,
  addAPIConfig,
  getAPIUrl,
  SERVERS,
  addChatDomain,
  getChatDomain

}
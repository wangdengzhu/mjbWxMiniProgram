/**
 * 满金店公共框架
 * 
 */
const {
  GLOBALVAR
} = require('./config.js')
const util = require('./util.js')
let requestExport = require('./request.js')
const wxAPi = require('./wx-api.js')
const {
  getKeys,
  each,
  extend,
  hasOwnProperty,
  toArray,
  isArray,
  wrapPromise,
  Observable,
  mergeHandler,
  Scheduler,
  Callbacks
} = util
let mjd = {}

const { getAuth, getShopId, autoLogin } = require('../apis/login.js');
const TOKEN_KEY = 'SYSTEM_SERVER_TOKEN';// token
const OPENID_KEY = 'SYSTEM_SERVER_OPENID';//miniopenid
const SHOPID_KEY = 'SYSTEM_SERVER_SHOPID';// shopid

let preventDefault = function () {
  this.isDefaultPrevented = true;
}


/*
网络状态监听
*/
function initNetworkStatusChange() {
  // 网络检查
  wx.onNetworkStatusChange((res) => {
    let { networkType, isConnected } = res, msg = '', showMsg = true;
    if (!isConnected) {
      msg = '网络有点问题，请检查您的网络!';
    }
    else if (networkType == 'none') {
      msg = '网络不太稳定，请稍后再试!';
    }
    let e = {
      networkType,
      isConnected,
      preventDefault,// 取消默认行为
      isDefaultPrevented: false
    }
    this.emit('onNetworkStatusChange', e);
    if (!e.isDefaultPrevented && msg != '') {
      wx.showToast({
        title: msg,
        icon: 'none'
      });
      return;
    }
  });
}
// 初始化APP 设置
function onInitApp() {
  requestExport.setCommonHeader('sharesource', 1);// 分享源
  // 报401登录失效，自动登录，接口重连
  requestExport.requestObservable.on('logout', (rerequest) => {
    this.logout().then(rerequest, () => {
      wx.showToast({ title: '登录失效', icon: 'none' })
    });
  })
  initNetworkStatusChange.call(this);
}

/**
 * 启动APP
 * 
 */
function startApp() {
  const shopCallback = Callbacks('once memory');
  const observable = new Observable(); // APP事件订阅对象
  observable.on('onLaunch', onInitApp);//
  let app = App({
    on: observable.on.bind(observable),
    off: observable.off.bind(observable),
    emit: observable.emit.bind(observable),
    // 全局只执行一次
    onLaunch: function (e) {
      // 获取设置信息,供全局使用
      try {
        this.globalData.stytemInfo = wx.getSystemInfoSync()
      } catch (e) {

      }
      // 设置事件对象this指针
      observable.setContext(this);
      observable.emit('onLaunch', e);

      // 获取shopid,检查登录状态
      let token = wx.getStorageSync(TOKEN_KEY);
      getShopId({
        header: {
          token: token,// 设置上次登录token
          shopid: 1
        },
        data: {
          // 用于后台业务标识判断。0：不需要验证shopid,大于0验证shopid是否合法ID
          shopid: e.query.hasOwnProperty('shopid') ? e.query.shopid : 0
        }
      }).then(({ shopId, isLogined }) => {
        this.setShopId(shopId);// 设置shopid到header
        // 如果没有登录，自动登录
        if (!isLogined) {
          this.checkLogin().catch(() => { }).then(() => {
            shopCallback.fire();
          });
        } else {
          this.setLoginToken(token);
          requestExport.setCommonHeader('miniopenid', wx.getStorageSync(OPENID_KEY));
          shopCallback.fire();
        }
      });
    },
    shopidcallback(callback) {
      shopCallback.add(callback);
    },
    // 监听网络情况
    onNetworkStatusChange(callback) {
      this.off('onNetworkStatusChange');
      this.on('onNetworkStatusChange', callback)

    },
    //当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow() {
    },
    onHide() {
      // Do something when hide.
    },
    // 处理系统错误
    onError(msg) {

    },
    // 处理404 页面找不到
    onPageNotFound() {

    },
    mjd: mjd,
    // 全局
    GLOBALVAR: GLOBALVAR,
    Page: extendPage, // 注册页面
    Component: extendComponent, // 注册组件
    globalData: {
      options: {},
      shopid: -1,
      stytemInfo: null,
      userInfo: null,
      pageTempData: null // 页面临时数据
    },
    setShopId(shopId) {
      this.globalData.shopid = shopId;
      requestExport.setCommonHeader('shopid', shopId);
      wx.setStorageSync(SHOPID_KEY, shopId);
    },
    setLoginToken(token) {
      this.globalData.userInfo = true;
      // 绑定
      requestExport.setCommonHeader('token', token);
      wx.setStorageSync(TOKEN_KEY, token);
    },
    clearLoginToken() {
      this.globalData.userInfo = null;
      // 绑定
      requestExport.removeCommonHeader('token');
      wx.removeStorage({
        key: TOKEN_KEY
      });
    },
    logout() {
      this.clearLoginToken();
      return this.checkLogin();
    },
    checkLogin(showLoading = false) {
      return new Promise((resolve, reject) => {
        let login = () => {
          // 登录
          appLogin(showLoading).then((token) => {
            this.setLoginToken(token);
            resolve(token);
          }, () => {
            showLoading && wx.hideLoading();
            this.clearLoginToken();
            reject();
          })
        }
        login();
        // 检查session是否失效
        // wx.checkSession({
        //   success:(d)=>{
        //     let openid = wx.getStorageSync(OPENID_KEY);
        //    // login();
        //     if (openid!=null&&openid!=''){
        //       requestExport.setCommonHeader('miniopenid', openid);
        //       userLogin().then((token)=>{
        //         this.setLoginToken(token);
        //         resolve(token);
        //       },()=>{
        //         this.clearLoginToken();
        //         reject();
        //       });
        //     }else{
        //       login();
        //     }
        //   },
        //   fail: login
        // })

      })

    }

  });

}


// 用户登录
function userLogin() {
  return autoLogin({
  }).then(res => {
    if (res.bindstatus === 1) {
      return res.token;
    } else {
      return Promise.reject();
    }
  }, () => {
    wx.showToast({ title: '登录失败', icon: 'none' })
    return Promise.reject();
  });
}

// APP用户登录
function appLogin(showLoading = true) {
  return new Promise((resolve, reject) => {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          getAuth({
            js_code: res.code
          }, showLoading, false).then(res => {
            let open_id = res;
            requestExport.setCommonHeader('miniopenid', open_id);
            wx.setStorage({
              key: OPENID_KEY,
              data: open_id,
            });
            userLogin().then(resolve, reject);
          }, (e) => {
            wx.showToast({ title: '获取openid失败！', icon: 'none' })
            reject();
          });
        } else {
          reject();
        }
      },
      fail: () => {
        reject();
      }
    })
  });
}


let defaultOptionHook = (function () {
  return {
    handler: function (src, copy, name, target, source) {
      target[name] = copy;
    }
  }
}());

function craeteExtendOptions(hooks) {
  hooks = extend({}, defaultOptionHook, hooks)
  return function extendOption(target, source) {
    each(source, (copy, name) => {
      let handler = hooks[name] || hooks.handler;
      if (handler) {
        handler(target[name], copy, name, target, source);
      }
    })
    return target;
  }
}
const extendPageOption = craeteExtendOptions({
  'handler': function (src, copy, name, target, source) {
    if (util.isFunction(src)) {
      target[name] = copy ? mergeHandler([src, copy]) : src;
    } else {
      target[name] = copy;
    }
  },
  'data': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  }
});
const extendComponentOption = craeteExtendOptions({
  'handler': function (src, copy, name, target, source) {
    if (util.isFunction(src)) {
      target[name] = mergeHandler([src, copy]);
    } else {
      target[name] = copy;
    }
  },
  'data': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  },
  'properties': function (src, copy, name, target, source) {
    if (util.isPlainObject(src)) {
      target[name] = extend(src, copy)
    }
  }
});

var PATH_REGEXP = /\[[^\]]+\]|[^.\[]+/g, PATH_KEY_REGEXP = /[\w-]+/;
let setter = function (obj, path, value) {
  let paths = path.match(PATH_REGEXP), key = path, i, len, current = obj;
  if (paths && paths.length > 1) {
    key = paths.pop();
    len = paths.length;
    i = -1;
    if (key.charAt(0) == '[') {
      key = key.match(PATH_KEY_REGEXP)[0]
    }
    while (++i < len && current) {
      current = current[paths[i]];
    }
  }
  if (current) {
    current[key] = value;
  }
}
/***
 * 扩展页面注册基类
 * Base Page 
 * 
 */
function extendPage(proto) {
  const orgLoad = proto.onLoad;
  proto.onLoad = null;
  const orgShow = proto.onShow;
  proto.onShow = null;
  const scheduler = new Scheduler();// 性能优化，避免setData 多次触所导致页面卡顿，或性能受损
  const observable = new Observable(); // 增加页面事件订阅机制
  const app = getApp();
  let defaultProto = {
    mjd: mjd,
    // 默认自动加载用户信息
    autoLoadUserInfo: false,
    enableNetworkStatusChange: 0,// 是否启用网络状态监听 0 不启用 1：启用 2：启用并取消默认行为
    on: observable.on.bind(observable),
    off: observable.on.bind(observable),
    emit: observable.emit.bind(observable),
    /**
     * 页面的初始数据
     */
    data: {
      hasUserInfo: false,
      networkStatus: {
        networkType: '4g',
        isConnected: true,
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (this.autoLoadUserInfo) {
        this.loadUserInfo();
      }
      app.shopidcallback(() => {
        orgLoad.call(this, options);
      })
      // 判断是否设置网络监听
      if (this.enableNetworkStatusChange != 0) {
        app.onNetworkStatusChange((res) => {
          this.setData({
            ['networkStatus.networkType']: res.networkType,
            ['networkStatus.isConnected']: res.isConnected
          })
          this.enableNetworkStatusChange == 2 && res.preventDefault();
        })
      }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },
    setNextData: function (data, callback) {
      this.setData(data, callback);
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      function encodeSearchParams(obj) {
        const params = []
        Object.keys(obj).forEach((key) => {
          let value = obj[key];
          if (typeof value === 'undefined') {
            value = ''
          }
          params.push([key, encodeURIComponent(value)].join('='))
        })
        return params.join('&')
      }
      // 18-08-07修改
      // 不同店铺分享出去，监听options中shopid是否发生变化
      if (this.options.shopid && this.options.shopid != wx.getStorageSync('SYSTEM_SERVER_SHOPID')) {
        app.globalData.shopid = this.options.shopid;
        wx.setStorageSync('SYSTEM_SERVER_SHOPID', this.options.shopid);
        requestExport.setCommonHeader('shopid', this.options.shopid);

        let pageArrs = getCurrentPages();
        let curPage = pageArrs[pageArrs.length - 1].route;
        let query = Object.assign(pageArrs[pageArrs.length - 1].options, {
          shopid: this.options.shopid
        });
        let url = `/${curPage}?${encodeSearchParams(query)}`
        setTimeout(() => {
          wx.reLaunch({
            url: url,
          })
        }, 0);
      }
      let temp = {};
      if (util.isPlainObject(app.globalData.pageTempData)) {
        temp = app.globalData.pageTempData;
        app.globalData.pageTempData = null;
      }
      app.shopidcallback(() => {
        orgShow && orgShow.call(this, temp);
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    setPageStorageData(data) {
      app.globalData.pageTempData = data;
    },
    loadUserInfo: function () {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    },
    getUserInfo: function (e) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  };
  var pageProto = extendPageOption(defaultProto, proto);
  Page(pageProto);
  return pageProto;
}

/**
 * 组件
 * */
function extendComponent(proto) {
  const scheduler = new Scheduler();// 性能优化，避免setData 多次触所导致页面卡顿，或性能受损
  const observable = new Observable(); // 增加页面事件订阅机制
  let defaultProto = {
    properties: {},
    data: {
    },
    created() { },
    ready() {

    },
    methods: {
      on: observable.on.bind(observable),
      off: observable.on.bind(observable),
      emit: observable.emit.bind(observable),
      setNextData(data, callback) {
        this.setData(data, callback)
      }
    }
  };
  if (!proto.behaviors) {
    proto.behaviors = [];
  }
  proto.behaviors = proto.behaviors.concat(Behavior(defaultProto));
  Component(proto);
  return proto;
}

function uploadImage(name, options) {
  return new Promise((resolve, reject) => {
    options.success = resolve;
    options.fail = reject;
    requestExport.uploadFile(name, options);
  })
}
/**
 * 批量上传
*/
function uploadImageList(name, formData, filePaths) {
  return new Promise((resolve, reject) => {
    let result = [], len = filePaths.length, taskCount = len;
    let addPush = (index) => (v) => {
      result.push({
        source: filePaths[index],
        res: v
      });
      complete();
    }
    let fail = (index) => () => {
      result.push({
        source: filePaths[index],
        res: null
      });
      complete();
    }
    let complete = () => {
      taskCount--;
      if (taskCount <= 0) {
        resolve(result);
      }
    }
    for (let i = 0; i < len; i++) {
      uploadImage(name, {
        filePath: filePaths[i],
        name: 'file',
        formData: formData
      }).then(addPush(i), fail(i))
    }
    if (len <= 0) {
      complete();
    }
  });
}


/**选择图片上传*/
function chooseImageUpload(name, formData, count = 9) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        uploadImageList(name, formData, res.tempFilePaths).then(resolve, reject);
      },
      fail: reject
    })
  });
}



module.exports = mjd = {
  extendPageOption,
  startApp,
  extendPage,
  ...util,
  ...requestExport,
  ...wxAPi,
  chooseImageUpload,
  uploadImageList,
  uploadImage
};
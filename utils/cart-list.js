const {
  postCartList,
  postCartListTrue,
  updateCartAdd,
  updateCartBatchbuy
} = require('../apis/cart.js');
const {
  isArray
} = require('./util.js');
/**
 * 设置购物车缓存
 *
 * @param {object} data
 * @param {array} data
 */
function setCartList(data) {
  let app = getApp();
  return new Promise((resolve, reject) => {
    let CartList = wx.getStorageSync('CartList');
    let shopid = app.globalData.shopid;
    let listData;

    function addItem(data) {
      let obj = {};
      for (let i = 0; i < len; i++) {
        obj[listData[i].skuid] = 1;
      }
      if (!obj[data.skuid]) {
        listData.push(data)
      }
      for (let i = 0; i < len; i++) {
        if (obj[data.skuid] && listData[i].skuid == data.skuid) {
          listData[i].shopnum += data.shopnum
        }
      }
    }

    if (app.globalData.userInfo) {
      if (!isArray(data)) {
        updateCartAdd(data).then(resolve, reject);
        return;
      } else {
        updateCartBatchbuy(data).then(resolve, reject);
        return;
      }
    }

    if (!CartList) {
      CartList = {};
    } else {
      CartList = JSON.parse(CartList);
    }

    if (!CartList[shopid]) {
      CartList[shopid] = [];
    }

    listData = CartList[shopid];

    let len = listData.length;

    // 购物车超过99条;
    if (len > 99) {
      wx.showToast({
        title: '购物车已满，请结算后再添加！',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        addItem(data[i]);
      }
    } else {
      addItem(data);
    }

    wx.setStorageSync('CartList', JSON.stringify(CartList))
    resolve();

  });

}

/**
 * 获取购物车数量
 */

function getCartNum(cb) {
  let app = getApp();
  let CartList = wx.getStorageSync('CartList');
  let shopid = app.globalData.shopid;
  let allNum = 0;
  let listData;

  if (CartList) {
    CartList = JSON.parse(CartList);
    listData = CartList[shopid];
  }

  if (!listData) {
    listData = [];
  }

  if (app.globalData.userInfo) {
    postCartList(listData,false).then(function (res) {
      if (!res.list || res.list.length == 0) {
        cb && cb(allNum);
        return;
      }
      let num = 0;
      for (let i=0; i<res.list.length; i++) {
        if (res.list[i].isvalid) {
          num += res.list[i].shopnum
        }
      }
      cb && cb(num)
    }).catch(function (err) {
      cb && cb(allNum)
    })
  } else {
    let num = 0;
    for (let i=0; i<listData.length; i++) {
      num += listData[i].shopnum
    }
    cb && cb(num)
  }

}

/**
 * 获取购物车已选择列表
 */

function getCartList(cb) {
  postCartListTrue().then(function (res) {
    cb && cb(res)
  }).catch(function (err) {
    console.log(err)
  })
}


module.exports = {
  setCartList,
  getCartList,
  getCartNum
}
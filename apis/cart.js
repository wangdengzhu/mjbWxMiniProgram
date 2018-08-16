/**
 * 收货地址
 */
const { addAPIConfig } = require('../utils/config.js');
const { getRequest, postRequest } = require('../utils/request.js');

addAPIConfig('POST_CART_LIST', '/cart/m/info');               // 获取购物车列表
addAPIConfig('POST_CART_LIST_TRUE','/cart/m/info/true')       // 获取购物车列表已选择商品
addAPIConfig('UPDATE_CART_SELECT', '/cart/m/update/checked'); // 更新购物车已选择商品
addAPIConfig('UPDATE_CART_NUM', '/cart/m/update/num');        // 更新购物车商品数量
addAPIConfig('UPDATE_CART_ADD', '/cart/m/add');               // 购物车添加商品
addAPIConfig('UPDATE_CART_DEL', '/cart/m/del');               // 购物车删除商品
addAPIConfig('UPDATE_CART_BATCHBUY', '/cart/m/batchbuy');     // 再次购买添加购物车

// 获取购物车列表
const postCartList = (data, autoShowLoading = true) => {
  return postRequest({
    name: 'POST_CART_LIST',
    data: data || [],
    autoShowLoading
  });
}

// 获取购物车列表已选择商品
const postCartListTrue = (data, autoShowLoading = true) => {
  return postRequest({
    name: 'POST_CART_LIST_TRUE',
    data: data || [],
    autoShowLoading
  });
}

// 更新购物车已选择商品
const updateCartListSelect = (listCart, autoShowLoading = true) => {
  return postRequest({
    name: 'UPDATE_CART_SELECT',
    data: listCart,
    autoShowLoading
  });
}

// 更新购物车商品数量
const updateCartListNum = (listCart, autoShowLoading = true) => {
  return postRequest({
    name: 'UPDATE_CART_NUM',
    data: listCart,
    autoShowLoading
  });
}

// 添加商品到购物车
const updateCartAdd = (listCart, autoShowLoading = true) => {
  return postRequest({
    name: 'UPDATE_CART_ADD',
    data: listCart,
    autoShowLoading
  });
}

// 购物车删除商品
const updateCartDel = (listCart, autoShowLoading = true) => {
  return postRequest({
    name: 'UPDATE_CART_DEL',
    data: listCart,
    autoShowLoading
  });
}

// 购物车删除商品
const updateCartBatchbuy = (listCart, autoShowLoading = true) => {
  return postRequest({
    name: 'UPDATE_CART_BATCHBUY',
    data: listCart,
    autoShowLoading
  });
}


module.exports = {
  postCartList,
  postCartListTrue,
  updateCartListSelect,
  updateCartListNum,
  updateCartAdd,
  updateCartDel,
  updateCartBatchbuy,
}
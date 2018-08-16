// pages/activity/activity.js
const app = getApp();
const { getActivityBg, getActivityGoods } = require('../../apis/activity.js');

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityid: 0,
    list: [],
    bg: []
  },

  init: function(activityid) {
    getActivityBg(activityid).then(res => {
      this.setData({
        bg: res.h5backgroundpic
      });
      wx.setNavigationBarTitle({
        title: res.h5headtitle
      })
    });
    getActivityGoods(activityid).then(res => {
      this.setData({
        list: res
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityid: options.activityid
    });
    this.init(options.activityid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
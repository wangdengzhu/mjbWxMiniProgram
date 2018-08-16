// pages/chat/chat.js
import { getChatDomain } from '../../utils/config.js';
let app=getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
	  webViewURL: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var token = encodeURIComponent(this.mjd.getCommonHeader('token'));
	  var miniopenid = this.mjd.getCommonHeader('miniopenid');
	  let domain = getChatDomain('chatDomain');
	  let shopid = app.globalData.shopid;
	  let optsKeys = Object.keys(options);
	  let searchParams = '';
	  if (optsKeys.length > 0) {
		  for (let key of optsKeys) {
			  searchParams += `&${key}=${options[key]}`;
		  }
	  }
	 
	 this.setData({
		 webViewURL: `${domain}?shopId=${shopid}&token=${token}&miniopenid=${miniopenid}` + searchParams
	  })
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
	  console.log(this.data.webViewURL);
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
  
  }
})
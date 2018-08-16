// pages/aftersale/express/express.js
const { getExpressInfo } = require('../../../apis/aftersale.js');
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */

  /**
   * 快递单当前的状态
   * 0：在途中，即货物处于运输过程中；
   * 1：已揽件，货物已由快递公司揽收并且产生了第一条跟踪信息； 
   * 2：疑难，货物寄送过程出了问题； 
   * 3：已签收，收件人已签收； 
   * 4：退签，即货物由于用户拒签、超区等原因退回，而且发件人已经签收； 
   * 5：派件中，即快递正在进行同城派件；
   * 6：退回，货物正处于退回发件人的途中 ,
   */
  data: {
    noExpressInfo: false,
    dataIsLoaded: false,
    expressDetail: {},
    expressState: ['在途中', '已揽件', '疑难', '已签收', '退签', '派件中', '退回']
  },

  // 获取快递
  getExpressInfoFn: function (reqInfo) {
    getExpressInfo({
      reqInfo: reqInfo
    }).then(res => {
      console.log(res);
      this.setData({
        expressDetail: res,
        dataIsLoaded: true
      })
      if(res.expressdata.length == 0) {
        this.setData({
          noExpressInfo: true
        })
      }
    }).catch(e => {
      console.log(e)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      expressno: options.expressno,
      expressname: options.expressname
    });
    this.getExpressInfoFn(decodeURIComponent(options.reqInfo));
  },

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
  
  }
})
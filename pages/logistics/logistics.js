// pages/logistics/logistics.js
const {
  getExpressList,
  getDetails
} = require('../../apis/logistics.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,// 是否有多个快递单
    isStepsLen: false,// 是否有物流信息
    logisticsList: [],
    expressList: [],
    activeIndex: 0,
    startX: 0,
    startIndex: 0,
    mLeft: 0,
    wrapWidth: 0, // 容器宽度
    conWidth: 0, // 屏幕宽度
    defaultX: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let expressList = this.data.expressList;
    let isShow = this.data.isShow;
    let orderNo = options.orderNo;
    let isStepsLen = this.data.isStepsLen;
    let cw = wx.getSystemInfoSync().windowWidth / 750;
    if (orderNo) {
      getDetails({ orderNo: orderNo }).then(list => {
        expressList = list.expressnoitems;
        getExpressList({
          shipmentId: expressList[0].shipmentid,
          expressNo: expressList[0].expressno
        }).then(list => {
          let w = 160 * expressList.length * cw;
          expressList.length <= 1 ? isShow = false : isShow = true;
          list.steps.length == 0 ? isStepsLen = true : isStepsLen = false;
          this.setData({
            logisticsList: list,
            expressList: expressList,
            isShow: isShow,
            isStepsLen: isStepsLen,
            wrapWidth: w,
            conWidth: wx.getSystemInfoSync().windowWidth
          });
        })
      })
    }
  },
  /**
   * 快递选项改变事件
   */
  onChange(e) {
    let index = e.target.dataset.index;
    let shipmentId = e.target.dataset.item.shipmentid;
    let expressNo = e.target.dataset.item.expressno;
    let that = this.data;
    let mLeft = that.mLeft;
    let maxMove = parseInt(that.wrapWidth - that.conWidth);
    if (this.data.expressList.length > 4) {
      if (index >= 3) {
        mLeft = -maxMove
      }
      
      if (index <= 1) {
        mLeft = 0;
      }
    }
    
    this.setData({
      activeIndex: index,
      logisticsList: [],
      mLeft: mLeft
    })
    getExpressList({
      shipmentId: shipmentId,
      expressNo: expressNo
    }).then(list => {
      if (list != "") {
        this.setData({
          logisticsList: list
        });
      }
    })
  },
  /**
   * 开始滑动
   */
  startHandler(e) {
    this.setData({
      startX: e.touches[0].pageX,
      defaultX: this.data.mLeft,
    });
  },
  /**
   * 滑动中
   */
  moveHandler(e) {
    let mLeft = this.data.mLeft;
    let x = e.touches[0].pageX - this.data.startX;
    let maxMove = parseInt(this.data.wrapWidth - this.data.conWidth);
    let that = this.data

    if (this.data.expressList.length < 5) {
        return;
    }
    
    // 如果x值为负值，组件左移
    if (x < 0) {
      if ((that.defaultX + x) < -maxMove) {
        mLeft = -maxMove;
      } else {
        mLeft = that.defaultX + x;
      }
    }

    // 如果x值为正值，组件右移
    if (x > 0) {
      if ((that.defaultX + x) >= 0) {
        mLeft = 0;
      } else {
        mLeft = that.defaultX + x;
      }
    }
    this.setData({
      mLeft: mLeft
    });
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

  }
})
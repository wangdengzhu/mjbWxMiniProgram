// pages/evaluate/nowEvaluate.js
const { commit_comment } = require('../../apis/evaluate.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo: [],
    isShowNowEval: false,
    starsNum: 5,
    gradeList: ['差', '一般', '满意', '很满意', '非常满意'],
    text: "",
    textLen: 0,
    is_checked: false,
    filePaths: [],
    startX: 0,
    pageY: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.goodsInfo = [];
    if (options.goodsInfo != undefined) {
      that.data.goodsInfo.push(JSON.parse(options.goodsInfo));
      that.setData({
        goodsInfo: that.data.goodsInfo
      })
    }
    //this.mjd.loginGetAuth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 开始滑动
  onTouchstart(e) {
    if (e.target.dataset.index != undefined) {
      this.setData({
        startX: e.touches[0].pageX,
        pageY: e.touches[0].pageY,
        starsNum: e.target.dataset.index + 1
      });
    }
  },
  // 滑动中
  onTouchmove(e) {
    let that = this;
    let moveX = e.touches[0].pageX - that.data.startX;
    if (that.data.pageY > 160 && that.data.pageY < 172) {
      if (moveX > 0) {
        if (Math.ceil(moveX / 20) > 5) {
          that.data.starsNum = 5;
        } else {
          that.data.starsNum = Math.ceil(moveX / 20);
        }
      } else {
        let x = that.data.startX - e.touches[0].pageX;
        if (Math.ceil(x / 20) >= 5) {
          that.data.starsNum = 1;
        } else {
          that.data.starsNum = 5 - Math.ceil(x / 20);
        }
      }
      that.setData({
        starsNum: that.data.starsNum
      });
    }
  },
  // 输入评论事件
  onInput(e) {
    this.setData({
      textLen: e.detail.value.length,
      text: e.detail.value
    });
  },
  // 匿名评价
  checkClick(e) {
    this.data.is_checked ? this.setData({
      is_checked: false
    }) : this.setData({
      is_checked: true
    });
  },
  // 提交评论
  onSubmit: app.mjd.preventRepeat(function (complete, e) {
    let that = this, data = that.data;
    let { uploading, pictures } = this.selectComponent('#upload').data;
    let anonymity = data.is_checked ? 1 : 0,
      orderlineid = data.goodsInfo[0].orderlineid,
      stars = data.starsNum,
      text = data.text;

    complete();

    if (uploading) {
      this.mjd.showToast('图片还在上传中，请耐心等待');
      return;
    }

    let picturename = pictures.filter(function(v){
      return v.status == 1;
    }).map(function(v){
      return v.url.substring(v.url.lastIndexOf('/')+1, v.url.length);
    }).toString();
    
    let subData = {
      anonymity: anonymity,
      orderlineid: orderlineid,
      picturename: picturename,
      stars: stars,
      text: text
    }
    
    wx.showLoading({
      title: '正在提交',
      mask: true
    });
    commit_comment(subData).then((list) => {
      if (list == 1) {
        wx.hideLoading();
        wx.redirectTo({
          url: '/pages/evaluate/evalSuccess',
        })
      } else {
        complete();
      }
    })
  }),
  
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
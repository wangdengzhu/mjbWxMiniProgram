// pages/evaluate/evalSuccess.jsconst {
const {
  getPendingCommentList,
  getCommentList
} = require('../../apis/evaluate.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    evaluateGoodsList: [],
    loading: 0,
    isShowNowEval: true,
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999); // 接口未返回总记录数，设置
    this.pager.onChange((pageIndex, status) => {
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.evaluateGoodsList = []; // 请求之前先清空数组
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        this.setNextData({
          scrollTop: 0, //滚动条滚到最前面 
          loading: 0
        })
        this.pager.emit('read'); // 触发read加载数据
        return;
      }
      this.pager.emit(status)
    })
    // 读取时
    this.pager.on('read', () => {
      this.getPendingCommentList().then(list => {
        // 没有数据，显示空
        this.setData({
          showView: true
        })
        if (list.length <= 0) {
          this.setNextData({
            isShow: false
          });
        } else {
          this.setNextData({
            evaluateGoodsList: list,
            isShow: true
          });
          this.showLoadMore(list)
        }
      });
    })
    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      });
      that.getPendingCommentList(false).then(pendingCommentList => {
        if (pendingCommentList.length > 0) {
          that.data.evaluateGoodsList.push(...pendingCommentList);
          that.setData({
            evaluateGoodsList: that.data.evaluateGoodsList
          });
        }
        this.showLoadMore(pendingCommentList);
      });
    })
    this.pager.read();
  },
  // 待评价请求 
  getPendingCommentList: function (autoShowLoading = true) {
    return getPendingCommentList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading);
  },
  showLoadMore(list) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (list.length < this.pager.pageSize) {
      this.pager.lock(); //没有下一页，锁住分页，不进行下一页   
      // 显示没有更多数据了
      this.setNextData({
        loading: 2
      })
    } else {
      // 隐藏加载效果
      this.setNextData({
        loading: 0
      })
    }
  },
  // 查看评价
  lookEval(){
    wx.redirectTo({
      url: '/pages/evaluate/evaluate?index=2',
    })
  },
  // 随便逛逛
  toIndex(){
    wx.reLaunch({
      url: '/pages/index/index',
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
    this.pager.next();
  }
})
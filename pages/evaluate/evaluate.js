// pages/evaluate/evaluate.js
const { getPendingCommentList, getCommentList } = require('../../apis/evaluate.js');
const wxAPI = require('../../utils/wx-api.js');

const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 1, // 待评价：1，已评价：2
    isEvaluated: false, // 是否是已评价选项卡 待评价：false，已评价：true
    pendindCommentList: [], // 待评价列表
    isShowEval: true,
    commentList: [], // 已评价列表
    isShowComment: false,
    loading: 0,
    isShow: false,   // 是否显示数据
  },

  /**
   * 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index) {
      let isEvaluated;
      options.index == 1 ? isEvaluated = false : isEvaluated = true;
      this.setData({
        index: options.index,
        isEvaluated: isEvaluated
      });
    }
  },
  // 待评价请求 
  getPendingCommentList: function (autoShowLoading = false) {
    wx.showNavigationBarLoading()
    return getPendingCommentList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading);
  },
  // 已评价请求
  getCommentList: function (autoShowLoading = false ) {
    wx.showNavigationBarLoading()
    return getCommentList({
      pageindex: this.pager.pageIndex
    }, autoShowLoading);
  },
  showLoadMore(list) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    this.setData({
      isShow: true
    });
    if (list.length < this.pager.pageSize) {
      this.pager.lock(); //没有下一页，锁住分页，不进行下一页   
      // 显示没有更多数据了
      this.setData({
        loading: 2
      })
    } else {
      // 隐藏加载效果
      this.setData({
        loading: 0
      })
    }
  },
  // 随便逛逛
  toIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  // 跳转详情页
  toDetail(e) {
    let {
      spuid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/goods/goodsDetail/goodsDetail?spuid=${spuid}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 待评价、已评价切换
  evalTitleChange(e) {
    let index = Number(e.target.dataset.index),
      isEvaluated = this.data.isEvaluated;
    index == 1 ? isEvaluated = false : isEvaluated = true;
    this.setData({
      index: index,
      isEvaluated: isEvaluated,
      loading: 0,
      isShow: false,
      pendindCommentList: [],
      commentList: [],
    });
    this.pager.unlock();
    this.pager.refresh();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999); // 接口未返回总记录数，设置

    this.pager.onChange((pageIndex, status) => {
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.pendindCommentList = []; // 请求之前先清空数组
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
      // 待评价
      if (that.data.index == 1) {
        this.getPendingCommentList().then(list => {
          // 没有数据，显示空
          wx.hideNavigationBarLoading()
          if (list.length > 0) {
            this.setData({
              pendindCommentList: list,
            });
          }
          this.showLoadMore(list)
        })
      } else {
        this.getCommentList().then(list => {
          // 没有数据，显示空
          wx.hideNavigationBarLoading()
          if (list.length > 0) {
            list.map(function(v){
              v.showTxt = false;
            })
            this.setData({
              commentList: list,
            });
          }
          this.showLoadMore(list)
        })
      }
    })

    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setData({
        loading: 1
      })
      if (this.data.index == 1) {
        this.getPendingCommentList(false).then(list => {
          // 追加数据到列表中
          wx.hideNavigationBarLoading()
          if (list.length > 0) {
            this.data.pendindCommentList.push(...list);
            this.setData({
              pendindCommentList: this.data.pendindCommentList
            });
          }
          this.showLoadMore(list)
        })
      } else {
        this.getCommentList(false).then(list => {
          // 追加数据到列表中
          wx.hideNavigationBarLoading()
          if (list.length > 0) {
            this.data.commentList.push(...list);
            this.setData({
              commentList: this.data.commentList
            });
          }
          this.showLoadMore(list)
        })
      }
    })
    this.pager.read();


  },

  // 查看内容
  onShowTxt: function (e) {
    let idx = e.target.dataset.index;
    let list = this.data.commentList;
    if (list[idx].showTxt) {
      list[idx].showTxt = false;
    } else {
      list[idx].showTxt = true;
    }
    
    this.setData({
      commentList: list,
    })
  },

  // 查看图片
  viewPic: function (e){
    let pic = e.target.dataset.pic;
    let arr = e.target.dataset.picarr;
    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: arr     // 需要预览的图片http链接列表
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
    this.pager.next();
  }
})
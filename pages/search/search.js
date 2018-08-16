// pages/search/search.js
const {
  gethotsearch,
  getSearchList
} = require('../../apis/goods.js');
const wxAPI = require('../../utils/wx-api.js');
const {
  getImageUrl
} = require('../../utils/config.js')
const app = getApp();

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearch: true, // true 搜索页；false 搜索结果页
    // 搜索   
    historyList: [],
    hotSearchList: [],
    isSearchValue: false,
    searchValue: "",
    cancel: "取消",
    // 搜素结果
    emptyImage: getImageUrl('empty'),
    orderfield: 5,
    orderform: 2,
    goodsArr: [],
    searchResultValue: "",
    isShow: false,
    dropDown: 0,
    loading: 0,
    hasList: true,
    setFocus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var value = wx.getStorageSync("historyList") || [];
    this.setNextData({
      historyList: value
    })
    // 读取热门搜索数据
    gethotsearch().then(list => {
      this.setNextData({
        hotSearchList: list,
        isShow: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  onInput: function(e) {
    this.setClearIcon(e)
  },

  onFocus: function(e) {
    this.setClearIcon(e)
  },

  // 设置清空按钮是否显示
  setClearIcon: function(e) {
    /**
     * 判断当前是否是搜索页，如果
     */
    let val = e.detail.value;
    if (val.length > 0){
      this.setData({
        searchValue: val,
        isSearchValue: true,
        cancel: "搜索"
      })  
    }
    if (val.length == 0){
      this.setData({
        isSearchValue: false,
        cancel: "取消"
      });
    }
  },

  // 点击键盘搜索事件
  onConfirm: function(e) {
    let val = this.data.searchValue.trim();
    if (val.length == 0) {
      wx.showToast({
        title: '请输入正确的搜索内容',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.showSearchResult(e.detail.value);
  },
  // 取消事件
  onCancel: function() {
    let val = this.data.searchValue.trim();
    if (this.data.cancel == "取消") {
      wx.navigateBack();
    } else {
      if (val.length == 0) {
        wx.showToast({
          title: '请输入正确的搜索内容',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      this.showSearchResult(this.data.searchValue);
    }
  },
  // 文本框中按钮删除事件
  onClear: function() {
    this.setData({
      isSearchValue: false,
      searchResultValue: "",
      searchValue: "",
      isSearch: true,
      cancel: '取消',
      setFocus: false,
    })
    let that = this;
    setTimeout(function(){
      that.setData({
        setFocus: true,
      })
    },100)
  },
  // 清空历史记录事件
  onClearHistory: function() {
    let that = this;
    wx.showModal({
      content: '是否确认清除历史记录？',
      confirmColor: '#FF681D',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('historyList');
          that.setNextData({ historyList:[]})
        }
        if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  },
  // 点击历史记录或热门搜索中的数据事件
  onSearch: function(item) {
    this.showSearchResult(item.currentTarget.dataset.item);
  },
  // 显示搜索结果页
  showSearchResult(value) {
    let that = this;
    let list = this.data.historyList;
    that.setNextData({
      isSearch: false,
      searchResultValue: value,
      isValue: true,
      isSearchValue: true,
      hasList: true,
      goodsArr: [],
    })
    list.unshift(value);

    if (list.length > 10) {
      list.pop();
    }
    list = [... new Set(list)];
    this.setNextData({
      searchValue: value,
      historyList: list
    });

    wx.setStorageSync("historyList", list);

    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    })
    this.pager.setTotal(9999999999999); // 接口未返回总记录数，设置
    this.pager.onChange((pageIndex, status) => {
        this.setNextData({
          pageIndex: pageIndex
        })
      //点击上面排序过滤作为刷新加载
      if (status == 'refresh') {
        this.data.goodsArr = []; // 请求之前先清空数组
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
    });
    // 读取时
    this.pager.on('read', () => {
      wx.showNavigationBarLoading()
      this.getList().then(goodList => {
        wx.hideNavigationBarLoading()
        if (goodList.totalrows < 5) {
          this.setNextData({
            loading: 2,
          });
        }
        if (goodList.code < 0) {
          this.setNextData({
            hasList: false
          });
          return;
        }
        if (goodList.goods.length > 0) {
          this.setNextData({
            goodsArr: goodList.goods,
            hasList: true
          });
        } else {
          this.showLoadMore(goodList)
          this.setNextData({
            hasList: false
          });
        }
      })
    })
    // 上拉加载下一页时
    this.pager.on('next', () => {
      // 请求之前，显示加载效果
      this.setNextData({
        loading: 1
      })
      this.getList().then(goodList => {
        // 追加数据到列表中
        if (goodList.goods.length > 0) {
          this.data.goodsArr.push(...goodList.goods);
          this.setNextData({
            goodsArr: this.data.goodsArr
          });
        }
        this.showLoadMore(goodList.goods)

      })
    })
    this.pager.read();
  },
  getList: function () {
    return getSearchList({
      orderfield: this.data.orderfield,
      orderform: this.data.orderform,
      search: this.data.searchResultValue,
      pageindex: this.data.pageIndex
    });
  },
  showLoadMore: function(goodList) {
    // 如果结果集长度小于当前页大小，代表数据读到最后一页了
    if (goodList.length < this.pager.pageSize) {
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
  bindFilterChange: function(e) {
    this.data.orderfield = e.detail.value;
    this.data.orderform = e.detail.sort;
    this.pager.unlock();
    this.pager.refresh();
  },

  // 显示搜索
  showSearchBtn: function() {
    this.setNextData({
      isSearch: true,
      cancel: '搜索'
    })
  },

  // 删除单个历史记录
  onDelHistory: function (e) {
    let idx = e.currentTarget.dataset.index;
    let list = wx.getStorageSync('historyList');
    list.splice(idx,1)
    this.setData({
      historyList: list,
    })
    wx.setStorageSync('historyList',list);
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
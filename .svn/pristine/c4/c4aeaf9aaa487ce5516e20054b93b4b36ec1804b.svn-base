// pages/aftersale/list/list.js
const app = getApp();
const { getList } = require('../../../apis/order.js');
const { getAfterList, cancelAftersale } = require('../../../apis/aftersale.js');
const { getImageUrl } = require('../../../utils/config.js');
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [
      {
        'text': '售后申请',
        'status': 0
      },
      {
        'text': '申请记录',
        'status': 1
      }
    ],
    typeText: {
      '1': '退货退款',
      '2': '退款',
      '3': '退货退款',
      '4': '换货',
      '5': '维修'
    },
    stateText: {
      '501': '待审核',
      '502': '请寄回',
      '503': '待商家发货',
      '504': '待平台处理',
      '505': '退款中',
      '506': '退款完成',
      '507': '商家拒绝',
      '508': '已关闭',
      '509': '待商家发货',
      '510': '商家已发货',
      '511': '完成'
    },
    canAftersaleList: [],
    aftersaleList: [],
    curStatus: 0,
    activeIndex: 0,
    noOrder: false,
    isLoading1: false,
    isLoading2: false,
    loaded1: false,
    loaded2: false,
    emptyIcon: getImageUrl('empty-no-apply-aftersale'),
    noOrderText: '没有可售后的商品哦~'
  },

  showCanAftersaleList: function (status = 0, payStatus = 1, autoShowLoading = false) {
    wx.showNavigationBarLoading();
    getList({
      status: status,
      payStatus: payStatus,
      pageindex: this.pager.pageIndex,
      loadAsOrderNo: true
    }, autoShowLoading).then(list => {
      console.log(list);
      wx.hideNavigationBarLoading();
      list = list.list;

      this.setData({
        isLoading1: false
      });
      if (list.length > 0) {
        this.data.canAftersaleList.push(...list);
        this.setData({
          canAftersaleList: this.data.canAftersaleList
        });
      }
      if (list.length === 0 && this.data.canAftersaleList.length === 0) {
        this.setData({
          noOrder: true
        })
      }

      if (list.length < this.pager.pageSize) {
        this.setData({
          loaded1: true
        });
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页
      }
    })
  },

  showAftersaleList: function (status = 0, autoShowLoading = false) {
    wx.showNavigationBarLoading();
    getAfterList({
      status: status,
      pageindex: this.pager.pageIndex
    }, autoShowLoading).then(list => {
      console.log(list);
      wx.hideNavigationBarLoading();
      list = list.list;
      this.setData({
        isLoading2: false
      });
      if (list.length > 0) {
        this.data.aftersaleList.push(...list);
        this.setData({
          aftersaleList: this.data.aftersaleList
        });
      }
      if (list.length === 0 && this.data.aftersaleList.length === 0) {
        this.setData({
          noOrder: true
        })
      }

      if (list.length < this.pager.pageSize) {
        this.setData({
          loaded2: true
        });
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页
      }
    })
  },

  init: function() {
    if(this.data.curStatus == 0) {
      this.showCanAftersaleList(this.data.curStatus, 1);
    }else {
      this.showAftersaleList(0, false);
    }
  },

  dataReset: function () {
    this.setData({
      noOrder: false,
      canAftersaleList: [],
      aftersaleList: [], 
      isLoading1: false,
      isLoading2: false,
      loaded1: false,
      loaded2: false,
    });
    this.pager.unlock();
    this.pager.refresh();
  },

  changeActive: function (e) {
    let status = e.currentTarget.dataset.status;
    this.setData({
      activeIndex: status,
      curStatus: status
    });
    this.dataReset();
    if(status === 0) {
      this.showCanAftersaleList(0, 1, false);
      this.setData({
        noOrderText: '没有可售后的商品哦~'
      })
    }else {
      this.showAftersaleList(0, false);
      this.setData({
        noOrderText: '没有申请记录哦~'
      })
    }
  },

  applyAftersale: function(e) {
    let skuid = e.currentTarget.dataset.skuid;
    let orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/aftersale/apply/apply?skuid=${skuid}&orderNo=${orderNo}`,
    });
  },

  // 撤销申请
  cancelAftersaleFn: function(e) {
    console.log(e)
    let that = this;
    wx.showModal({
      content: '您将撤销该申请，确定继续吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          cancelAftersale({
            isWrapSuccess: false,
            isCustomError: true,    // 是否自定义错误，
            autoShowLoading: false,
          }, {
            asOrderNo: e.currentTarget.dataset.asorderno,
            closeType: 0
          }).then(res => {
            console.log(res);
            that.dataReset();
            that.init();
          })
        }
      }
    })
  },

  // 根据不同状态进不同页面  
  goPage: function(e) {
    let dataset = e.currentTarget.dataset;
    let skustatus = dataset.skustatus;
    let asorderno = dataset.asorderno;
    let spuid = dataset.spuid;
    let url = '';
    // 如果售后中点击商品也进入售后页
    if(skustatus == 10) {
      url = `/pages/aftersale/detail/detail?asOrderNo=${asorderno}`;
    }else {
      url = `/pages/goods/goodsDetail/goodsDetail?spuid=${spuid}`;
    }
    wx.navigateTo({
      url: url,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeIndex: options.status,
      curStatus: options.status
    });
    var that = this;
    this.pager = new this.mjd.Pager({
      pageIndex: 1,
      pageSize: 10
    });
    this.pager.setTotal(9999999999999);// 接口未返回总记录数，设置
    // 页变化
    this.pager.onPageChange(function (pageIndex) {
      // 切换tab时会重复请求 pageIndex=1返回
      if (pageIndex === 1) {
        return false;
      }
      if(that.data.curStatus == 0) {
        that.showCanAftersaleList(that.data.curStatus, 1, false)
      }else {
        that.showAftersaleList(0, false);
      }
    });
    // 页数发生变化
    this.pager.onPageCountChange(function () {
      console.log(this.pageCount, this.pageIndex);
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
    this.dataReset();
    this.init();
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
    if(!this.data.loaded1 && this.data.curStatus == 0) {
      this.setData({
        isLoading1: true
      });
    }
    if(!this.data.loaded2 && this.data.curStatus == 1) {
      this.setData({
        isLoading2: true
      });
    }
    this.pager.next();
  }
})
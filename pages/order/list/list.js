// pages/order/list/list.js
const app = getApp();
const wxAPI = require('../../../utils/wx-api.js');
const { setCartList } = require('../../../utils/cart-list.js');
const { pushMsgId } = require('../../../apis/pushMsg.js');
const { getList, confirmOrder, cancelOrder, checkPay, prePay } = require('../../../apis/order.js');
const { getImageUrl } = require('../../../utils/config.js');

app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [
      {
        'text': '全部',
        'status': 0
      },
      {
        'text': '待付款',
        'status': 1
      },
      {
        'text': '待发货',
        'status': 10
      },
      {
        'text': '待收货',
        'status': 20
      },
      {
        'text': '已完成',
        'status': 30
      }
    ],
    curStatus: 0,
    activeIndex: 0,
    list: [],
    countDownList: [],
    isLoading: false,
    loaded: false,
    noOrder: false,
    timer: null,

    // 快速切换，如果前一个接口还在加载中禁止切换
    isRequesting: false,

    emptyIcon: getImageUrl('empty-no-order')
  },
  
  changeActive: function(e) {
    if(this.data.isRequesting) {
      return;
    }
    let status = e.currentTarget.dataset.status;
    this.setData({
      activeIndex: status,
      curStatus: status
    });
    this.dataReset();
    this.showData(status, true);
  },

  confirmOrderFn: function (e) {
    this.dataReset();
    this.init();
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
      if(pageIndex === 1) {
        return false;
      }
      that.showData(that.data.curStatus, false, false)
    });
    // 页数发生变化
    this.pager.onPageCountChange(function () {
      console.log(this.pageCount, this.pageIndex);
    });
  },
  init: function() {
    this.showData(this.data.curStatus, true);
  },
  showData: function (status = 0, canCountdown, autoShowLoading = false) {
    this.setData({
      isRequesting: true
    });
    wx.showNavigationBarLoading();
    return getList({
      status: status,
      pageindex: this.pager.pageIndex
    }, autoShowLoading).then(list => {
      list = list.list;
      this.setData({
        isLoading: false,
        isRequesting: false
      });
      wx.hideNavigationBarLoading();
      if (list.length > 0) {
        this.data.list.push(...list);
        this.setData({
          list: this.data.list
        });
      }
      if(list.length === 0 && this.data.list.length === 0) {
        this.setData({
          noOrder: true
        })
      }
      // 倒计时
      for(var i=0; i<list.length; i++) {
        // 因为待付款不一定排序在列表最前面，去掉大于0限制
        // if (list[i].paymentendtime > 0) {
          this.data.countDownList.push(list[i].paymentendtime);
        // }
      }
      this.setData({
        countDownList: this.data.countDownList
      });

      if (list.length < this.pager.pageSize) {
        this.setData({
          loaded: true
        });
        this.pager.lock();//当没有数据了，代表没有下一页，锁住分页，不进行下一页
      }
      if (canCountdown) {
        this.countDown();
      }
    })
  },

  countDown: function() {
    let countDownList = this.data.countDownList;
    let that = this;
    // 如果没有订单或者订单中所有待倒计时值为0则return
    let noWiatPay = countDownList.every((cur) => {
      return cur === 0
    });
    if(countDownList.length === 0 || noWiatPay) {
      return false;
    }
    this.data.timer = setInterval(() => {
      for (var i = 0; i < countDownList.length; i++) {
        if (countDownList[i] > 0) {
          countDownList[i]--;
        }else {
          if (that.data.list[i] && that.data.list[i].status == 1) {
            // 倒计时结束取消该订单，并重新load数据
            clearInterval(that.data.timer);
            cancelOrder({
              isWrapSuccess: false,
              isCustomError: true,    // 是否自定义错误，
              autoShowLoading: false,
            },{
              orderno: that.data.list[i].orderno,
              closeType: 0
            }).then(res => {
              if(res.data == 1) {
                that.init();
              }
            })
          }
        }
      }
      this.setData({
        countDownList: countDownList
      })
    }, 1000);
  },

  dataReset: function() {
    this.setData({
      list: [],
      countDownList: [],
      isLoading: false,
      loaded: false,
      noOrder: false
    });
    this.pager.unlock();
    this.pager.refresh();
    clearInterval(this.data.timer);
  },

  // 再次购买
  reBuy: function(e) {
    let idx = e.currentTarget.dataset.idx;
    let reBuyData = [];
    let linesData = this.data.list;
    for(let i=0; i<linesData[idx].lines.length; i++) {
      reBuyData.push({
        'shopnum': linesData[idx].lines[i].qty,
        'skuid': linesData[idx].lines[i].skuid,
        'goodsprice': linesData[idx].lines[i].salesprice,
        'isselect': true
      })
    }
    setCartList(reBuyData);
    wx.switchTab({
      url: '/pages/cart/cartList',
    })
  },

  // 付款前检查 
  prePayCheck: function (orderNo) {
    return checkPay({
      isWrapSuccess: false,
      isCustomError: true,    // 是否自定义错误，
      autoShowLoading: false,
    }, { orderNo });
  },
  // 预支付
  prePay: function (orderId, orderNo) {
    return prePay({
      isWrapSuccess: false,
      isCustomError: true,    // 是否自定义错误，
      autoShowLoading: false,
      data: {
        orderId: orderId,
        orderNo: orderNo,
        payChannel: 10,// 支付渠道(1:微信,2:支付宝,3:京东,4:测试支付,5：联动微信公众号支付,6：联动H5微信支付,7：联动H5支付宝支付,8：联动APP微信支付,9联动APP支付宝支付,10:小程序微信支付
        clientType: 7, //客户端类型发起交易平台（0.未知来源平台 1.PC 2.WeiXin微信 3.Android安卓 4.IOS苹果 5.TouchScreen触屏 6.IOS审核版 7.小程序
        clientEnvironment: 0
      }
    });
  },
  // 立即付款
  payNow: function (e) {
    let orderNo = e.currentTarget.dataset.orderno;
    let orderId = e.currentTarget.dataset.orderid;
    this.prePayCheck(orderNo).then(res => {
      if (res.code == this.mjd.responseStatusCode.NORMAL) {
        this.mjd.showLoading('正在发起支付...');
        return this.prePay(orderId, orderNo);
      } else {
        wxAPI.showToast({
          title: '库存不足，请稍后再试'
        });
        return Promise.reject(res.code);
      }
    }).then(res => {
      let that = this;
      if (res.code == this.mjd.responseStatusCode.NORMAL) {
        this.mjd.hideLoading();
        let data = res.data.data;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': 'MD5',
          'paySign': data.paySign,
          'success': function (res) {
            if (res.errMsg === 'requestPayment:ok') {
              pushMsgId({
                bindId: data.package.split('prepay_id=')[1],
                referenceNo: orderNo,
                businessType: 101,
              }).then(res => {
                console.log(res)
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/order/submitOrder/result?orderNo=${orderNo}&payStatus=1`,
                });
              });
            }
          },
          'fail': function (res) {
            if (res.errMsg !== 'requestPayment:fail cancel') {
              wx.navigateTo({
                url: `/pages/order/submitOrder/result?orderNo=${orderNo}&payStatus=0`,
              });
            }
          }
        })
      }
    })
  },

  // 查看物流
  goLogisticsPage: function(e) {
    let orderno = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/logistics/logistics?orderNo=${orderno}`
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
    // 左上角返回 如果在详情页确认收货，列表页需要实时更新
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
    if(!this.data.loaded) {
      this.setData({
        isLoading: true
      });
    }
    this.pager.next();
  }
})
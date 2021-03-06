//index.js 首页
//获取应用实例
const app = getApp();
const { getBanner, getIndexRecommend, getShopHandpicked } = require('../../apis/goods.js');
const { getShopInfo } = require('../../apis/shop.js');
const { getBulletIndex } = require('../../apis/bullet.js');
const wxAPI = require('../../utils/wx-api.js');

app.Page({
  data: {
    banner: [],
    shopHandPicked: [],
    hotGoods: [],
    rankInfo: [],
    bigBrands: [],
    newProducts: [],
    ad: [],
    showGoTop: false,
    windowHeight: 0,

    bullet: {},
    showBullet: false,
    bulletPosChange: false,
    activitiesOne: [],
    activitiesTwo: []
  },
  init: function() {
    this.pageGetBanner();
    this.pageGetRecommend();
    this.pageGetShopHandpicked();
    this.getBulletIndexFn();
    this.getShopInfoFn();
  },

  // 获取店铺信息
  getShopInfoFn: function() {
    getShopInfo().then(res => {
      wx.setNavigationBarTitle({
        title: res.storename
      })
    })
  },

  // 获取弹幕消息
  getBulletIndexFn: function() {
    getBulletIndex().then(res => {
      this.setData({
        bullet: res,
        showBullet: true
      })
    })
  },
  // 获取banner
  pageGetBanner: function (autoShowLoading=true) {
    getBanner({}, autoShowLoading).then(res => {
      let banner = [];
      for (let i = 0; i < res[0].banner.length; i++) {
        if (res[0].banner[i].type == 2) {
          banner.push(res[0].banner[i])
        }
      }
      this.setData({
        banner: banner
      })
    }, () => {
      console.log('fail');
    });
  },
  // 获取模块
  pageGetRecommend: function() {
    getIndexRecommend().then(res => {
      let ad = [];
      for(let i=0; i<res.advertinfolist.length; i++) {
        if(res.advertinfolist[i].referencetype == 1) {
          ad.push(res.advertinfolist[i]);
        }
      }
      this.setData({
        rankInfo: res.rankinfo,
        bigBrands: res.bigbrands,
        hotGoods: res.hotgoods,
        ad: ad,
        newProducts: res.newgoods,
        guessLiked: res.guessyoulike,
        activitiesOne: res.activitiesone,
        activitiesTwo: res.activitiestwo
      });
      wx.stopPullDownRefresh()
    }, () => {
      console.log('fail');
    });
  },
  // 获取精选
  pageGetShopHandpicked: function() {
    getShopHandpicked().then(res => {
      this.setData({
        shopHandPicked: res.indexchoicesgoods
      });
    }, () => {
      console.log('fail');
    });
  },
  goTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  onPullDownRefresh: function() {
    this.pageGetBanner(false);
    this.pageGetRecommend();
    this.pageGetShopHandpicked();

    this.setData({
      bullet: {},
      showBullet: false
    })
    this.getBulletIndexFn();
  },
  // 热销榜跳转
  goRankNav: function(e) {
    let id = e.currentTarget.dataset.id;
    let pages = {
      '3': '../brand/brandHot/brandHot',
      '14': '../goods/monthHot/monthHot',
      '13': '../goods/goodsTop/goodsTop'
    };
    wx.navigateTo({
      url: pages[id],
    });
  },
  onShow(){
    
  },
  onLoad: function () {
    // 获取屏幕高度
    this._pageScrollTop = new this.mjd.PageScroll(app.globalData.stytemInfo.windowHeight);
    this._pageScrollTop.onDown(() => {
      this.setData({
        showGoTop: true
      })
    });
    this._pageScrollTop.onUp(() => {
      this.setData({
        showGoTop: false
      })
    });
    this.init();
  },
  onPageScroll: function(e) {
    this._pageScrollTop.scroll(e.scrollTop);
    if(e.scrollTop > 40) {
      this.setData({
        bulletPosChange: true
      })
    }else {
      this.setData({
        bulletPosChange: false
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '满金店·正品好货·全场包邮',
      path: `pages/index/index?shopid=${app.globalData.shopid}`
    }
  }
})

// pages/aftersale/detail/detail.js
const app = getApp();
const { aftersaleDetail, cancelAftersale, getExpress, submitReturn, getExpressInfo, confirmReceiving, applyPlatform } = require('../../../apis/aftersale.js');
app.Page({

  /**
   * 页面的初始数据
   */
  // 售后类型 2:退款,3:退货退款,4:换货,5:维修
  // 售后状态（501: 待商家确认,502: 待寄回商品,503: 待商家收货,504: 待平台处理,505：退款中,506: 已退款,507: 商家撤回,508: 已关闭,509:待商家寄回,510:商家已寄回,511:已完结（售后换货或维修商家已寄回，买家已确认收货）） ,
  data: {
    pictures: [],
    asOrderNo: '',
    dataIsLoaded: false,
    asStatusType: {
      '501': {
        txt: {
          '1': '退款中，待审核',
          '2': '退款中，待审核',
          '3': '退货中，待审核',
          '4': '换货中，待审核',
          '5': '维修中，待审核'
        },
        cls: 'state-refunding'
      },
      '502': {
        txt: {
          '1': '退货中，待寄回商品',
          '2': '退货中，待寄回商品',
          '3': '退货中，待寄回商品',
          '4': '换货中，待寄回商品',
          '5': '维修中，待寄回商品'
        },
        cls: 'state-refunding'
      },
      '503': {
        txt: {
          '1': '退货中，待商家收货',
          '2': '退货中，待商家收货',
          '3': '退货中，待商家收货',
          '4': '换货中，待商家收货',
          '5': '维修中，待商家收货'
        },
        cls: 'state-refunding'
      },
      '504': {
        txt: '待平台处理',
        cls: 'state-refunding'
      },
      '505': {
        txt: '退款中',
        cls: 'state-refunding'
      },
      '506': {
        txt: '退款完成',
        cls: 'state-refunding'
      },
      '507': {
        txt: '退款申请被拒绝。',
        cls: ''
      },
      '508': {
        txt: '已关闭',
        cls: 'state-closed'
      },
      '509': {
        txt: {
          '1': '退货中，待商家寄回',
          '2': '退货中，待商家寄回',
          '3': '退货中，待商家寄回',
          '4': '换货中，待商家寄回',
          '5': '维修中，待商家寄回'
        },
        cls: 'state-refunding'
      },
      '510': {
        txt: {
          '4': '换货中，商家已发货',
          '5': '维修中，商家已发货'
        },
        cls: 'state-refunding'
      },
      '511': {
        txt: {
          '4': '换货成功',
          '5': '维修成功'
        },
        cls: 'state-closed'
      }
    },
    // 关闭类型(1:系统自动关闭,10:卖家,20:买家,40:平台) ,
    closeType: {
      '1': '因您超时未处理，该售后已关闭。',
      '10': '平台拒绝申请，售后已关闭。',
      '20': '您已取消申请，售后已关闭。',
      '40': '平台拒绝申请，售后已关闭。'
    },
    expressDetail: {},
    detail: null,
    expressList: [],
    index: 0,
    hasSelectExpress: false,
    showExpreessIpt: false,
    expressNo: '',
    expressName: '',
    asExpressId: 0,
    evidenceName: '',

    // 上传后的凭证图片
    asEvidenceImgsArr: [],
    asReturnEvidenceImgsArr: [],

    // 根据不同的状态展示
    showExpress: false,
    showAsExpress: false,
    asExpress: {},
  },

  // 获取详情
  getDetail: function() {
    let asOrderNo = this.data.asOrderNo;
    aftersaleDetail({
      isWrapSuccess: false,
      isCustomError: false,
      autoShowLoading: true
    }, asOrderNo).then(res => {
      console.log(res.data);
      if(res.code == 1) {
        let expressDetail = {};
        try{
          expressDetail = JSON.parse(res.data.expressdata)
        }catch(e) {};
        let asEvidenceImgsArr = res.data.asevidencename ? res.data.asevidencename.split(',') : [];
        let asReturnEvidenceImgsArr = res.data.asreturnevidencename ? res.data.asreturnevidencename.split(',') : [];

        this.setData({
          detail: res.data,
          dataIsLoaded: true,
          expressDetail: expressDetail,
          asEvidenceImgsArr: asEvidenceImgsArr,
          asReturnEvidenceImgsArr: asReturnEvidenceImgsArr
        });
        if(res.data.asstatus == 502) {
          this.getExpressFn();
        } else if ((res.data.asstatus == 503 || res.data.asstatus == 505 || res.data.asstatus == 506 || res.data.asstatus == 509) && res.data.astype != 2) {
          // 如果没有数据的异常状态则不请求
          if (!res.data.queryafterexpressdata) {
            return false;
          }
          // 506状态有两种情况： 退款完成  退货退款完成  退货情况下有物流信息和相关物流凭证
          this.setData({
            showExpress: true
          });
          // 开发测试环境如果不请求快递接口  则详情中不会返回该快递信息
          this.getExpressInfoFn(res.data.queryafterexpressdata)
        } else if (res.data.asstatus == 510 || res.data.asstatus == 511) {
          if (!res.data.queryafterexpressdata) {
            return false;
          }
          let asExpress = {};
          try {
            asExpress = JSON.parse(res.data.asshipmentdto.expressdata);
          } catch (e) { };
          this.setData({
            asExpress: asExpress,
            showAsExpress: true
          });
          this.getExpressInfoFn(res.data.queryafterexpressdata)
        }
      }
    })
  },

  // 撤销申请
  cancelAftersaleFn: function() {
    let that = this;
    if(!this.data.detail.permission) {
      wx.showToast({
        title: '您暂无权限关闭此售后单',
        icon: 'none'
      });
      return false;
    }
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
            asOrderNo: that.data.asOrderNo,
            closeType: 0
          }).then(res => {
            console.log(res);
            if (res.code != 1) {
              wx.showToast({
                title: '商家（平台）已处理该售后。',
                icon: 'none'
              });
              setTimeout(() => {
                that.init();
              }, 1000);
            } else {
              that.init();
            }
          })
        }
      }
    })
  },

  // 确认收货
  confirmReceivingFn: function() {
    let that = this;
    if (!this.data.detail.permission) {
      wx.showToast({
        title: '您暂无权限关闭此售后单',
        icon: 'none'
      });
      return false;
    }
    wx.showModal({
      content: '您已经收到货品了吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          confirmReceiving({
            asOrderNo: that.data.asOrderNo
          }).then(res => {
            console.log(res);
            that.init();
          })
        }
      }
    })
  },

  // 客服
  goChat: function() {
    wx.navigateTo({
      url: `/pages/chat/chat?bizno=${this.data.asOrderNo}&st=4&skuid=${this.data.detail.skuid}`,
    });
  },

  // 申请平台
  applyPlatformFn: function() {
    let that = this;
    if (!this.data.detail.permission) {
      wx.showToast({
        title: '您暂无权限关闭此售后单',
        icon: 'none'
      });
      return false;
    }
    wx.showModal({
      content: '平台将审核订单，联系商家协商处理，维护您的权益',
      cancelText: '取消',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          applyPlatform({
            orderNo: that.data.asOrderNo
          }).then(res => {
            console.log(res);
            that.init();
          })
        }
      }
    })
  },

  // 获取快递
  getExpressFn: function() {
    getExpress().then(res => {
      console.log(res);
      res.push({
        expressid: 0,
        expressname: '其他'
      });
      this.setData({
        expressList: res
      });
    })
  },

  // 获取物流信息
  getExpressInfoFn: function(reqInfo) {
    getExpressInfo({
      reqInfo: reqInfo
    }).then(res => {
      console.log(res);
      // this.setData({
      //   expressDetail: {
      //     state: res.state,
      //     context: res.expressdata[0].context,
      //     time: res.expressdata[0].time
      //   }
      // })
    }).catch(e => {
      console.log(e)
    })
  },

  bindExpressName: function(e) {
    this.setData({
      expressName: e.detail.value
    })
  },

  bindExpressNo: function(e) {
    this.setData({
      expressNo: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      hasSelectExpress: true
    });
    if(e.detail.value == this.data.expressList.length - 1) {
      this.setData({
        showExpreessIpt: true,
        expressName: '',
        asExpressId: 0
      });
    }else {
      this.setData({
        showExpreessIpt: false,
        expressName: this.data.expressList[e.detail.value].expressname,
        asExpressId: this.data.expressList[e.detail.value].expressid
      });
    }
  },  

  // 查看大图
  showBigImg: function(e) {
    let current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.asEvidenceImgsArr // 需要预览的图片http链接列表
    })
  },

  goExpressPage: function() {
    let expressno, expressname, reqinfo;
    if (this.data.showExpress) {
      expressno = this.data.detail.expressno;
      expressname = this.data.detail.expressname;
      reqinfo = encodeURIComponent(this.data.detail.queryafterexpressdata);
    }
    if (this.data.showAsExpress) {
      expressno = this.data.detail.asshipmentdto.expressno;
      expressname = this.data.detail.asshipmentdto.expressname;
      reqinfo = encodeURIComponent(this.data.detail.queryafterexpressdata);
    }
    wx.navigateTo({
      url: `/pages/aftersale/express/express?expressname=${expressname}&expressno=${expressno}&reqInfo=${reqinfo}`,
    });
  },

  // 提交
  submitReturnFn: function() {
    let msg = '';
    let { uploading, pictures } = this.selectComponent('#upload').data;
    if (!this.data.expressName) {
      msg = '请输入物流公司名称';
    } else if (!this.data.expressNo) {
      msg = '请输入运单号码';
    } else if (this.data.expressNo.length < 8) {
      msg = '请输入完整的运单号码';
    } else if (uploading) {
      msg = '图片还在上传中，请耐心等待';
    }
    if (msg != '') {
      this.mjd.showToast(msg);
      return;
    }
    let evidenceName;
    if (pictures.length) {
      evidenceName = pictures.filter(r => r.status == 1).map(r => r.url).join(',');
    }
    submitReturn({
      asOrderNo: this.data.asOrderNo,
      expressNo: this.data.expressNo,
      expressName: this.data.expressName,
      asExpressId: this.data.asExpressId,
      evidenceName: evidenceName
    }, true).then(res => {
      console.log(res);
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      });
      this.init();
    })
  },

  init: function() {
    this.getDetail();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      asOrderNo: options.asOrderNo
    });
    this.init();
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
// pages/address/manager.js

const { getAddressList, setModifyAddress } = require('../../apis/address.js')
const app = getApp();
app.Page({
  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    address: [],
    formOrder: false,  // 是否来自待付款页面
    orderNo: 0,
    address_id: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderNo) {
      this.setData({
        formOrder: true,
        orderNo: options.orderNo,
      })
    } 
    
    if (options.address_id) {
      this.setData({
        address_id: options.address_id,
      })
    }
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
    let that = this;
    getAddressList().then(function(res){
      let list = res
      if (!list) {
        return;
      }
      for (let i=0; i<list.length; i++) {
        if (list[i].address_id == that.data.address_id) {
          list[i].defaultSel = true;
        } else {
          list[i].defaultSel = false;
        }
      }
      that.setData({
        showView: true,
        address: list
      })
    })
  },

  // 添加地址
  addNew: function () {
    if (this.data.address.length >= 5) {
      wx.showToast({
        icon: 'none',
        title: '最多添加5条收货地址',
        duration: 2000
      })
      return;
    }
    if (this.data.formOrder) {
      wx.navigateTo({
        url:'newAddress'
      })
    } else {
      wx.redirectTo({
        url:'newAddress'
      })
    }
  },

  // 编辑地址
  addressEdit: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (this.data.formOrder) {
      wx.navigateTo({
        url:'newAddress?address_id=' + id
      })
    } else {
      wx.redirectTo({
        url:'newAddress?address_id=' + id
      })
    }
  },

  // 设置
  addressDefault: function (e) {
    let that = this;
    let idx = e.currentTarget.dataset.index;
    let address = that.data.address[idx];
    if (this.data.formOrder) {
      setModifyAddress({
        areaId: address.areadid == 0 ? address.areacid : address.areadid,
        fullName: address.contact_name,
        orderNo: that.data.orderNo,
        street2: address.address_detail,
        tel: address.mobile
      }).then(function(res){
        that.mjd.navigateBack();
      })
    } else {
      that.setPageStorageData({
        address: address
      })
      that.mjd.navigateBack();
    }
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
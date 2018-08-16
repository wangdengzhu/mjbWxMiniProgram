/**
 *帮助中心问题列表
 @dev fanyl
*/
const { getProblemDetail, updateProblemFlag, updateProblemViews } = require('../../apis/helper.js')
const { strDiscode } = require('../../utils/wx-parse.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {

    isShow: 0,
    list: [],
    query: {
      id: -1,
      cateid: -1,
      name: ''
    },
    defailtInfo: {
      useful_flag: 0
    },
    content: '',
    cancatPhoneNumber: '400-8988-111'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mjd.extend(this.data.query, options || {});
    this.showData();

  },

  showData() {
    let { cateid, id, name } = this.data.query;
    getProblemDetail(cateid, id).then(defailtInfo => {
      updateProblemViews(id);
      this.setData({
        content: strDiscode(defailtInfo.qa_answer),
        defailtInfo: this.mjd.extend(this.data.defailtInfo, defailtInfo),
        isShow: 1
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mjd.setNavigationBarTitle(this.data.query.name);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onNav(e) {
    let { id, cateid, name } = e.currentTarget.dataset;
    this.mjd.redirectTo(`/pages/helper/detail?cateid=${cateid}&id=${id}&name=${name}`)
  },
  onDialogChange(e) {
    this.setData({
      'dialog.visibleDialog': false
    })
  },
  callCustomerService(title) {
    wx.showModal({
      title: title,
      content: this.data.cancatPhoneNumber,
      cancelText: '取消',
      confirmText: '拨打',
      cancelColor: '#007AFF',
      confirmColor: '#007AFF',
      success: (e) => {
        if (e.confirm) {
          wx.makePhoneCall({
            phoneNumber: this.data.cancatPhoneNumber
          })
        }
      }
    })
  },
  onOpenConcat() {
    this.callCustomerService('联系客服')
  },
  onFeedback: app.mjd.preventRepeat(function (complete, e) {
    let { value } = e.currentTarget.dataset;
    value = parseInt(value);
    let { id } = this.data.query;
    updateProblemFlag(id, value).then(() => {
      if (value == 1) {
        this.mjd.showToast({
          title: '感谢您的反馈',
          icon: 'success'
        })
      } else {
        this.callCustomerService('没有帮助到您尝试联系客服')
      }
      this.setData({
        'defailtInfo.useful_flag': value
      })
    }).catch(() => {}).then(complete)
  })
})
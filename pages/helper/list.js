/**
 *帮助中心问题列表
 @dev fanyl
*/
const { getProbemList, getCommProblem } = require('../../apis/helper.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:-1,
    name:'',
    isShow: 0,
    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id=options.id;
    this.data.name = options.name;

    this.showData();
  },
  
  showData() {
    (this.data.id == 0 ? getCommProblem() : getProbemList(this.data.id)).then(list => {
      this.setData({
        list,
        isShow: list.length > 0 ? 1 : 2
      })
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mjd.setNavigationBarTitle(this.data.name);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onNav(e) {
    let { id, cateid,name } = e.currentTarget.dataset;
    this.mjd.navigateTo(`/pages/helper/detail?cateid=${cateid}&id=${id}&name=${name}`)
  }
})
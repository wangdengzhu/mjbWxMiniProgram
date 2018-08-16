/**
 *帮助中心问题分类
 @dev fanyl
*/
const { getFirstcate } = require('../../apis/helper.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:0,
    list:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showData();
  },
  showData()
  {
    return getFirstcate().then(list=>{
      list.unshift({
        sort_name:'常见问题',
        qa_sort_id:0
      })
      this.setData({
        list,
        isShow: list.length>0?1:2
      })
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
  
  },
  onNav(e){
    let { id ,name} = e.currentTarget.dataset;

    this.mjd.navigateTo(`/pages/helper/list?id=${id}&name=${name}`)
  }
})
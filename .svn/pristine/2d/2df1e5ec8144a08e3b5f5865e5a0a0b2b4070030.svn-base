/**
 *反馈意见
 @dev fanyl
*/
const { getFeedBackType, addFeedback } = require('../../apis/user.js')
const app = getApp()
app.Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible:false,
    max:6,
    pictures:[],
    feedbackList:[],
    inputNumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  showData()
  {
    getFeedBackType().then(d=>{
        this.setData({
          feedbackList:d.map(item=>{
            return {
              value: item.typeid ,
              label:item.typename
            }
          })
        })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  onSubmit: app.mjd.preventRepeat(function(complete,e){
   
    let { opinion } = e.detail.value,msg='';
    let feedTypeId = this.selectComponent('#feedType').data.currentValue;
    let { uploading, pictures}=this.selectComponent('#upload').data;
    opinion = opinion.trim();
    if (feedTypeId==-1){
      msg ='请选择反馈类型';
    } else if (opinion == '') {
      msg = '请输入您的反馈意见';
    } else if (opinion.length<10){
      msg ='至少输入10个字符';
    } else if (uploading){
      msg = '图片还在上传中，请耐心等待';
    }
    if(msg!=''){
      this.mjd.showToast(msg);
      complete();
      return;
    }
    var submitData={
      "typeid": feedTypeId,
      "content": opinion,
      "pics": ""
    };
    if (pictures.length){
      submitData.pics = pictures.filter(r=>r.status==1).map(r=>r.url).join(',');
    }
    this.saveFeedback(submitData).then(complete)
 }),
  saveFeedback(data)
  {
    return addFeedback({
      data: data,
      autoHideLoading:false,
      autoShowLoading:true,
      showLoadingText:'正在提交中...'
    }).then(()=>{
      wx.hideLoading();
      this.mjd.showToast({ title: '提交成功，感谢您的反馈', icon: 'none', duration:3000})
      setTimeout(()=>{
        this.mjd.switchTab('/pages/personal/personal')
      },3000)
    },()=>{
      wx.hideLoading();
    })
  },
  onInput: app.mjd.debounce(function(e){
    this.setData({
      inputNumber:e.detail.value.length
    })
  },500),
  onVisible(e){
    this.setData({
      visible: e.detail.visible
    })
  },
  onFeedTypeChange(e)
  {
    this.data.feedTypeId=e.detail.value;
  }
})
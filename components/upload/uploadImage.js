/*
图片上传
@dev fanyl
*/
let mjd=require('../../utils/mjd.js')
let app=getApp();
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
      remoteName:{
        type:String
      },
      limit:{
        type:Number,
        value:6
      },
      sizeType:{
        type:Array,
        value: ['compressed']
      },
      uploadBtn:{
        type:String,
        value:''
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pictures:[],
    uploadFiles: [],
    uploading:false,
    currentCount: 0
  },
  attached()
  {

    if (this.data.uploadBtn==''){
      this.setData({
        uploadBtn: `最多${this.data.limit}张`
      })
    }
  },
  /**
   * 组件的方法列表
   * 0未上传 1上传成功 2上传失败 3移除 4图片过大
   */
  methods: {
    onPreviewImage(e) {
      let { url } = e.currentTarget.dataset;
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: this.data.pictures.map(d=>d.url) // 需要预览的图片http链接列表
      })
    },
    onRemovePicture(e) {
      let { index } = e.currentTarget.dataset;
      let uploadFiles = this.data.uploadFiles;
      let item = uploadFiles[index];
      if (item.status == 0 && item.up){
        item.up.abort();
        item.up=null;
      }
      item.status = 3;
      this.refreshictures();
      this.setData({
        uploadFiles: uploadFiles
      });

    },
    onReupload(e){
      let {index}=e.currentTarget.dataset;
      let status = this.data.uploadFiles[index].status;
      if (status!=2)
      {
        return;
      }
        // 重新上传
      this.setData({
        [`uploadFiles[${index}].status`]: 0,
        [`uploadFiles[${index}].progress`]: 0
      })
      this.data.uploading = true;
      this.uploadFile(index, ()=>{
        this.data.uploading = false;
        this.refreshictures();
      })
    },
    setUploadItemStatus(index, status)
    {
      this.setData({
        up: null,
        [`uploadFiles[${index}].status`]: status
      })
    },
    refreshictures()
    {
      this.data.pictures = this.data.uploadFiles.filter(d => d.status == 1);
      this.data.uploading = this.data.uploadFiles.filter(d => d.status ==0).length>0;
    },
    uploadFile(index,completeCallback)
    {
      let successHanlder = (r) => {
        if (this.data.uploadFiles[index].status!=0) {
          return;
        }
        if (r && r.statusCode == 200) {
          let isSuccess = false, response;
          try {
            response = JSON.parse(r.data);
            isSuccess = response && response.code == 1;
          } catch (e) {
          }
          if (isSuccess && response) {
            this.setData({
              up:null,
              [`uploadFiles[${index}].status`]: 1,
              [`uploadFiles[${index}].url`]: response.data
            })
          } else {
            this.setUploadItemStatus(index,2)
          }
        } else {
          this.setUploadItemStatus(index, 2)
        }
        completeCallback();
      }
      let failHanlder =(d) => {
        if (this.data.uploadFiles[index].status != 0) {
          return;
        }
        this.setUploadItemStatus(index, 2);
        completeCallback();
      }
      let progressHanlder =(d) => {
        if (this.data.uploadFiles[index].status != 0) {
          return;
        }
        this.setData({
          [`uploadFiles[${index}].progress`]: d.progress
        })
      }
      let up = mjd.uploadFile(this.data.remoteName, {
        filePath: this.data.uploadFiles[index].url,
        name: 'file',
        success: successHanlder,
        fail: failHanlder
      });
      up.onProgressUpdate(progressHanlder);
      this.data.uploadFiles[index].up=up;
    },
    onChooseImage() {
      let { limit, uploadFiles } = this.data, currentMaxCount = uploadFiles.filter(d => d.status != 3).length, count = limit - currentMaxCount;
      if (count<=0){
        return;
      }
      wx.chooseImage({
        count: count, // 默认9
        sizeType: this.data.sizeType, // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          this.data.uploading=true;
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let start = uploadFiles.length, 
              tempFilePaths = res.tempFilePaths, 
              fileObj = res.tempFiles.map(obj => {
                if(obj.size < 10*1024*1024) {
                  return { url: obj.path, status: 0, progress: 0 }
                }else {
                  return { url: obj.path, status: 4, progress: 0 }
                }
              });
          uploadFiles = uploadFiles.concat(fileObj);
          let uptaskCount = 0;
          fileObj.map(obj => {
            if(obj.status == 0) {
              uptaskCount++;
            }
          });
          this.setData({
            uploadFiles: uploadFiles
          });
          let complteHandler = () => {
            uptaskCount--;
            if (uptaskCount <= 0) {
              this.data.uploading = false;
              this.refreshictures();
            }
          }
          for (let i = start, len = uploadFiles.length; i < len; i++) {
            if(uploadFiles[i].status != 4) {
              this.uploadFile(i, complteHandler)
            }
          }

        }
      })
    }
  }
})

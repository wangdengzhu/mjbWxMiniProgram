/*
圆形进度显示
@dev fanyl
*/
let app=getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent:{
      type:Number,
      value:0,
      observer: function (newVal, oldVal, changedPath) {
        this.drawProgress()
      }
    },
    showInfo:{
      type:Boolean,
      value:false
    },
    fontSize:{
      type:Number,
      value:14
    },
    fontColor: {
      type: String,
      value: ''
    },
    strokeWidth:{
      type: Number,
      value: 6
    },
    radius: {
      type: Number,
      value: 30
    },
    activeColor:{
      type:String,
      value:'blue'
    },
    backgroundColor:{
      type: String,
      value: '#efefef'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:0,
    height: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
      drawProgress()
      {
        var ctx = wx.createCanvasContext('firstCanvas', this), pixelRatio=2;//app.globalData.stytemInfo.pixelRatio;

        var { radius: r, percent, activeColor, backgroundColor, fontSize, fontColor, showInfo } = this.data, PI = Math.PI * 2, v = percent * (PI / 100), start = PI / 4;
        let r2 = r/pixelRatio;
        let width = r2 * 2+10;
        let height = r2 * 2 + 10, x2 = width / 2, y2 = height / 2;
        ctx.lineWidth = this.data.strokeWidth;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = backgroundColor;
        ctx.arc(x2, y2, r2, 0, PI, false);
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.strokeStyle = activeColor;
        ctx.arc(x2, y2, r2, -start, v-start, false);
        ctx.stroke();
      
        if (showInfo) {
          ctx.setFillStyle(fontColor ? fontColor : activeColor);
          ctx.textAlign = 'center';
          ctx.textBaseline ='middle'; 
          ctx.setFontSize(fontSize)
          ctx.fillText(`${percent}%`, x2, y2)
        }
        ctx.draw()
     
        this.setData({
          width: width*2,
          height: height*2
        })
      }
  },
  attached(){
    
  },
  ready: function (e) {
    // 使用 wx.createContext 获取绘图上下文 context
    this.drawProgress();
  }
})

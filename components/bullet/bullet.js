// components/bullet/bullet.js
let app = getApp();

app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    frequency: {
      type: Number,
      value: 0
    },
    msglist: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        if (newVal.length > 0) {
          this.animationFn();
        }
      }
    }
  },
  externalClasses: ['my-class'],
  /**
   * 组件的初始数据
   */
  data: {
    animationData: {}
  },

  ready: function () {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    animationFn: function() {
      let frequency = this.data.frequency * 1000;
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease'
      })
      
      this.animation = animation

      setTimeout(function () {
        animation.opacity(0.7).translate3d(0, -40, 0).step()

        this.setData({
          animationData: animation.export()
        })
      }.bind(this), frequency)

      setTimeout(function () {
        animation.opacity(0).translate3d(0, -60, 0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), frequency+2500)

      setTimeout(function () {
        animation = wx.createAnimation({
          duration: 0,
          timingFunction: 'ease'
        });
        animation.opacity(0).translate3d(0, 0, 0).step();
        this.data.msglist.shift();
        this.setData({
          animationData: animation.export(),
          msglist: this.data.msglist
        });
        if(this.data.msglist.length > 0) {
          this.animationFn();
        }
      }.bind(this), frequency+3000)
    }
  }
})

/*
下拉菜单
@dev fanyl
*/
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:[Number,String],
      value:''
    },
    defaultLabel:{
      type:String,
      value:'',
    },
    defaultValue:{
      type: [Number, String],
      value: ''
    },
    data:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible:false,
    menu:' dropdown-out',
    current:'',
    currentValue:'',
    currentIndex:-1
  },
  attached()
  {
    this.showDetaultLable();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDetaultLable()
    {
      let { value, data, defaultLabel, defaultValue } = this.data, index=-1;
      if (defaultLabel != '' && defaultValue != '') {
        data.unshift({
          value: defaultValue,
          label: defaultLabel
        })
      }
      if (value != '') {
       index = data.findIndex(d => d.value == value);
      } 
      if (data.length>0){
        index=0;
      }
      if (index!=-1)
      {
        this.setValue(index);
      }
    },
    setValue(index)
    {
      let current = this.data.data[index];
      this.setData({
        currentIndex: index,
        currentLabel: current.label,
        currentValue: current.value
      })
    },
    ontransitionend() {
      let visible = this.data.visible;
      if (!visible) {
        this.setData({
          menu: ' dropdown-out'
        })

      }
    },
    onSelectItem(e){
      let {value}=e.currentTarget.dataset;
      let index = this.data.data.findIndex(d => d.value == value);
      if (index!=-1){
        this.setValue(index);
        this.toggleVisibleDown();
        this.triggerEvent('change', { index, value }) // 只会触发 pageEventListener2
      }
    },
    toggleVisibleDown()
    {
      let visible = !this.data.visible;
      this.setData({
        visible: visible,
        menu: ' dropdown-in'
      })
      if (visible) {
        setTimeout(() => {
          this.setData({
            menu: ''
          });
        }, 17)
      }
      this.triggerEvent('visible', { visible}) 
    },
    onSelect(e) {
      this.toggleVisibleDown();
    }
  }
})

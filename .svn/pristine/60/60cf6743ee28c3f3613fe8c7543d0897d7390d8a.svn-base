/*
数字输入框
@dev fanyl
*/
const app = getApp()
app.Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:Number,
      value:1,
      observer(newVal,oldVal){
        if(newVal!=oldVal){
          this.validateValue(newVal)
        }
      }
    },
    min:{
      type:Number,
      value:1
    },
    max:{
      type: Number,
      value: 0
    },
    size:{
      type:String,
      value:'normal'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    disabledAdd:false,
    disabledMinus:false
  },
  attached()
  {
    this.validateValue(this.data.value);
    this.setData({
      disabledAdd: this.data.disabledAdd,
      disabledMinus: this.data.disabledMinus
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    validateValue(value)
    {
      let disabledAdd = false, disabledMinus = false;
      value = String(value).trim();
      value = value==''?1:value;
      if (this.data.min > 0) {
        value = Math.max(value, this.data.min);
        disabledMinus = value <= this.data.min;
      }
      if (this.data.max > 0) {
        value = Math.min(value, this.data.max);
        disabledAdd = value >= this.data.max;
      }
      this.data.disabledAdd = disabledAdd;
      this.data.disabledMinus = disabledMinus;
      return value;
    },
    onConfirm(e)
    {
      this.completeInput(e.detail.value)
    },
    onBlur(e)
    {

      this.completeInput(e.detail.value)
    },
    completeInput(value)
    {
      if (String(value).trim() == '') {
        var value = this.validateValue(1);
        this.setData({
          value,
          disabledAdd: this.data.disabledAdd,
          disabledMinus: this.data.disabledMinus
        });
        this.triggerEvent('change', { value }, { bubbles: false }) 
      }
    },
    changeValue(value)
    {
      if (String(value).trim()==''){
        return;
      }
      value = this.validateValue(value);
      this.setData({
        value,
        disabledAdd: this.data.disabledAdd,
        disabledMinus: this.data.disabledMinus
      })
      this.triggerEvent('change', { value }, { bubbles:false}) 
    },
    onInput(e){
        this.changeValue(e.detail.value)
    },
    onMinus(e){
      if (this.data.disabledMinus) {
        return;
      }
      this.changeValue(this.data.value - 1)
    },
    onAdd(e) {
      if (this.data.disabledAdd) {
        return;
      }
      this.changeValue(this.data.value + 1)
    }
  }
})

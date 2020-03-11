
import {showToast} from '../../utils/asyncWx.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
          //定义一个数组，传递给子组件
      tabs:[
        {
            id:0,
            value:"体验问题",
            isActive:true
        },
        {
            id:1,
            value:"商品、商家投诉",
            isActive:false
        },
      
    ],
    },

    

     // 点击 切换 tab 栏
  handletabsItemChange(e) {
    //   console.log(e);
      let index = e.detail.index;
      let {tabs} = this.data;
      tabs.forEach((item)=>{
          return item.id===index ? item.isActive = true : item.isActive = false;
      });
      this.setData({
          tabs
      });
  },

  // 点击提交
  handleTap() {
    showToast({title:'抱歉，暂时有bug！'});
  }
})
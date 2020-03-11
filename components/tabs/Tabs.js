// components/tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接受父组件传递过来的数组
    tab:{
        type:Array,
        value:[]    //默认是一个空数组
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击事件
    handleItemTap(e){
        //1、获取点击的索引
        console.log(e)
        const index = e.currentTarget.dataset.index;
        //2、触发父组件中的自定义事件, 并将获取到的index 传递过去
        this.triggerEvent("tabsItemChange",{index:index})
    }
  }
})

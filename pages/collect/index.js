// pages/collect/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 收藏的商品数组
        collectGoods:[],
          //定义一个数组，传递给子组件
    tabs:[
        {
            id:0,
            value:"商品收藏",
            isActive:true
        },
        {
            id:1,
            value:"品牌数量",
            isActive:false
        },
        {
            id:2,
            value:"店铺收藏",
            isActive:false
        },
        {
            id:3,
            value:"浏览足迹",
            isActive:false
        }
    ],
    },

    onShow(){
        //获取缓存中 收藏的商品
        let collectGoods = wx.getStorageSync("collect");
        // 将获取 到 收藏的商品数组保存到 data中
        console.log(collectGoods)
        this.setData({
            collectGoods
        });
    },

    //点击切换 tab 栏
    handletabsItemChange(e) {
        //   console.log(e);
          let index = e.detail.index;   // 找到点击 对应的索引
          // 获取原数组
          let {tabs} = this.data;
          // 修改原数组
          tabs.forEach((item)=>{
              return item.id===index ? item.isActive = true : item.isActive = false;
          });
          // 重新赋值原数组
          this.setData({
              tabs
          });
      },
})
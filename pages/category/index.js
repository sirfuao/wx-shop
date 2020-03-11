//引入 js请求模块 
import {request} from '../../request/request.js'

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //左边的菜单栏数据
    leftMenuList:[],
    //右边的内容数据
    rightConentList:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容区的 滚动条距离顶部的距离
    scrollTop:0
  },

  //定义一个用来保存接口的返回数据
  cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /*
      使用缓存技术
      在web中使用本地缓存 和 在小程序中使用本地缓存的区别
        1、写代码的方式不一样
            web中: localStorage.setItem("key","value");  locaStorage.getItem("key");
            小程序中：wx:setStorageSync("key","value");   wx.getStorageSync("key") 
        2、存在类型转换
        web：不管存入的是什么类型的数据，最终都会先调用下 toSing()，把数据变成字符串，再存进去
        小程序：不存在 类型的转换这个操作 存什么类似的数据进去，获取的时候就是什么类型
    
    1、先判断一下本地存储中有没有旧数据
    {tiem:Date.now(),data:[...]}
    2、没有旧数据，直接发送请求
    3、有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可
      */

    //1、获取本地存储中的数据 (小程序中也是存在 本地存储 技术)
    const cates = wx.getStorageSync("cates");
    //2、判断
    if(!cates){
        //如果不存在 发送请求获取数据
        this.getCates();
    }else{
        //有旧的数据 定义过期时间  10s 改成 5分钟
        if(Date.now()-cates.time > 1000*10){
            //如果数据过期了 则重新发送请求
            this.getCates();
        }else{
            //如果数据还没过期 可以使用数据
            console.log("a")

        //将本地存储中的cates中的data 数据 保存到变量cates中;
        this.cates = cates.data;
        //给左边的菜单栏添加数据
        let leftMenuList = this.cates.map((item)=>{
            return item.cat_name
        });
        //给右边的内容区添加数据
        let rightConentList = this.cates[0].children;
        this.setData({
            leftMenuList,
            rightConentList
        });

        }
    }
  },

  //获取分类页面数据
  getCates() {
    request({url:"/categories"}).then((res)=>{
        this.cates = res.data.message;

        //把接口的数据存入到本地存储中
        wx.setStorageSync("cates",{time:Date.now(),data:this.cates})

        //给左边的菜单栏添加数据
        let leftMenuList = this.cates.map((item)=>{
            return item.cat_name
        });
        //给右边的内容区添加数据
        let rightConentList = this.cates[0].children;
        this.setData({
            leftMenuList,
            rightConentList
        });
    });
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    // 1、获取被点击的标题身上的索引
    // 2、给data中的currentIndex赋值就可以了
    // 3、根据不同的索引来渲染右侧的商品内容
    // console.log(e)
   let index = e.currentTarget.dataset.index;
   this.setData({
       currentIndex:index
   });
    this.setData({
        //右侧的内容跟随者 索引index 的变化而切换
        rightConentList:this.cates[index].children,
        //将内容区滚动条 距离顶部的距离 重新设置为0;
        scrollTop:0
    });
  }
})
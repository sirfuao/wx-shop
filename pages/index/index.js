// 引入 用来发送请求的方法 一定要把路径补全
import { request } from "../../request/request.js" //因为这个 request 请求使用export 导出的 所以要加 双大括号

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 轮播图数据
        swiperList:[],
        //导航栏数据
        navList:[],
        //楼层数据
        froolList:[]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSwiperList();
        this.getNavList();
        this.getFloorList();
    },
    
    // 首页轮播图数据请求
    getSwiperList() {
        request({url:"/home/swiperdata"}).then((res)=>{
            //    console.log(res);
            this.setData({
                swiperList:res.data.message
            })
        });
    },
    //首页分类导航数据请求
    getNavList() {
        request({url:"/home/catitems"}).then((res)=>{
            // console.log(res);
            this.setData({
                navList:res.data.message
            });
        });
    },
    //首页楼层数据请求
    getFloorList() {
        request({url:"/home/floordata"}).then((res)=>{
            // console.log(res)
            this.setData({
                floorList:res.data.message
            });
            console.log(res)
        });
    },
  })
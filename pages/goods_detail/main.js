// 引入封装的js 请求模块
import {request} from '../../request/request.js'
// 使用 es7 中的 async 和 await 方法
import regeneratorRuntime from '../../lib/runtime/runtime'

import {showToast} from "../../utils/asyncWx.js"

//1、发送请求和获取数据
//2、点击轮播图 预览大图
    // 1、给轮播图添加点击事件
    // 2、调用小程序的api previewImage 

//3、 点击 加入购物车
    // 1、先绑定点击事件
    //2、获取缓存中的购物车数据 数组格式
    //3、先判断 当前的商品是否已经存在于 购物车
    // 4、已经存在 修改商品的数据 执行购物车数量 ++  重新把购物车数组填回缓存中
    // 5、不存在购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组填回缓存中
    // 6、弹出提示
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //商品详情数据
    goodsDetail:{},
    // 当前商品是否被收藏
    isCollect:false
  },
  //需要的商品对象信息 
  goodsInfo:{},
  goods_id:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 navgatior 跳转 传过来的 goods_id
    this.goods_id = options.goods_id;
    console.log(this.goods_id);
    this.getGoodsDetail();
  },
  //获取商品详情数据
  async getGoodsDetail() {
    const {data:res} = await request({url:'/goods/detail',data:{goods_id:this.goods_id}});
    this.goodsInfo = res.message;
    // console.log(res);
    let goodsDetail = {
        pics:res.message.pics,
        // iphone 部分手机 不识别 webp格式图片
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp =》 1.jpg 
        goods_introduce:res.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        goods_price:res.message.goods_price,
        goods_name:res.message.goods_name
    }
    //1、获取缓存中的商品收藏
    let collect = wx.getStorageSync('collect')||[];
    //2、判断当前商品是否被收藏
    let isCollect = collect.some((item)=>item.goods_id === this.goodsInfo.goods_id);
    this.setData({
        goodsDetail,
        isCollect
    });
    console.log(this.data.goodsDetail)
  },

  //点击预览大图效果
  handlePreviewImage(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    let urls = this.data.goodsDetail.pics.map((item)=>{
        return item.pics_mid
    });
    console.log(urls)
    wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
  },

  //点击添加到购物车
  handleCartAdd() {
      console.log("a")
      //1、获取缓存中的购物车 数组
      let cart = wx.getStorageSync('cart')||[]; //如果是第一次获取 则cart就是个空字符串 加[] 是为了将空字符串转换成数组
    // 2、判断商品对象是否存在购物车数组中
      let index = cart.findIndex((item)=>{  //findIndex 返回 找到的元素的索引 早不到就返回 -1
          return item.goods_id===this.goodsInfo.goods_id
      });
      if(index===-1){
        // 3、如果不存在，则第一次添加
          this.goodsInfo.num = 1;
          //添加一个商品的选中状态 
          this.goodsInfo.checked = true;
          cart.push(this.goodsInfo);
        console.log("a")
      }else{
       // 4、已经存在购物车数据 执行 num++
        cart[index].num ++
      }
    // 5、把购物车重新添加回缓存中
      wx.setStorageSync('cart', cart);
      //6、弹框提示
      wx.showToast({
          title: '添加成功',
          mask: true,
      });
  },

  // 点击商品收藏
  handleCollect() {
      let isCollect = false;
      //1、获取缓存中的商品收藏数组
      let collect = wx.getStorageSync("collect")||[];
      //2、判断该商品是否被收藏过
      let index = collect.findIndex((item)=>item.goods_id===this.goodsInfo.goods_id);
      // 3、当 index !== -1 时， 表示已经收藏过
      if(index !== -1){
        // 4、表示 能找到 已经收藏过
        collect.splice(index,1); //将它从数组中移出
        isCollect = false
        // 弹框提示
        showToast({title:'取消收藏成功！',icon:"success"});     
      }else{
          // 5、表示 没有收藏过
          collect.push(this.goodsInfo); //将当前商品 添加到 商品收藏数组中
          isCollect = true
          // 弹框提示
          showToast({title:"收藏成功！",icon:"success"})
      }
      // 6、将修改后的 数组存入 到缓存中
      wx.setStorageSync("collect",collect);
      // 修改data 中的数据
      this.setData({
          isCollect
      });
      console.log(index)
  },

  // 立即购买
  nowPay() {
      console.log("a")
      // 获取购物车数组缓存
      let cart = wx.getStorageSync('cart')||[]; //如果 缓存中没有购物车数组，就会获取的是一个空字符串，加上[] 是为了将空字符串变为空数组
      // 判断购物车数组中有没有 该商品
      let index = cart.findIndex((item)=>item.goods_id===this.goodsInfo.goods_id);
      if(index===-1){
          // 如果不存在 ，就先将该商品添加到购物车数组
          // 3、如果不存在，则第一次添加
          this.goodsInfo.num = 1;
          //添加一个商品的选中状态 
          this.goodsInfo.checked = true;
          cart.push(this.goodsInfo)
          // 将购物车数组重新 设置回缓存中
          wx.setStorageSync('cart', cart);
      }
      // 如果 存在 就直接 跳转到购物车数组
      wx.switchTab({
          url: '/pages/cart/index',
      });
  }
})
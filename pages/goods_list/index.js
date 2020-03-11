//js网络请求模块
import {request} from '../../request/request.js'
//使用 es7 中的 async 和 await 方法
import regeneratorRuntime from '../../lib/runtime/runtime'

/*
    1、用户上滑页面 滚动条触底 开始加载下一页数据
        1、找到滚动条触底事件
        2、判断还有没有下一页数据
            1、获取到总页数 只有总条数
                总页数 = Math.ceil(总条数 / 页容量 pagesize)
                总页数 = Math.ceil(23 / 10) = 3
            2、获取到当前的页码 pagenum
            3、判断一下 当前的页码是否大于等于 总页数
        3、假如没有洗衣液数据了， 弹出个提示框
        4、假如还有下一页数据，那就加载下一页数据
            1、当前的页码 ++
            2、重新发送请求
            3、数据请求回来 要对data数组 进行 拼接 而不是替换
    
    2、下拉刷新
        1、触发下拉刷新事件，需要在页面的 json 文件中开启一个配置项
            找到 触发下拉刷新的事件
        2、重置 数据 数组
        3、重置页码 设置为 1
        4、重新发送请求
        5、数据请求回来后，关闭 就刷新圆点跳动的效果;
*/

Page({
  /**
   * 页面的初始数据
   */
  data: {
      //定义一个数组，传递给子组件
    tabs:[
        {
            id:0,
            value:"综合",
            isActive:true
        },
        {
            id:1,
            value:"销量",
            isActive:false
        },
        {
            id:2,
            value:"价格",
            isActive:false
        }
    ],
    //商品列表数据
    goodsList:[]
  },

  //请求接口需要的参数
  queryParams:{
      query:'',
      cid:'',
      pagenum:1,    //当前的页码值
      pagesize:10  //每页显示多少条数据
  },

  //总页数
  totalPages:'',
  /**
   * 生命周期函数--监听页面加载
   */
    //option 中保存着上一个页面中传递过来的参数
  onLoad: function (options) {
    // console.log(options.cid)
    this.queryParams.cid = options.cid||'';
    this.queryParams.query = options.query||'';
    this.getGoodsList()
  },

  //商品列表数据的接口请求
  async getGoodsList(){
      const {data:res} = await request({url:"/goods/search",data:this.queryParams}); 
      let total = res.message.total;
    //   总页数就等于
    this.totalPages = Math.ceil(total / this.queryParams.pagesize)
    //   console.log(res)
    //   console.log(this.totalPages)
      this.setData({
          //这里是为了防止加载下一页数据的时候 ， 下一页数据覆盖上一页数据 , 所以这里采取的是 用 解构 拼接下一页数组
          goodsList:[...this.data.goodsList, ...res.message.goods]
      });
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

  //监听用户下拉触底事件 加载下一页数据
  onReachBottom() {
    if(this.queryParams.pagenum==this.totalPages||this.pagenum>this.totalPages){
        wx.showToast({
            title: '没有下一页数据了',
        });
          
    }else{
        this.queryParams.pagenum ++;
        this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh() {
      // 重置列表数组
      this.setData({
          goodsList:[]
      });
      //重置页码值
      this.queryParams.pagenum = 1
      // 重新发起请求
      this.getGoodsList()
      // 关闭下拉刷新的效果
      wx.stopPullDownRefresh()
  }
})
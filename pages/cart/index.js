/*
    1、获取收货地址
        1、绑定点击事件
        2、调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
    
    2、获取 用户 对小程序 所授予 获取地址的 权限状态 scope
        1、假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
            scope 值 为true 直接调用 获取收货地址
        2、假设 用户 重来没有调用过 获取收货地址的api
            scope 的值此时就为 undefined 此时就直接 调用收货地址
        3、假设 用户 点击获取收货地址的提示框 取消
            scope 的值就为 false
            1、诱导用户 自己 打开 授权设置页面 当用户重新给与 获取地址权限的时候
            2、获取收货地址
        4、把获取到的地址值存储到本地存储中
    
    3、页面加载完毕
        0、onLoad   onShow
        1、获取本地存储中的地址数据
        2、把数据 设置给data中的一个变量
    
    4、onShow
            回到详情页手动添加 1、num = 1
                              2、checked =true
        1、获取缓存中的购物车数组
        2、把购物车数据 填充到data中

    5、全选的实现 数据的展示
        1、 onShow 获取缓存中的购物车数组
        2、根据购物车中的商品数据 所有的商品都被选中 checked = true 全选就被选中
    
    6、总价格和总数量
        1、都需要商品被选中 我们才拿它来计算
        2、获取购物车数组
        3、遍历
        4、判断商品是否被选中
        5、总价格 += 商品的单价 * 商品的数量
        6、总数量 += 商品的数量
        7、把计算后的价格和数量 设置回data中即可

    7、商品的选中
        1、绑定change事件
        2、获取到被修改的商品对象
        3、商品对象的选中状态 取反
        4、重新填充回data中 和缓存中
        5、重新计算全选 总价格 总数量

    8、全选和反选
        1、给全选复选框绑定事件
        2、获取data中的全选变量
        3、直接取反
        4、遍历购物车中数组 让里面商品 选中状态跟随  allChecked 改变而改变
        5、把购物车数组 和 allChecked 重新设置回data中 把购物车数组重新设置回缓存中
    
    9、商品数量的编辑
        1、"+" "-" 按钮 绑定同一个点击事件 区分的关键 是自定义属性
            1、 "+" 加 +1
            2、"-"   减-
        2、传递被点击的商品id  goods_id
        3、获取data中的购物车数组 来获取须要被修改的商品对象
        4、当 购物车的数量  =1 同时 用户 点击 "-"
            弹框提示 询问用户 是否要删除
            1、确定 直接删除
            2、取消 什么都不做
        4、直接修改商品对象的数量 num
        5、把cart数组重新 设置回 缓存中和 data中

    10、点击结算
        1、判断有没有收货地址信息
        2、判断用户有没有选购商品
        3、经过以上验证，跳到支付页面
*/

//使用 es7 中的 async 和 await 方法
import regeneratorRuntime from '../../lib/runtime/runtime'
//进入 封装的 微信小程序 api 模块
import {getSetting,chooseAddress,openSetting, showModal,showToast} from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //收货地址
    address:{},
    //缓存中的购物车数组
    cart:[],
    //全选
    allChecked:true,
    //总价格
    totalPrice:0,
    //总数量
    totalNum:0
  },

  onShow(){
      //1、获取 缓存中的收货地址信息
      const address = wx.getStorageSync('address');
      this.setData({
          address
      });
      // 获取购物车数组
      let cart = wx.getStorageSync('cart')||[];
      this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //点击获取收货地址
    async handelChooseAddress() {
    // 逻辑
    //    //1、获取用户权限
    //    wx.getSetting({
    //        success: (result) => {
    //         //    2、获取权限状态 只要发现一些 属性名很怪异的时候 都要用 [] 形式来获取属性值
    //            const scopeAddress = result.authSetting["scope.address"];
    //            if(scopeAddress===true||scopeAddress===undefined){
    //                wx.chooseAddress({
    //                    success:(result1)=>{
    //                     console.log(result1)
    //                    }
    //                })
    //            }else{
    //                //3、用户 以前拒绝过授予权限 先诱导用户打开权限页面
    //                wx.openSetting({
    //                    success: (result2) => {
    //                     //4、可以调用 获取收货地址
    //                        wx.chooseAddress({
    //                           success:(result3)=>{
    //                            console.log(result3)
    //                          }
    //                       })
    //                    },
    //                });
    //            }
    //        }
    //    });
        
    //依照逻辑的简化版
    // 1、获取 权限状态
   try{
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting['scope.address'];
    // 2 判断 权限状态
    if(scopeAddress === false){
        // 先诱导用户打开授权页面
        await openSetting();
    }
    //4、调用获取收货地址的 api
    const res2 = await chooseAddress();
    //将获取到的 地址值存储到本地缓存中
    wx.setStorageSync('address', res2);
    console.log(res2)
   }catch(err){
       console.error(err)
   }
  },

  // 单选框的 选中与取消的触发事件
  checkedChange(e) {
    //   console.log(e)
    // 获取点击的商品id
    let goods_id = e.currentTarget.dataset.id;
    //获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex((item)=>item.goods_id === goods_id);
    //找到后 取反
    cart[index].checked =! cart[index].checked
    //将 数组重新填回data中 和缓存中
    this.setData({
        cart
    });
    //重新计算总价格和总数量
    this.setCart(cart);
  },

  //点击全选
  allCheckedChange(){
      //获取到购物车数组 和全选变量
      let {cart,allChecked} = this.data;
        allChecked =! allChecked;
        cart.forEach((item)=> item.checked=allChecked);
        this.setData({
            allChecked
        });
        //重新计算商品数量和总价格
        this.setCart(cart);
    },
    
    //修改商品数量
   async operationGoods(e) {
        // console.log(e);
        //获取购物车数组
        let {cart} = this.data;
        //获取修改商品id 和 加减参数
        let {id,operation} = e.currentTarget.dataset;
        //获取要修改商品的索引
       let index = cart.findIndex((item)=> item.goods_id === id);
       if(cart[index].num===1&&operation===-1){
           // 弹框提示
           const res = await showModal({content:'您是否要删除该商品！'});
           if(res.confirm){
               cart.splice(index,1);
               this.setCart(cart);
             }
           }else{
            // 进行商品数量修改
            cart[index].num += operation;
            //重新计算 商品总价 和商品数量
            this.setCart(cart);
       }
    },

    // 点击结算
   async handlePay() {
        let {cart,address} = this.data;
        //判断用户有没有选购商品
        if(cart.length===0){
            await showToast({title:'您还没有选购商品'});     
            return
        }
        //判断用户是否添加收货地址
        if(!address.userName){
            await showToast({title:'请添加收货地址'});
            return
        }
        //如果上面 都已添加 就跳转到支付页面
        wx.navigateTo({
            url:'/pages/pay/index'
        });
    },

    // 设置购物车状态同时 重新计算底部工具栏的数据 全选 总价格 购买数量
    setCart(cart){
        //计算全选
        const allChecked = cart.length>0?cart.every((item)=>item.checked) : false;
        //计算总数量
        let totalNum = 0;
        let totalPrice = 0;
        cart.forEach((item)=>{
            if(item.checked){  //如果当前商品是处于选中状态，那就计算
                totalNum += item.num  //计算商品数量
                totalPrice += item.goods_price*item.num
            }
        });
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum,
            totalPrice
        });
        //计算完后 将购物车数组重新 保存到缓存中
        wx.setStorageSync('cart',cart);
        console.log(totalPrice)
  }
})

/*
    1、页面加载的时候
        1、从缓存中获取购物车数据 渲染到页面
            这些数据 checked=true
        2、微信支付
            1、哪些人 哪些账号  可以实现微信支付
                1、企业账号
                2、企业账号的小程序后台中 必须 给开发者 添加上白名单
                    1、 一个 appid 可以同时绑定多个开发者
                    2、这些开发者就可以公用这个 appid 和 它的开发权限
        3、支付按钮
            1、 先判断缓存中有没有token
            2、没有 跳转到授权页面 进行获取 token
            3、有 token 那就进行 正常操作
*/

Page({
    /**
     * 页面的初始数据
     */
    data: {
        //缓存中的收货地址
        address:[],
        //缓存中的购物车数组
        cart:[],
        //商品总数量
        total:0,
        //商品总价格
        totalPay:0
    },
    onLoad() {
        //获取缓存中的收货地址
        let address = wx.getStorageSync('address');
        // 获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart')||[];
        //过滤购物车数组，选取 checked 为true的
         let checkedCart = cart.filter((item)=>{
            return item.checked
        });
        //获取商品的总数量
        let total = 0;
        //获取商品的总价格
        let totalPay = 0
        checkedCart.forEach((item)=>{
            total += item.num;
            totalPay += item.num * item.goods_price;
        });
        this.setData({
            address,
            total,
            totalPay,
            cart:checkedCart
        });
        console.log(this.data.address)
    },

    //点击支付按钮
    handleOrderPay() {
        // 获取用户的 token
        let token = wx.getStorageSync('token')
        //如果用户 token 不存在的情况下
        if(!token){
            //就跳转到授权页面
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return
        }
    }
})  
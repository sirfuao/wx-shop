
/*
    1、输入框绑定 值改变事件 input事件
        1、获取到输入框的值
        2、合法性判断
        3、检验通过 把输入框的值 发送到后台
        4、返回的数据打印到页面上
    2、防抖 (防止抖动) 定时器 节流
        1、 防抖 一般 输入框中 防止重复输入 重复发送请求
        2、节流 一般是用在页面下拉 和 上拉
        定义全局的定时器 id
*/
// js 网络请求模块
import {request} from '../../request/request.js'
// 使用 es7中的 async 和await 方法
import regeneratorRuntime from '../../lib/runtime/runtime'
// 引入 promise 封装的微信小程序 API
import {showToast} from '../../utils/asyncWx.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 搜索 返回的商品数组
        searchGoods:[],
        //控制输入框中的按钮显示隐藏
        isFocus:false,
        // 输入框的值
        inputValue:''
    },
    // 定义一个定时器
    timeId:1,
    // 输入框 输入文字时的监听事件
    handleInput(e) {
        console.log(e)
        //1、获取输入框的值
        let value = e.detail.value;
        // 2、检测 合法性
        if(!value.trim()){
            // 当用户输入的是空格的时候
            showToast({title:'请不要输入无效空格！'});
            value='';
            return;
        }
        //显示取消按钮
        this.setData({
            isFocus:true
        });
        console.log(value)
        // 防抖的 实现
        // 清除定时器
        clearTimeout(this.timeId);
        // 开启一个定时器
        this.timeId = setTimeout(() => {
            //发送请求
            this.search(value);
        }, 1000);
    },
    // 发送请求 获取搜索出来的数据
    async search(query) {
        const res = await request({url:'/goods/qsearch',data:{query}})
        console.log(res)
        this.setData({
            searchGoods:res.data.message
        });
    },

    // 点击取消按钮
    handleCancel() {
        //1、将输入框的值设置为空
        //2、将取消按钮隐藏
        //3、将商品数组设置为空
        console.log("a")
        this.setData({
            inputValue:'',
            isFocus:false,
            searchGoods:[]
        });
    }
})
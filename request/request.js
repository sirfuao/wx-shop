
//同时发送异步代码的次数
let ajaxTimes = 0;

//使用promise封装一个 请求
export function request(params){
    ajaxTimes ++  //发送一次请求就加一次

    // 在请求 数据回来之前 显示一个加载中
    wx.showLoading({
        title: '加载中',
      })

    //定义公共部分 url
    const baseUrl = ""
    //将传过来的参数结构出来
    return new Promise((resolve,reject)=>{
        // 发起请求          
        wx.request({
            ...params,
            url:baseUrl + params.url,
            success:(res)=>{
                //成功的回调
                resolve(res)
            },
            fail:(err)=>{
                //失败的回调
                reject(err)
            },
            complete:()=>{
                ajaxTimes -- //请求完成一次 ，就减一次
                if(ajaxTimes===0){
                    //当所有的请求都完成时，就关闭 加载中 弹框
                    wx.hideLoading()
                }
            }
        });
    });
}
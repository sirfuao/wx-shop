/*
    使用Promise 封装微信小程序的api
*/

// Promise 形式 的 getSetting
export function getSetting(){
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success:(result)=>{
                resolve(result)
            },
            fail:(err)=>{
                reject(err)
            }
        });
    });
}

// Promise 形式 的 chooseAddress
export function chooseAddress(){
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success:(result)=>{
                resolve(result)
            },
            fail:(err)=>{
                reject(err)
            }
        });
    });
}

// Promise 形式 的 openSetting
export function openSetting(){
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success:(result)=>{
                resolve(result)
            },
            fail:(err)=>{
                reject(err)
            }
        });
    });
}

// 弹窗提示 用户是否删除商品 Promise形式的 showModal
export function showModal({content}) {
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title:'提示',
            content:content,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}

//弹框轻提示
export function showToast({title,icon="none"}) {
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title:title,
            icon:icon,
            mask:true,
            duration: 1500,
            success:(res)=>{
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}

// 获取登录凭证（code
export function login() {
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            },
        });
    });
}

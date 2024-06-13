//处理错误上报

/**
捕获错误的方式：
1. Try..catch 捕获的异常必须是线程执行进入到try...catch且try...catch未执行完的时候抛出来(不捕获setTimeout,Promise中错误,async可以)
2. window.onerror 当资源加载失败或无法使用时，会在Window对象触发error事件，（无法捕获promise错误，可以捕获setTimeout错误）
3. unhandledrejection 当 Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
4. Vue.config.errorHandler  这个钩子函数可以处理大部分 Vue 应用中的错误

 window.addEventListener('error') + window.addEventListener('unhandledrejection') 的方式恰好能够覆盖5种异常错误
 （同步任务，普通异步任务，promise任务，async任务，资源加载）的捕获。

错误信息上报：
1. Ajax上报：发现错误的时候上传错误到接口进行存储，
* 有严格的跨域限制
* 上报请求可能会阻塞业务
* 请求容易丢失（被浏览器强制cancel）

2. Image上报：由于图片天然可跨域，又能兼容所有的浏览器，而js和css等其他资源文件则可能出现安全拦截和跨域加载问题。但由于是一个get请求，上报的数据量在不同的浏览器下上限不一致（2kb-8kb），这就可能出现超出长度限制而无法上报完整数据的情况

3. navigator.sendBeacon(url, data)：使用 sendBeacon() 方法会使用户代理在有机会时异步地向服务器发送数据，同时不会延迟页面的卸载或影响下一导航的载入性能，这个方法天生就是为了数据统计而设计的，它解决了XMLHttpRequest和图片上报的绝大部分弊端：没有跨域问题、不阻塞业务，甚至能在页面unload阶段继续发送数据，完美地解决了普通请求在unload阶段被cancel导致丢数据的问题，唯一的问题就是IE并不支持。
* 数据发送是可靠的。
* 数据异步传输。
* 不影响下一导航的载入。
*/

function errorHandler(err, vm, info) {
    console.log('vue异常错误捕获: ', '错误信息 ' + info)
    // TODO: 处理错误上报
    reportError(err)
}
//
const reportError=(error)=>{
    if(navigator.sendBeacon){//判断sendBeacon是否支持可用
        let data = new Blob(
        [`projectId=123456&error=${error.name}:${error.message}`],{
            type:'application/x-www-form-urlencoded'
        })
        navigator.sendBeacon('http://localhost:7001/accept_beacon',data);
    }
}

let GlobalError = {
    install: (Vue, options) => {
        Vue.config.errorHandler = errorHandler
        // eslint-disable-next-line max-params
        window.onerror = function (message, source, line, column, error) {
        errorHandler(message, null, '全局捕获错误')
        // console.log('全局捕获错误', message, source, line, column, error)
        }
        window.addEventListener('unhandledrejection', (event) => {
        errorHandler(event, null, '全局捕获未处理的Promise异常')
        })
    },
}

export default GlobalError


//main.js
import ErrorPlugin from './errorPlugin'
createApp(App).use(router).use(ErrorPlugin).mount('#app')


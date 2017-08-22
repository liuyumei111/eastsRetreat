/**
 * Created by Administrator on 2017/8/17.
 */


/**
 * 判断是iOS或是安卓，改变数据的获取方式
 *
 * */
var ua = navigator.userAgent.toLowerCase();
if (/iphone|ipad|ipod/.test(ua)) {
    //alert('iOS的弹窗');
    //postSuccessToken();
    //getToken(token);

} else {
    //alert('android的弹窗。');
    //poseAndroidToken();
}

//调用ios获取token方法。
function postSuccessToken() {
    window.webkit.messageHandlers.postSuccessToken.postMessage('getToken');
}

//调用Android获取token方法
function poseAndroidToken() {
    window.aaa.bbb('哈哈');
}

function getToken(token) {
    localStorage.setItem('token',token);
    var token=localStorage.getItem('token');
    $('#token').html(token);
    //alert('获取到的token为'+token);
}
/*var token=locationSearcher('token');
 localStorage.setItem('token',token);*/



$(document).ready(function () {
    //轮播图
    var slide3 = new auiSlide({
        container:document.getElementById("aui-slide3"),
        // "width":300,
        "height":184,
        "speed":500,
        "autoPlay": 5000, //自动播放
        "loop":true,
        "pageShow":true,
        "pageStyle":'dot',
        'dotPosition':'center'
    });

    //        时间卡
    var navTab=$('.tabClick');
    var tabTop=navTab.offset().top;
    console.log(tabTop);

    var wh=$(window).height();
    console.log(wh);


    $('#tab1').scroll(function () {
        var ws=$(window).scrollTop();
        var s=wh-ws;
        console.log(s);

        if (ws>=tabTop){
            alert('小于200了')
        }

    });
});
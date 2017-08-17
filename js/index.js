/**
 * Created by Administrator on 2017/8/17.
 */


$(document).ready(function () {

    var token=locationSearcher('token');
    localStorage.setItem('token',token);

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
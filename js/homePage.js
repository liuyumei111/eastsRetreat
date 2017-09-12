/**
 * Created by Administrator on 2017/7/25.
 */
$(document).ready(function () {


    //banner
    //轮播
    var bannerTpl=$('#swiper-template').html();
    var bannerCmp=Handlebars.compile(bannerTpl);
    
    var range = 200, //距下边界长度/单位px
        maxnum = 0, //设置课程总数
        num = 0, //当前数量
        totalheight = 0,
        flag=0,
        start='0',
        lengh='3',
        listNum=0,
        pageIndex='0',
        pageLength='5',
        listMaxNum=0,
        listFlag=0;



    var now = new Date();
    var hour = now.getHours();
    var hourRange = 0;
    if (hour >= 20) {
        hourRange = 6;
    } else if (hour >= 16) {
        hourRange = 5;
    } else if (hour >= 12) {
        hourRange = 4;
    } else if (hour >= 8) {
        hourRange = 3;
    } else if (hour >= 4) {
        hourRange = 2;
    } else {
        hourRange = 1;
    }

    for (var i=1; i<hourRange; i++){
        // 已过期的时间段
        $('ul.tabClick').find('li[data-hour-range="'+i+'"]').find('div.desc').html('抢购中');

    }

    // 当前时间段
    $('ul.tabClick').find('li[data-hour-range="'+hourRange+'"]').addClass('active');
    $('ul.tabClick').find('li[data-hour-range="'+hourRange+'"]').find('div.desc').html('抢购中');

    var navTab=$('.tabClick');
    var tabTop=navTab.offset().top;

    var nowHourRange=null;
    nowHourRange=$('.active').data('hour-range');
    var thatHourRange=$('.active').data('hour-range');

    getBanner();
    getSeckillThree(nowHourRange);
    setTimeout(function () {
        getSeckillList(nowHourRange);
    },200);

    $('.data-tab').unbind().bind('click',function () {
        $(this).addClass('active').siblings().removeClass('active');
        nowHourRange=$('.active').data('hour-range');

        start=listNum=pageIndex=0;

        $('#tab1').empty();
        getSeckillThree(nowHourRange);
        setTimeout(function () {
            getSeckillList(nowHourRange);
        },100);


    });


    //监听滚动高度，加载数据
    $(window).on('scroll',function () {

        var st=$(this).scrollTop();
        var scrollPos= $(window).scrollTop(); //滚动条距顶部距离
        totalheight = parseFloat($(window).height()) + parseFloat(scrollPos);
        //console.log(st);
        //console.log(tabTop);
        if (st>=tabTop){
            navTab.addClass('tab-fiexd');
        }else {
            navTab.removeClass('tab-fiexd');
        }
        if (pageIndex>listMaxNum){
            return false;
        }
        if (($(document).height()-range)<=totalheight&&listNum<listMaxNum){
            //这里不能使用模板填充，应该是append()....
            getSeckillList(nowHourRange);
        }

    });



    var seckillTpl=$('#seckill-template').html();
    var seckillCmp=Handlebars.compile(seckillTpl);

    var seckillNextTpl=$('#seckill-list-template').html();
    var seckillNextCmp=Handlebars.compile(seckillNextTpl);


    //获取当前时间节点下的前三条数据
    function getSeckillThree(hourRange) {
        if (flag){
            return false;
        }
        flag=1;
        $.ajax({
            url:C.interface.seckill,
            type:'get',
            dataType:'json',
            data:{
                hourRange:hourRange,
                start:start,
                length:lengh
            },
            success:function (response) {
                if (response.result=='success'){

                    num++;
                    //这里转义成json对象
                    var data=response.list;
                    for (var i = 0; i < data.length; i++) {
                        //console.dir(data[i].productdetail);
                        data[i].productdetail = JSON.parse(data[i].productdetail);
                        var skus = data[i].skus;
                        for (var j = 0; j < skus.length; j++) {
                            skus[j].skuDetail = JSON.parse(skus[j].skuDetail);
                        }
                    }
                    //console.log(data);
                    maxnum=response['totalRecords'];
                    start=num * lengh;
                    if (maxnum == 0){
                    }
                    if (data.length>0){
                        $('#tab1').append(seckillCmp(data));

                    }else {
                    }
                    flag=0;
                }
            }

        })

    }
    //获取除去首页三条数据外的其他数据
    function getSeckillList(hourRange) {
        if (listFlag){
            return false;
        }
        $('.loading').show();
        $('.no-info').hide();
        listFlag=1;
        $.ajax({
            url:C.interface.seckill,
            type:'get',
            dataType:'json',
            data:{
                hourRange:hourRange,
                token:C.token,
                start:pageIndex,
                length:pageLength
            },
            success:function (response) {
                if (response.result=='success'){
                    $('.loading').hide();

                    listNum++;
                    //这里转义成json对象
                    var data=response.list;
                    for (var i = 0; i < data.length; i++) {
                        //console.dir(data[i].productdetail);
                        data[i].productdetail = JSON.parse(data[i].productdetail);
                        var skus = data[i].skus;
                        for (var j = 0; j < skus.length; j++) {
                            skus[j].skuDetail = JSON.parse(skus[j].skuDetail);
                        }
                    }
                    console.log(data);

                    listMaxNum=response['totalRecords'];
                    pageIndex=listNum * pageLength;
                    if (maxnum == 0){
                        $('.no-info').show();
                    }
                    if (data.length>0){
                        if (listNum == 1){
                            var spliceData=data.splice(3);
                            //console.log(spliceData);
                            $('#tab1').append(seckillNextCmp(spliceData));
                            new auiLazyload({
                                errorImage:'../img/errorimg.png'
                            });
                        }else {
                            $('#tab1').append(seckillNextCmp(data));

                        }
                    }else {
                        $(".no-info").show();
                        listNum=listMaxNum+1;
                    }
                    listFlag=0;
                    if (nowHourRange>thatHourRange){
                        var seckillButton=$('.go-seckill');
                        //console.log(seckillButton);
                        seckillButton.addClass('none-seckill').removeClass('go-seckill');

                    }
                }
            }
        })
    }

    //获取轮播
    function getBanner() {
        $.ajax({
            url:C.interface.seckillBanner,
            type:'get',
            dataType:'json',
            data:{
                token:C.token
            },
            success:function (response) {
                if (response.result=='success'){
                    var data=response.urls;
                    console.log(data);

                    $('#aui-slide3').html(bannerCmp(data));

                    //轮播图
                    var slide3 = new auiSlide({
                        container:document.getElementById("aui-slide3"),
                        // "width":300,
                        "height":213,
                        "speed":500,
                        "autoPlay": 3000, //自动播放
                        "loop":true,
                        "pageShow":true,
                        "pageStyle":'dot',
                        'dotPosition':'center'
                    });

                    var imgWidth=$('.bg-dark').width();
                    $('.bg-dark').find('img').css('height',imgWidth);

                }
            }
        })
    }
    
});

$(document).ready(function () {
    new auiLazyload({
        errorImage:'../img/errorimg.png'
    });
});









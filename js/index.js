$(document).ready(function () {
    var bannerTpl=$('#swiper-template').html();
    var bannerCmp=Handlebars.compile(bannerTpl);
    var seckillTpl=$('#seckill-template').html();
    var seckillCmp=Handlebars.compile(seckillTpl);
    var seckillTpl2=$('#seckill-list-template').html();
    var seckillCmp2=Handlebars.compile(seckillTpl2);

    //获取搜索模板
    var discountTpl=$('#discount-list-template').html();
    var discountCmp=Handlebars.compile(discountTpl);

    var range = 200, //距下边界长度/单位px
        totalheight = 0,

        seckillFlag=false,
        seckillOffset = 0,
        seckillLength = 5,
        totalSeckill = 0;

    var navTab=$('.tabClick');
    var tabTop=navTab.offset().top;

    // 当前时间段
    var now = new Date();
    var hour = now.getHours();
    var nowHourRange = getHourRange(hour);
    $('ul.tabClick').find('li[data-hour-range="'+nowHourRange+'"]').addClass('active');

    //获取轮播
    (function getBanner() {

        $.ajax({
            url:C.interface.seckillBanner,
            type:'get',
            dataType:'json',
            data:{
                token:C.token
            },
            success:function (response) {
                if (response.result === 'success'){
                    var data=response.urls;
                    $('#aui-slide3').html(bannerCmp(data));

                    //轮播图
                    var slide3 = new auiSlide({
                        container:document.getElementById("aui-slide3"),
                        // "width":300,
                        //"height":213,
                        "speed":500,
                        "autoPlay": 3000, //自动播放
                        "loop":true,
                        "pageShow":true,
                        "pageStyle":'dot',
                        'dotPosition':'center'
                    });

                    var imgWidth=$('.bg-dark').width();
                    var bannerWidth=Math.ceil(imgWidth/2);
                    $('.bg-dark').find('img').css('height',bannerWidth);
                    $('.aui-slide-wrap').css('height',bannerWidth);
                }
            }
        })
    })();

    //检查秒杀状态
    function checkStatus() {
        var now = new Date();
        var hour = now.getHours();
        var hourRange = getHourRange(hour);

        // 已过期的时间段
        for (var i=1; i<hourRange; i++){
            $('ul.tabClick').find('li[data-hour-range="'+i+'"]').find('div.desc').html('抢购中');
        }

        if (hourRange >= nowHourRange){
            $('.seckill').addClass('go-seckill');

            if(hourRange - nowHourRange > 0){
                $('.seckill').each(function (i, e) {
                    var renew = $(e).data('auto-renew');
                    if(Number(renew) !== 1){
                        $(e).removeClass('go-seckill');
                    }
                });
            }
        }

        setTimeout(checkStatus, 1000);
    }
    //检查秒杀状态
    checkStatus();

    $('.data-tab').bind('click',function () {

        if(nowHourRange !== $(this).data('hour-range')){
            $(this).addClass('active').siblings().removeClass('active');
            nowHourRange = $('.active').data('hour-range');
            seckillOffset = 0;

            $('#tab1').empty();
            getSeckillList(nowHourRange);
        }
    });

    //监听滚动高度，加载数据
    $(window).on('scroll',function () {

        var st=$(this).scrollTop();
        var scrollPos= $(window).scrollTop(); //滚动条距顶部距离
        totalheight = parseFloat($(window).height()) + parseFloat(scrollPos);
        if (st>=tabTop){
            navTab.addClass('tab-fiexd');
        }else {
            navTab.removeClass('tab-fiexd');
        }

        if (seckillOffset >= totalSeckill){
            return false;
        }

        if (($(document).height()-range)<=totalheight){
            getSeckillList(nowHourRange);
        }
    });

    getSeckillList(nowHourRange);
    //获取除去首页三条数据外的其他数据
    function getSeckillList(hourRange) {
        if (seckillFlag){
            return false;
        }
        $('.loading').show();
        $('.no-info').hide();
        seckillFlag=true;
        var offset = seckillOffset;
        $.ajax({
            url:C.interface.seckill,
            type:'get',
            dataType:'json',
            data:{
                hourRange:hourRange,
                token:C.token,
                start:offset,
                length:seckillLength
            },
            success:function (response) {
                seckillFlag = false;

                if (response.result === 'success'){
                    $('.loading').hide();

                    //这里转义成json对象
                    var data=response.list;
                    for (var i = 0; i < data.length; i++) {
                        data[i].productdetail = JSON.parse(data[i].productdetail);
                        var skus = data[i].skus;
                        for (var j = 0; j < skus.length; j++) {
                            skus[j].skuDetail = JSON.parse(skus[j].skuDetail);
                        }
                    }

                    totalSeckill = response['totalRecords'];
                    seckillOffset += data.length;
                    if (seckillOffset >= totalSeckill){
                        $('.no-info').show();
                    }

                    if (data.length>0){
                        var html = '';
                        if (offset === 0){
                            var topNum = data.length>3? 3: data.length;
                            var spliceData = data.splice(0, topNum);
                            html += seckillCmp(spliceData);
                        }

                        html += seckillCmp2(data);
                        $('#tab1').append(html);
                        new auiLazyload({
                            errorImage:'../images/errorimg.png'
                        });
                    }
                }
            }
        });
    }


    function getHourRange(hour) {
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
        return hourRange;
    }

    //调用商品搜索
    $('#search-product').bind('click',searchProduct);

    //取消商品搜索
    $('#clean-search').bind('click',cancelSearch);
    $('#search-input').on('input propertychange',function (event) {
        event.preventDefault();
        var inputNull=$('#search-input').val().length;
        if (inputNull == 0){
            cancelSearch();
        }
    });
    //取消搜索
    function cancelSearch() {
        event.preventDefault();
        seckillOffset = 0;
        $('#aui-slide3').show();
        $('#wrap').show();
        $('#tab1').empty();
        getSeckillList(nowHourRange);
    }

    //搜索商品
    function searchProduct(event) {
        event.preventDefault();
        searchName= $('#search-input').val();
        if (searchName == null || searchName == undefined ||searchName == ''){

        }else {
            $('#aui-slide3').hide();
            $('.tabClick').hide();
            $('#tab1').empty();

            $('.no-info').hide();
            $('.loading').show();
            $.ajax({
                url:C.interface.discount,
                type:'get',
                dataType:'json',
                data:{
                    name:searchName
                },
                success:function (response) {
                    if (response.result === 'success'){
                        $('.loading').hide();
                        var data=response.data;
                        var maxnum=data['productCount'];
                        if(maxnum == 0){
                            $(".no-info").show();
                        }else {

                            $('.tabClick').hide();
                            $('#tab1').html(discountCmp(data));
                        }
                    }
                }
            })
        }
    }



});
/**
 * Created by Administrator on 2017/8/8.
 */


    //商品类别
    var selectTpl=$('#my-select-template').html();        //获取到页面中的html代码块
    var selectCmp=Handlebars.compile(selectTpl);            //让Handlebars编译获取到的html代码

    //商品信息
    var myShopInfo=$('#my-shop-template').html();
    var myShopType=Handlebars.compile(myShopInfo);

    //我的信息
    var mineInfo=$('#mine-info-template').html();
    var mineCmp=Handlebars.compile(mineInfo);
    
    //获取商品分类
    var selectUri=C.interface.selectType;

    //ajax加载商品列表
    var categoryId='',orderType='',pageLength=5,minMaxPrice='',minMaxSales='';

    var range = 200, //距下边界长度/单位px
        maxnum = 0, //设置课程总数
        num = 0, //当前数量
        totalheight = 0,
        flag=0,
        start='0';

    //获取商品类别(全部，男装，女装)
    $.ajax({
        url:selectUri,
        type:'get',
        dataType:'json',
        data:{},
        success:function (response) {
            //如果数据请求成功
            if (response.result=='success'){
                var selectData=response.data;
                //把Handlebars编译后数据放入到页面中
                $('#my-shop-box').html(selectCmp(selectData));

                ajaxGetShopData();
                $(document).on('change','.dis-shop-type',function () {
                    $('#dis-list-vessel').empty();
                    categoryId=$(this).val();
                    console.log(categoryId);
                    num=0;
                    start = num;
                    ajaxGetShopData();
                });
                $(document).on('change','.dis-shop-sort',function () {
                    $('#dis-list-vessel').empty();
                    orderType=$(this).val();
                    console.log(orderType);
                    num=0;
                    start = num;
                    ajaxGetShopData();
                });

                /*筛选按钮的切换*/
                $('.dis-screen-btn').click(function () {
                    $(this).toggleClass('dis-screen-active');
                    $('.dis-screen').toggle();
                });

            }else if (response.result=='login'){
                alert('您还没有登录，请登录');
            }else {
                alert(response.errorMsg);
            }
        }

    });


    //监听滚动高度，加载数据
    $(window).on('scroll',function () {
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        //console.log("滚动条到顶部的垂直高度: " + $(document).scrollTop());
        //console.log("页面的文档高度 ："+$(document).height());
        //console.log('浏览器的高度：'+$(window).height());
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

        if (num>=maxnum){
            return;
        }
        if (($(document).height()-range)<=totalheight&&num<maxnum){
            //这里不能使用模板填充，应该是append()....
            ajaxGetShopData();
        }
    });

    function ajaxGetShopData() {
        if (flag){
            return;
        }
        $('.no-info').hide();
        $('.loading').show();

        flag=1;
        $.ajax({
            url:C.marketInterface.myShop,
            type:'get',
            dataType:'json',
            data:{
                categoryId:categoryId,
                orderType:orderType,
                start:start,
                length:pageLength,
                minMaxPrice:minMaxPrice,
                minMaxSales:minMaxSales,
                token:C.marketToken
            },
            success:function (response) {
                if (response.result=='success'){
                    $('.loading').hide();
                    num++;
                    var data=response.data;
                    $('#header-box').html(mineCmp(data));
                    var myShopId=data.user.id;
                    //console.log(myShopId);
                    localStorage.setItem('myShopId',myShopId);
                    maxnum=data['totalCount'];
                    start=num*pageLength;
                    if(maxnum == 0){
                        $(".no-info").show();
                    }
                   // console.log(data.products.length);
                    if (data.products.length>0){
                        $('#dis-list-vessel').append(myShopType(data));
                        new auiLazyload({
                            errorImage:'../images/error-img.png'
                        });

                    }else {
                        $(".no-info").show();
                        num=maxnum+1;
                    }
                    flag=0;

                    //删除商品的弹框
                    $('.dis-del').unbind().click(function (event) {
                        event.preventDefault();
                        var that=$(this);
                        var thatDom=that.parents('.dis-list-box');
                        var productId=that.parents('.dis-list-box').data('shopid');

                        dialog.confirm({
                            title: "确认要删除该商品吗",
                            content: "",
                            ok: function () {
                                deleteShop(thatDom,productId);
                                setTimeout(function () {
                                    dialog.tusiSuccess('删除成功');
                                }, 500);
                            },
                            cancel: function () {

                            }
                        });
                    });

                    //分享店铺
                    $('.clickshare').click(function () {
                        event.preventDefault();
                        $('.mask').show();
                        $('.my-share').show();

                        /*点击x按钮关闭店铺分享*/
                        $('.my-share-del1').click(function () {
                            $('.mask').hide();
                            $('.my-share').hide();

                        });

                        //分享二维码
                        $('.share-erweima').unbind().click(function (event) {
                            event.preventDefault();
                            $('.mask').hide();
                            $('.my-share').hide();
                            var qrcode = new QRCode(document.getElementById("share-erweima"), {
                                width : 90,
                                height : 90
                            });
                            //生成二维码
                            qrcode.makeCode(myShopId);

                            $('.myshop-share').show();
                            //alert('aaa');
                        });

                        //分享朋友圈
                        $('.share-friends').unbind().click(function (event) {
                            event.stopPropagation();
                            alert('fff');
                        })


                    });

                    //分享商品
                    $('.now-tuiguang').unbind().bind('click',nowTuiGuang);

                    /*点击立即推广*/
                    $('.close').click(function () {
                        $('#share-erweima').html('');
                        $('.myshop-share').hide();
                    });
                    /*点击x按钮关闭店铺分享*/
                    $('.my-share-del1').click(function () {
                        $('.my-share').toggle();


                    });

                }
            }
        })
    }

    //删除商品的请求
    function deleteShop(that,productId) {
        $.ajax({
            url:C.marketInterface.delMyShop,
            type:'get',
            dataType:'json',
            data:{
                productId:productId,
                token:C.marketToken
            },
            success:function (response) {
                if (response.result=='success'){
                    that.remove();
                }
            }
        });
    }



    //立即推广
    function nowTuiGuang(event) {
        event.preventDefault();
        event.stopPropagation();
        var that=$(this);
        var thisPapa=that.parents('.dis-list-box');
        var thisImg=thisPapa.find('.dis-shop-img').find('img').attr('src');
        var shareProductId=thisPapa.data('productid');
        localStorage.setItem('shareId',shareProductId);

        $('.wxmass-item-img').find('img').attr('src',thisImg);
        $('.wxmass-sends').show();

        $('.share-firends').unbind().bind('click',function (event) {
            shareFrends(event,'1');
        });

        $('.share-firends-quan').unbind().bind('click',function (event) {
            shareFrends(event,'2');
        });
    }

    //分享朋友圈
    function shareFrends(event,type) {
        event.stopPropagation();

        var productId=localStorage.getItem('shareId');
        $.ajax({
            url:C.marketInterface.shareFriend,
            type:'get',
            dataType:'json',
            data:{
                token:C.marketToken,
                productId:productId
            },
            success:function (response) {
                if (response.result=='success'){
                    //console.log(response.data);
                    var imgUrl=response.data.imgUrl;
                    var url=response.data.url;
                    var title=response.data.title;
                    var content=response.data.content;
                    var data={
                        postType:'shareProducts',
                        productId:productId,
                        type:type,
                        url:url,
                        imgUrl:String(imgUrl),
                        title:title,
                        content:content
                    };
                    console.log(data);
                    var ua = navigator.userAgent.toLowerCase();
                    if (/iphone|ipad|ipod/.test(ua)) {

                        iosShare(data);
                        event.stopPropagation();
                    } else {
                        //console.log(JSON.stringify(data));
                        androidShare(JSON.stringify(data));
                        event.stopPropagation();
                    }
                }else {
                    alert(response.errorMsg);
                }
            },
            error:function () {
                alert('服务器异常');
            }
        });

    }
    //拉取安卓分享
    function androidShare(param) {
        //alert(param);
        window.huifa.shareProducts(param);
    }
    //拉取iOS分享

    function iosShare(param) {
        window.webkit.messageHandlers.shareProducts.postMessage(param);
    }

    $('.cancel').click(function () {
        $('.wxmass-sends').hide();
    });


$(document).ready(function () {
    new auiLazyload({
        errorImage:'../images/error-img.png'
    });
});
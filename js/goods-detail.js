/**
 * Created by Administrator on 2017/8/8.
 */

$(document).ready(function () {
    var detailId=locationSearcher('productId');
    // var detailId=locationSearcher('spuId');
    // var detailId=location.search.replace('?productid=','');
    // console.log(detailId);
    //详情数据模板
    var detailTpl=$('#detail-template').html();
    var detailCmp=Handlebars.compile(detailTpl);

    //详情图片模板
    var detailImgTpl=$('#goodsdetail-con-detail').html();
    var detailImgCmp=Handlebars.compile(detailImgTpl);

    //根据商品id获取全部评价模板
    var wholeCommentTpl=$('#whole-ul').html();
    var wholeCommentCmp=Handlebars.compile(wholeCommentTpl);

    //有图评价
    var chooseImgTpl=$('#chooseimg').html();
    var chooseImgCmp=Handlebars.compile(chooseImgTpl);

    //评价中的:全部和有图
    var imgTemp=$('#imgNum').html();
    var imgTempCmp=Handlebars.compile(imgTemp);



    
    $.ajax({
        url:C.interface.detail,
        type:'POST',
        dataType:'json',
        data:{
            productId:detailId,

        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                console.log(data)

                var mainImageUrl=data.product.mainImageUrl

                var shopId=data.product.id

                //详情数据
                $('#detail-content-box').html(detailCmp(data));

                //轮播图
                var slide3 = new auiSlide({
                    container:document.getElementById("aui-slide3"),
                    // "width":300,
                    //"height":340,
                    "speed":500,
                    "autoPlay": 5000, //自动播放
                    "loop":true,
                    "pageShow":true,
                    "pageStyle":'dot',
                    'dotPosition':'center'
                });

                //点击立即推广
                $('.now-generalize').one('click',function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('.share-loading').show();
                    var that = $(this);
                    var thisImg = data.product.mainImageUrl;
                    var shareProductId = data.product.id;
                    $('.wxmass-item-img').find('img').attr('src', thisImg);
                    $.ajax({
                        url: C.marketInterface.shareFriend,
                        type: 'get',
                        dataType: 'json',
                        data: {
                            token: C.marketToken,
                            productId: shareProductId
                        },
                        success: function (response) {
                            if (response.result == 'success') {
                                //console.log(response.data);
                                var imgUrl = response.data.imgUrl;
                                var url = response.data.url;
                                var title = response.data.title;
                                var content = response.data.content;
                                $('.share-loading').hide();
                                $('.wxmass-sends').show();
                                $('.share-firends').one('click', function (event) {
                                    alert(1)
                                    getShareType(event, '1');
                                    return false

                                });
                                $('.share-firends-quan').one('click', function (event) {
                                    alert(2)
                                    getShareType(event, '2');
                                    return false
                                });

                                function getShareType(event, type) {
                                    event.preventDefault();
                                    var shareData = {
                                        postType: 'shareProducts',
                                        productId: shareProductId,
                                        type: type,
                                        url: url,
                                        imgUrl: String(imgUrl),
                                        title: title,
                                        content: content
                                    };
                                    //console.log(shareData);

                                    var ua = navigator.userAgent.toLowerCase();
                                    if (/iphone|ipad|ipod/.test(ua)) {

                                        console.log(shareData);
                                        iosShare(shareData);
                                        event.stopPropagation();
                                    } else {
                                        //console.log(JSON.stringify(data));
                                        androidShare(JSON.stringify(shareData));
                                        event.stopPropagation();
                                    }
                                }

                            }
                        },
                        error: function () {
                            alert('服务器异常');
                        }
                    });
                });
                //取消分享弹框
                $('.cancel').click(function () {
                    $('.wxmass-sends').hide();
                });

                //详情图片
                $('.goodsdetail-con-detail').html(detailImgCmp(data));

                //处理详情页面的图片尺寸按比例缩放问题
                var imgWidth=$('.bg-dark').width();
                // console.log(imgWidth);
                $('.aui-slide-wrap').css('height',imgWidth);
                $('.bg-dark').find('img').css('height',imgWidth);

            }else if (response.result == 'login') {
                alert('您还没有登录，请登录');
            } else {
                alert(response.errorMsg);
            }
        }
    });

    //根据商品id获取全部评价
    $.ajax({
        url:C.interface.detailComment,
        type:'POST',
        dataType:'json',
        data:{
            productId:detailId
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                $('.whole').html(wholeCommentCmp(data))
                //评价中的:全部和有图
                $('.goodsdetail-con-whole').html(imgTempCmp(data))

            }else if (response.result == 'login') {
                alert('您还没有登录，请登录');
            } else {
                alert(response.errorMsg);
            }
        }
    });

    //根据商品id获取有图评价
    $.ajax({
        url:C.interface.detailComment,
        type:'POST',
        dataType:'json',
        data:{
            productId:detailId,
            isHaveImg:'1',
            a:'b'
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                $('.chooseimg').html(chooseImgCmp(data))
            }else if (response.result == 'login') {
                alert('您还没有登录，请登录');
            } else {
                alert(response.errorMsg);
            }
        }
    });



/*    //立即推广
    function nowTuiGuang(event) {
        event.preventDefault();
        event.stopPropagation();
        $('.share-loading').show();

        var that = $(this);
        // var thisPapa = that.parents('.dis-list-box');
        var thisImg = data.product.mainImageUrl;
        var shareProductId = data.product.id
        // console.log(shareProductId);

        //localStorage.setItem('shareId', shareProductId);

        $('.wxmass-item-img').find('img').attr('src', thisImg);


        $.ajax({
            url: C.marketInterface.shareFriend,
            type: 'get',
            dataType: 'json',
            data: {
                token: C.marketToken,
                productId: shareProductId
            },
            success: function (response) {
                if (response.result == 'success') {
                    //console.log(response.data);
                    var imgUrl = response.data.imgUrl;
                    var url = response.data.url;
                    var title = response.data.title;
                    var content = response.data.content;

                    $('.share-loading').hide();
                    $('.wxmass-sends').show();


                    $('.share-firends').one('click', function (event) {
                        getShareType(event, '1');

                    });
                    $('.share-firends-quan').one('click', function (event) {
                        getShareType(event, '2');
                    });

                    function getShareType(event, type) {
                        event.preventDefault();
                        var shareData = {
                            postType: 'shareProducts',
                            productId: shareProductId,
                            type: type,
                            url: url,
                            imgUrl: String(imgUrl),
                            title: title,
                            content: content
                        };
                        //console.log(shareData);

                        var ua = navigator.userAgent.toLowerCase();
                        if (/iphone|ipad|ipod/.test(ua)) {

                            console.log(shareData);
                            iosShare(shareData);
                            event.stopPropagation();
                        } else {
                            //console.log(JSON.stringify(data));
                            androidShare(JSON.stringify(shareData));
                            event.stopPropagation();
                        }
                    }

                }
            },
            error: function () {
                alert('服务器异常');
            }
        });
    }*/

    //拉取安卓分享
    function androidShare(param) {
        alert(param);
        window.huifa.shareProducts(param);
    }

    //拉取iOS分享

    function iosShare(param) {
        window.webkit.messageHandlers.shareProducts.postMessage(param);
    }

});








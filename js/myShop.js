/**
 * Created by Administrator on 2017/8/8.
 */


    //商品类别
var selectTpl = $('#my-select-template').html();        //获取到页面中的html代码块
var selectCmp = Handlebars.compile(selectTpl);            //让Handlebars编译获取到的html代码

//商品信息
var myShopInfo = $('#my-shop-template').html();
var myShopType = Handlebars.compile(myShopInfo);

//我的信息
var mineInfo = $('#mine-info-template').html();
var mineCmp = Handlebars.compile(mineInfo);

//获取商品分类
var selectUri = C.interface.selectType;

//ajax加载商品列表
var categoryId = '', orderType = '', pageLength = 5, minMaxPrice = '', minMaxSales = '';

var range = 200, //距下边界长度/单位px
    maxnum = 0, //设置课程总数
    num = 0, //当前数量
    totalheight = 0,
    flag = 0,
    start = '0';

//获取商品类别(全部，男装，女装)
$.ajax({
    url: selectUri,
    type: 'get',
    dataType: 'json',
    data: {},
    success: function (response) {
        //如果数据请求成功
        if (response.result == 'success') {
            var selectData = response.data;
            //把Handlebars编译后数据放入到页面中
            $('#my-shop-box').html(selectCmp(selectData));

            ajaxGetShopData();
            $(document).on('change', '.dis-shop-type', function () {
                $('#dis-list-vessel').empty();
                categoryId = $(this).val();
                // console.log(categoryId);
                num = 0;
                start = num;
                ajaxGetShopData();
            });
            $(document).on('change', '.dis-shop-sort', function () {
                $('#dis-list-vessel').empty();
                orderType = $(this).val();
                console.log(orderType);
                num = 0;
                start = num;
                ajaxGetShopData();
            });

            /*筛选按钮的切换*/
            $('.dis-screen-btn').click(function () {
                $(this).toggleClass('dis-screen-active');
                $('.dis-screen').toggle();
            });

        } else if (response.result == 'login') {
            alert('您还没有登录，请登录');
        } else {
            alert(response.errorMsg);
        }
    }

});


//监听滚动高度，加载数据
$(window).on('scroll', function () {
    var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
    //console.log("滚动条到顶部的垂直高度: " + $(document).scrollTop());
    //console.log("页面的文档高度 ："+$(document).height());
    //console.log('浏览器的高度：'+$(window).height());
    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

    if (num >= maxnum) {
        return;
    }
    if (($(document).height() - range) <= totalheight && num < maxnum) {
        //这里不能使用模板填充，应该是append()....
        ajaxGetShopData();
    }
});

function ajaxGetShopData() {
    if (flag) {
        return;
    }
    $('.no-info').hide();
    $('.loading').show();

    flag = 1;
    $.ajax({
        //C.marketInterface
        url: C.marketInterface.myShop,
        type: 'get',
        dataType: 'json',
        data: {
            categoryId: categoryId,
            orderType: orderType,
            start: start,
            length: pageLength,
            minMaxPrice: minMaxPrice,
            minMaxSales: minMaxSales,
            token: C.marketToken
        },
        success: function (response) {
            if (response.result == 'success') {
                $('.loading').hide();
                num++;
                var data = response.data;
                $('#header-box').html(mineCmp(data));
                var myShopId = data.user.id;
                //console.log(myShopId);
                localStorage.setItem('myShopId', myShopId);
                maxnum = data['totalCount'];
                start = num * pageLength;
                if (maxnum == 0) {
                    $(".no-info").show();
                }
                // console.log(data.products.length);
                if (data.products.length > 0) {
                    $('#dis-list-vessel').append(myShopType(data));
                    new auiLazyload({
                        errorImage: '../images/error-img.png'
                    });

                } else {
                    $(".no-info").show();
                    num = maxnum + 1;
                }
                flag = 0;

                //删除商品的弹框
                $('.dis-del').unbind().click(function (event) {
                    event.preventDefault();
                    var that = $(this);
                    var thatDom = that.parents('.dis-list-box');
                    var productId = that.parents('.dis-list-box').data('shopid');

                    dialog.confirm({
                        title: "确认要删除该商品吗",
                        content: "",
                        ok: function () {
                            deleteShop(thatDom, productId);
                            setTimeout(function () {
                                dialog.tusiSuccess('删除成功');
                            }, 500);
                        },
                        cancel: function () {

                        }
                    });
                });


                /*     //分享店铺
                     $('.clickshare').click(function () {
                         event.preventDefault();
                         $('.mask').show();
                         $('.my-share').show();

                         /!*点击x按钮关闭店铺分享*!/
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
                         })


                     });*/

                
                //分享店铺
                $('.clickshare').unbind().bind('click', shopShare);


                //立即分享
                $('.now-tuiguang').unbind().bind('click', nowTuiGuang);

                /*点击立即分享*/
                $('.close').click(function () {
                    $('#share-erweima').html('');
                    $('.myshop-share').hide();
                });
                /*点击x按钮关闭店铺分享*/
                $('.my-share-del1').click(function () {
                    $('.my-share').toggle();
                });

            }else if(response.result === 'login'){
                alert('登入过期，请重新登入！');
                againLogin();
            }else {
                alert(response.errorMsg);
            }
        }
    })
}

//删除商品的请求
function deleteShop(that, productId) {
    $.ajax({
        url: C.marketInterface.delMyShop,
        type: 'get',
        dataType: 'json',
        data: {
            productId: productId,
            token: C.marketToken
        },
        success: function (response) {
            if (response.result == 'success') {
                that.remove();
            }else if (response.result === 'login'){
                alert('登入过期，请重新登入！');
                againLogin();
            }else {
                alert(response.errorMsg);
            }
        }
    });
}

//立即分享
function nowTuiGuang(event) {
    //默认行为
    event.preventDefault();
    //阻止冒泡
    event.stopPropagation();

    var loading=dialog.loading();


    var that = $(this);
    //找到(祖先)元素dis-list-box
    var thisPapa = that.parents('.dis-list-box');
    //获取图片的src属性值
    var thisImg = thisPapa.find('.dis-shop-img').find('img').attr('src');
    //给每一个商品信息添加一个productid唯一的id值
    var shareProductId = thisPapa.data('productid');
    //设置localStorage   key:shareId   value:shareProductId
    localStorage.setItem('shareId', shareProductId);
    //点开立即分享之后的商品图src
    $('.wxmass-item-img').find('img').attr('src', thisImg);
    // 获取到localStorage
    var productId = localStorage.getItem('shareId');
    $.ajax({
        url: C.marketInterface.shareFriend,
        type: 'get',
        dataType: 'json',
        data: {
            token: C.marketToken,
            productId: productId
        },
        complete: function() {
            loading.close();
        },
        success: function (response) {
            if (response.result == 'success') {
                //获取到图片标识ulr
                var imgUrl = response.data.imgUrl;
                // 获取url
                var url = response.data.url;
                //获取标题
                var title = response.data.title;
                //获取主体内容
                var content = response.data.content;


                //点击立即分享就显示这个层
                $('.wxmass-sends').show();

                //点击分享--发送给朋友
                $('.share-firends').unbind().bind('click', function (event) {
                    getShareType(event, '1');
                });
                //点击分享--分享到朋友圈
                $('.share-firends-quan').unbind().bind('click', function (event) {
                    getShareType(event, '2');
                });
                $('.share-QQ').bind('click',function (event) {
                    getShareType(event, '3');
                });
                $('.share-weibo').bind('click',function (event) {
                    getShareType('event','4');
                });

                function getShareType(event, type) {
                    var data = {
                        postType: 'shareProducts',
                        productId: productId,
                        type: type,
                        url: url,
                        imgUrl: String(imgUrl),
                        title: title,
                        content: content
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

                }
            } else if (response.result === 'login'){
                alert('登入过期，请重新登入！');
                againLogin();
            }else {
                alert(response.errorMsg);
            }
        },
        error: function () {
            //alert('服务器异常');
        }
    });



}

//店铺分享
function shopShare(event) {
    event.preventDefault();
    $('.mask').show();
    //显示分享层面
    $('.my-share').show();

    /*点击x按钮关闭店铺分享*/
    $('.my-share-del1').click(function () {
        $('.mask').hide();
        $('.my-share').hide();
    });


    //点击分享--分享到朋友圈
    $('.share-friends').unbind().bind('click', function (event) {
        shareFrendsTwo(event, '2');
    });
    //点击分享--复制链接
    $('.share-url').unbind().bind('click', function (event) {
        //alert('点击复制链接');
        copyurl();
    });


    //分享二维码
    $('.share-erweima').unbind().click(function (event) {
        event.preventDefault();
        $('.mask').hide();
        $('.my-share').hide();
        var qrcode = new QRCode(document.getElementById("share-erweima"), {
            width: 90,
            height: 90
        });
        //生成二维码
        qrcode.makeCode(myShopId);

        $('.myshop-share').show();
    });

}


//   发送给朋友222 / 分享到朋友圈222
function shareFrendsTwo(event, type) {
    event.stopPropagation();
    var data='';

    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        iosShareTwo(data);
        event.stopPropagation();
    } else {
        //console.log(JSON.stringify(data));
        androidShareTwo(JSON.stringify(data));
        event.stopPropagation();
    }
}


function copyurl() {
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        iosCopyUrl();
        event.stopPropagation();
    } else {
        //console.log(JSON.stringify(data));
        androidCopyUrl();
        event.stopPropagation();
    }

}

// 立即分享拉取安卓分享
function androidShare(param) {
    //alert(param);
    window.huifa.shareProducts(param);
}

//立即分享拉取iOS分享
function iosShare(param) {
    window.webkit.messageHandlers.shareProducts.postMessage(param);
}

//店铺分享拉取安卓分享
function androidShareTwo(param) {
    //alert(param);
    window.huifa.shopShare(param);
}

//店铺分享拉取iOS分享
function iosShareTwo(param) {
    window.webkit.messageHandlers.shopShare.postMessage(param);
}

//店铺分享拉取安卓复制链接
function androidCopyUrl() {
    //alert(param);
    window.huifa.copyUrlWay();
}

//店铺分享拉取iOS复制链接
function iosCopyUrl() {
    window.webkit.messageHandlers.copyUrlWay.postMessage(null);
}



//删除商品
$('.cancel').click(function () {
    $('.wxmass-sends').hide();
});

//图片懒加载
$(document).ready(function () {
    new auiLazyload({
        errorImage: '../images/error-img.png'
    });
});


//点击确定筛选
$(document).on('click', '#nmbConfirm', function () {
    getScreen()
});

//商品筛选
function getScreen() {
    //当前筛选菜单栏
//        $('.all-mask').show();

//        全部
    var shopType = $('.dis-shop-type').val();
//        默认排序
    var shopSales = $('.dis-shop-sort').val();
//          最低价
    var lowPrice = $('.dis-low-price').val();
//          最高价
    var highPrice = $('.dis-high-price').val();
//         最低销量
    var lowSales = $('.dis-low-sales').val();
//        最高销量
    var highSales = $('.dis-high-sales').val();

//        最低价-最高价
    var minMaxPrice = lowPrice + '-' + highPrice;
//        最低销量-最高销量
    var minMaxSales = lowSales + '-' + highSales;
//        定义一个变量
    var servenBack = null;
    console.log(minMaxPrice);
    console.log(minMaxSales);
//      退货免运费选项是否选中
    if ($('.servenBack').is(':checked')) {
        servenBack = 1;
    } else {
        servenBack = 0;
    }
//        如果 最低价-最高价  最低销量-最高销量  =空
    if (lowPrice == '' && highPrice == '' && lowSales == '' && highSales == '') {
        alert('没有填写筛选数据');
//            $('.dis-screen-btn').removeClass('dis-screen-active');
//            $('.dis-screen').hide();
        return false;
    }
//最低价不能大于最高价
    if (lowPrice > highPrice) {
        alert('最低价不能大于最高价');
        return false;
    }
    //最低销量不能大于最高销量
    if (lowSales > highSales) {
        alert('最低销量不能大于最高销量');
        return false;
    }

    $.ajax({
        url: C.interface.discount,
        dataType: 'json',
        type: 'POST',
        data: {
            minMaxPrice: minMaxPrice,
            minMaxSales: minMaxSales,
        },
        success: function (response) {
            console.log(response);
            if (response.result == 'success') {
                //console.log(response.data);
                var data = response.data;
                $('#dis-list-vessel').empty();
                $('#dis-list-vessel').html(myShopType(data));
                $('.dis-low-price').val('');
                $('.dis-high-price').val('');
                $('.dis-low-sales').val('');
                $('.dis-high-sales').val('');
                $('.all-mask').hide();
                $('.dis-screen').hide();
                $('.dis-screen-btn').removeClass('dis-screen-active');

                new auiLazyload({
                    errorImage: '../image/error-img.png'
                });
            } else {
                alert(response.errorMsg);
            }
        }
    });
}
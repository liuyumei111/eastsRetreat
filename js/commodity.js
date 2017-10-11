
/**
 * Created by Administrator on 2017/7/26.
 */

//商品信息
var shoptpl=$('#discount-list-template').html();
var shopTemplate=Handlebars.compile(shoptpl);
//筛选(全部)
var selectTpl=$('#select-template').html();
var selectCmp=Handlebars.compile(selectTpl);

//后台获取的首页数据(ajax请求地址)
var uri=C.interface.discount;
//后台获取的首页数据(获取商品分类)
var selectUri=C.interface.selectType;

//ajax加载商品列表(分页)
var categoryId='',orderType='',pageLength=5,minMaxPrice='',minMaxSales='';

var range = 200, //距下边界长度/单位px
    maxnum = 0, //设置总数
    num = 0, //当前数量
    totalheight = 0,
    flag=0,
    start='0',
    searchName='';

//获取商品类别(全部，男装，女装,饮料，家电)
$.ajax({
    url:selectUri,
    type:'get',
    dataType:'json',
    data:{},
    success:function (response) {
        if (response.result=='success'){
            //商品类别(全部，男装，女装,饮料，家电)
            var selectData=response.data;
            //console.log(selectData);
            //handlebars渲染数据
            $('#dis-select-box').html(selectCmp(selectData));
            //加载商品数据
            ajaxGetShopData();
            //点击全部，可以选择商品类别
            $(document).on('change','.dis-shop-type',function () {
                //清空整个列表的数据
                $('#dis-list-vessel').empty();
                //
                categoryId=$(this).val();
                console.log(categoryId);
                num=0;
                start = num;
                //加载商品数据
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
            againLogin();
        }else {
            alert(response.errorMsg);
        }
    }

});

//搜索
$(document).on('click','.aui-text-info',function () {
    searchName=$('#search-input').val();
    if (searchName==''){
        return false;
    }
    $('#dis-select-box').hide();
    $('#dis-list-vessel').empty();
    num=0;
    start = num;
    ajaxGetShopData();
});
//删除文本之后请求数据。
$(document).on('click','#clean-search',function () {
    $('#dis-select-box').show();
    $('#dis-list-vessel').empty();
    searchName='';
    num=0;
    start = num;
    ajaxGetShopData();
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

//加载商品数据
function ajaxGetShopData() {
    //如果条件不成立直接不执行
    if (flag){
        return;
    }
    //条件成立
    //显示加载更多
    $(".no-info").hide();
    $('.loading').show();
    flag=1;
    $.ajax({
        url:uri,
        type:'get',
        dataType:'json',
        data:{
            categoryId:categoryId,
            orderType:orderType,
            start:start,
            length:pageLength,
            minMaxPrice:minMaxPrice,
            minMaxSales:minMaxSales,
            name:searchName
        },
        success:function (response) {
            if (response.result=='success'){
                //显示加载隐藏
                $('.loading').hide();
                //每次都加1
                num++;
                //请求回来的数据
                var data=response.data;
                //console.log(data);
                //商品的总数
                maxnum=data['productCount'];
                //因为数据库采用的是行偏移量，所以这里需要num*pageLength
                start=num*pageLength;
                //当上平的总数等于0的时候显示没有更多信息了...
                if(maxnum == 0){
                    $(".no-info").show();
                }
                //如果请求回来的数据条数大于0，在数据后插入新新数据，不覆盖旧数据;否则就显示没有更多信息了
                if (data.products.length>0){
                    $('#dis-list-vessel').append(shopTemplate(data));
                }else {
                    $(".no-info").show();
                    num=maxnum+1;
                }
                flag=0;

                //这里添加立即分享事件
                $('.now-tuiguang').unbind().bind('click',nowTuiGuang);
                //取消分享弹框
                $('.cancel').click(function () {
                    $('.wxmass-sends').hide();
                });
            }else if (response.result === 'login'){
                alert('登入过期，请重新登入！');
                againLogin();
            }
        },
        error:function () {
            //alert('服务器异常');
        }
    })
}




//立即分享
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
            }
        },
        error:function () {
            //alert('服务器异常');
        }
    });

}


//拉取安卓分享
function androidShare(param) {
    alert(param);
    window.huifa.shareProducts(param);
}
//拉取iOS分享

function iosShare(param) {
    window.webkit.messageHandlers.shareProducts.postMessage(param);
}


//筛选
$('#nmbConfirm').on('click',function () {
    alert("1111111111")
    getScreen();
});
$('.all-mask').bind('click',function () {
    $('.dis-screen-price').hide();
});





//商品筛选
function getScreen() {

    $('.all-mask').show();
    var shopType=$('.dis-shop-type').val();
    var shopSales=$('.dis-shop-sort').val();
    var lowPrice=$('.dis-low-price').val();
    var highPrice=$('.dis-high-price').val();
    var lowSales=$('.dis-low-sales').val();
    var highSales=$('.dis-high-sales').val();
    var minMaxPrice=lowPrice+'-'+highPrice;
    var minMaxSales=lowSales+'-'+highSales;
    var servenBack=null;
    if ($('.servenBack').is(':checked')){
        servenBack=1;
    }else {
        servenBack=0;
    }
    if (lowPrice==''&&highPrice==''&&lowSales==''&&highSales==''){
        $('.all-mask').hide();
        $('.dis-screen-btn').removeClass('dis-screen-active');
        $('.dis-screen').hide();
        return false;
    }
    if (lowPrice>highPrice||lowSales>highSales){
        alert('输入的区间有误');
        return false;
    }
    $.ajax({
        url:uri,
        dataType:'json',
        type:'get',
        data:{
            categoryId:shopType,
            orderType:shopSales,
            minMaxPrice:minMaxPrice,
            minMaxSales:minMaxSales,
            isServenBack:servenBack
        },
        success:function (response) {
            if (response.result=='success'){
                //console.log(response.data);
                var data=response.data;
                $('#dis-list-vessel').append(shopTemplate(data));
                $('.dis-low-price').val('');
                $('.dis-high-price').val('');
                $('.dis-low-sales').val('');
                $('.dis-high-sales').val('');
                $('.all-mask').hide();
                $('.dis-screen').hide();
                $('.dis-screen-btn').removeClass('dis-screen-active');

                new auiLazyload({
                    errorImage:'../image/error-img.png'
                });
            }else {
                alert(response.errorMsg);
            }
        }
    });
}





//
Handlebars.registerHelper('hongbao',function (sales) {
    if (sales==null){
        return null;
    }else {
        return sales;
    }
});
//包邮不包邮
Handlebars.registerHelper('exemption',function (value) {
    if (value=='001'){
        return '退货免邮费';
    }else if (value=='002'){
        return '退货不包邮';
    }
});



$(document).ready(function () {
    new auiLazyload({
        errorImage:'../images/error-img.png'
    });
});











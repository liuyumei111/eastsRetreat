/**
 * Created by Administrator on 2017/8/17.
 */
/**
 * Created by Administrator on 2017/7/26.
 */


//商品信息
var shoptpl=$('#discount-list-template').html();
var shopTemplate=Handlebars.compile(shoptpl);
//商品类别
var selectTpl=$('#select-template').html();
var selectCmp=Handlebars.compile(selectTpl);

//首页数据
var uri=C.interface.discount;
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
        if (response.result=='success'){
            var selectData=response.data;
            $('#dis-select-box').html(selectCmp(selectData));

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
            minMaxSales:minMaxSales
        },
        success:function (response) {
            if (response.result=='success'){

                $('.loading').hide();
                num++;
                var data=response.data;
                maxnum=data['productCount'];
                start=num*pageLength;
                if(maxnum == 0){
                    $(".no-info").show();
                }

                //console.log(data);

                console.log(data.products.length);
                if (data.products.length>0){
                    $('#dis-list-vessel').append(shopTemplate(data));
                }else {
                    $(".no-info").show();
                    num=maxnum+1;
                }
                flag=0;
            }
        }
    })
}

//$(document).on('change','.dis-shop-type',getShopSelected);
//$(document).on('change','.dis-shop-sort',getShopSort);
$(document).on('click','#nmbConfirm',getScreen);
$('.all-mask').bind('click',function () {
    $('.dis-screen-price').hide();
});
//商品分类
function getShopSelected() {
    var thisValue=$(this).val();
    //获取当前类别下的商品信息
    $.ajax({
        url:uri,
        dataType:'json',
        type:'get',
        data:{
            categoryId:thisValue
        },
        success:function (response) {
            if (response.result=='success'){
                console.log(response.data);
                var data=response.data;
                $('#dis-list-vessel').html(shopTemplate(data));
                /*new auiLazyload({
                 errorImage:'img/error-img.png'
                 });*/

            }else {
                console.log(response.errorCode);
            }
        }
    });
}
//商品排序
function getShopSort() {
    var shopType=$('.dis-shop-type').val();
    console.log(shopType);
    var thisValue=$(this).val();
    console.log(thisValue);
    //获取当前类别下的商品信息
    $.ajax({
        url:uri,
        dataType:'json',
        type:'get',
        data:{
            categoryId:shopType,
            orderType:thisValue
        },
        success:function (response) {
            if (response.result=='success'){
                console.log(response.data);

                var data=response.data;
                $('#dis-list-vessel').html(shopTemplate(data));
                /*new auiLazyload({
                 errorImage:'img/error-img.png'
                 });*/

            }else {
                console.log(response.errorCode);
            }
        }
    });
}

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

new auiLazyload({
    errorImage:'../image/error-img.png'
});

$(document).ready(function () {

});











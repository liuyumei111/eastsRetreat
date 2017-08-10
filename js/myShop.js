/**
 * Created by Administrator on 2017/8/8.
 */

$(document).ready(function () {

    //商品类别
    var selectTpl=$('#my-select-template').html();
    var selectCmp=Handlebars.compile(selectTpl);

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
            if (response.result=='success'){
                var selectData=response.data;
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
                    maxnum=data['productCount'];
                    start=num*pageLength;
                    if(maxnum == 0){
                        $(".no-info").show();
                    }
                   // console.log(data.products.length);
                    if (data.products.length>0){
                        $('#dis-list-vessel').append(myShopType(data));
                        $('#header-box').html(mineCmp(data))
                    }else {
                        $(".no-info").show();
                        num=maxnum+1;
                    }
                    flag=0;
                }
            }
        })
    }



});
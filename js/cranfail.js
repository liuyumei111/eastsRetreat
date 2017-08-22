/**
 * Created by Administrator on 2017/8/19.
 */

$(document).ready(function () {
    /*筛选按钮的切换*/
    $('.dis-screen-btn').click(function () {
        $('.dis-screen').toggle();
    });
    /*分享店铺*/
    $('.clickshare').click(function () {
        $('.my-share').toggle();
    });
    /*点击x按钮关闭店铺分享*/
    $('.my-share-del1').click(function () {
        $('.my-share').toggle();
    });

    var a = $('#tranfail-template').html();
    var b = Handlebars.compile(a);

    var range = 200, //距下边界长度/单位px
        maxnum = 0, //设置课程总数
        num = 0, //当前数量
        totalheight = 0,
        flag=0,
        start=0,
        pageLength=5;

    getSellInfo(0);


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
            getSellInfo(0);
        }
    });

    function getSellInfo(type) {
        if (flag){
            return;
        }
        $('.loading').show();
        flag=1;
        $.ajax({
            url:C.marketInterface.orderList,
            type:'get',
            dataType:'json',
            data:{
                token:C.marketToken,
                start:start,
                length:pageLength,
                orderType:type

            },
            success:function (response) {
                if (response.result=='success'){

                    $('.loading').hide();
                    num++;
                    var data=response.data;
                    maxnum=data['totalCount'];
                    start=num*pageLength;
                    if(maxnum == 0){
                        $(".no-info").show();
                    }

                    //console.log(data);

                    //console.log(data.products.length);
                    if (data.products.length>0){
                        $('#dis-list-vessel').append(b(data));
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
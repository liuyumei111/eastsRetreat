/**
 * Created by Administrator on 2017/8/8.
 */

$(document).ready(function () {
    var detailId=locationSearcher('productId');
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

    
    $.ajax({
        url:C.interface.detail,
        type:'POST',
        dataType:'json',
        data:{
            productId:detailId
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                console.log(data);

                //详情数据
                $('#detail-content-box').html(detailCmp(data));

                //轮播图
                var slide3 = new auiSlide({
                    container:document.getElementById("aui-slide3"),
                    // "width":300,
                    "height":340,
                    "speed":500,
                    "autoPlay": 5000, //自动播放
                    "loop":true,
                    "pageShow":true,
                    "pageStyle":'dot',
                    'dotPosition':'center'
                });

                //详情图片
                $('.goodsdetail-con-detail').html(detailImgCmp(data))

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
                console.log(data);
                $('.whole').html(wholeCommentCmp(data))

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
            isHaveImg:'1'
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                console.log(data);
                $('.chooseimg').html(chooseImgCmp(data))

            }else if (response.result == 'login') {
                alert('您还没有登录，请登录');
            } else {
                alert(response.errorMsg);
            }
        }
    });
    
   




});








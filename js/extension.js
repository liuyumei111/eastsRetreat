/**
 * Created by Administrator on 2017/8/17.
 */

$(document).ready(function () {

    var scrollTpl=$('#page-template').html();
    var scrollCmp=Handlebars.compile(scrollTpl);

    $.ajax({
        url:C.marketInterface.promotionCenter,
        type:'get',
        dataType:'json',
        data:{

        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                $('#page-box').html(scrollCmp(data));


                //无缝滚动
                $('.scroll-list li:even').addClass('lieven');
                $(function(){
                    $(".scroll-list").myScroll({
                        speed:40, //数值越大，速度越慢
                        rowHeight:40 //li的高度
                    });
                });
                //轮播图
                var slide3 = new auiSlide({
                    container:document.getElementById("aui-slide3"),
                    // "width":300,
                    "height":184,
                    "speed":500,
                    "autoPlay": 5000, //自动播放
                    "loop":true,
                    "pageShow":true,
                    "pageStyle":'dot',
                    'dotPosition':'center'
                });
                //点击平台公告

                $(document).on('click','.my-notice-li',jumpDetail);

            }
        },
        error:function () {
            alert('服务器异常');
        }
    });

    //平台公告跳转
    function jumpDetail() {
        var id = $(this).data('noticeid');
        location.href = 'notice.html?id=' + id;
    }


    
    
});
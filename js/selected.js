/**
 * Created by Administrator on 2017/8/7.
 */

    $(document).ready(function () {


        var num=0,pageLength=5,flag=0,maxnum=0,range=200,start=0;

        var oneProductTpl=$('#one-product').html();
        var oneProductCmp=Handlebars.compile(oneProductTpl);

        ajaxgetData();
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
                ajaxgetData();
            }
        });

        function ajaxgetData() {
            if (flag){
                return;
            }
            $('.no-info').hide();
            $('.loading').show();
            flag=1;
            $.ajax({
                url:C.interface.discount,
                type:'get',
                dataType:'json',
                data:{
                    start:start,
                    length:pageLength
                },
                success:function (response) {
                    if (response.result=='success'){
                        $('.loading').hide();
                        num++;
                        var data=response.data;
                        maxnum=data['productCount'];
                        start=num*pageLength;
                        if (maxnum==0){
                            $('.no-info').show();
                        }
                        if (data.products.length>0){
                            $('#dis-list-vessel').append(oneProductCmp(data));

                            //这里添加立即推广事件
                            $(document).on('click','.dis-sale',nowTuiGuang);

                        }else {
                            $('.no-info').show();
                            num=maxnum+1;
                        }
                        flag=0;

                    }else {
                        alert(response.errorMsg);
                    }
                }
            })
        }

        //立即推广
        function nowTuiGuang() {
            var that=$(this);
            var thisPapa=that.parents('.dis-list-box');
            var thisImg=thisPapa.find('.dis-shop-img').find('img').attr('src');

            $('.wxmass-item-img').find('img').attr('src',thisImg);
            $('.wxmass-sends').show();

        }


        





    });





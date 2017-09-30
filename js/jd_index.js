/**
 * Created by Administrator on 2017/9/29.
 */

$(document).ready(function () {
    //商品信息
    var shoptpl=$('#discount-list-template').html();
    var shopTemplate=Handlebars.compile(shoptpl);

    //ajax加载商品列表
    var range = 200, //距下边界长度/单位px
        maxnum = 0, //设置课程总数
        num = 0, //当前数量
        totalheight = 0,
        flag=0,
        start=0,
        pageLength=20,
        keyword='';

    ajaxGetShopData();

    //监听滚动高度，加载数据
    $(window).on('scroll',function () {
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        //console.log("滚动条到顶部的垂直高度: " + $(document).scrollTop());
        //console.log("页面的文档高度 ："+$(document).height());
        //console.log('浏览器的高度：'+$(window).height());
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

        /*if (num>=maxnum){
         return;
         }*/
        if (($(document).height()-range)<=totalheight&&num<maxnum){
            /*&&num<maxnum*/
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
            url:C.marketInterface.jdShop,
            type:'get',
            dataType:'json',
            data:{
                token:C.marketToken,
                start:start,
                length:pageLength,
                keyword:keyword
            },
            success:function (response) {
                if (response.result=='success'){

                    $('.loading').hide();
                    num++;
                    var data=response.data;
                    maxnum=data.list.length;
                    start=num*pageLength;
                    if(maxnum == 0){
                        $(".no-info").show();
                    }

                    //console.log(data.list.length);
                    if (data.list.length>0){
                        $('#dis-list-vessel').append(shopTemplate(data));
                        new auiLazyload({
                            errorImage:'../image/errorimg.png'
                        });

                        $('.dis-share').bind('click',getShare);
                    }else {
                        $(".no-info").show();
                        num=maxnum+1;
                    }
                    flag=0;
                }else if (response.result === 'login'){
                    alert('登录过期请重新登录');
                    againLogin();

                }else {
                    alert(response.errorMsg);
                }
            },
            error:function () {
                alert('服务器异常');
            }
        });
    }


    // $(document).on('click','#nmbConfirm',getScreen);
    $('.all-mask').bind('click',function () {
        $('.dis-screen-price').hide();
    });


    //搜索数据
    $('.aui-searchbar-btn').bind('click',jdSearch);
    //取消搜索
    $('#clean-search').bind('click',cancelSearch);

    function jdSearch() {

        keyword = $('#search-input').val();
        if (keyword == '' ){
            return false;
        }else {
            $('#dis-select-box').hide();
            $('#dis-list-vessel').empty();
            num = start = 0;
            ajaxGetShopData();
        }

    }

    function cancelSearch() {
        $('.no-info').hide();
        $('#dis-select-box').show();
        $('#dis-list-vessel').empty();
        keyword = '';
        num = start = 0;
        ajaxGetShopData();
    }

    
    function getShare() {
        event.preventDefault();
        var that = $(this);
        var id = that.data('id');
        var loading = dialog.loading();
        $.ajax({
            url:C.marketInterface.homeJDShare,
            type:'get',
            dataType:'json',
            data:{
                id:id,
                token:C.marketToken
            },
            complete:function () {
                loading.close();
            },
            success:function (response) {
                if(response.result === 'success'){
                    var data = response.data;
                    console.log(data);
                    $('.wxmass-sends').show();
                    var title = data.title;
                    var content = data.content;
                    var url = data.url;

                    $('.share-firends').bind('click', function (event) {
                        pullProtoShare(event,'1');
                    });

                    $('.share-firends-quan').bind('click', function (event) {
                        pullProtoShare(event,'2');
                    });
                    //取消分享弹框
                    $('.cancel').click(function () {
                        $('.wxmass-sends').hide();
                    });

                    function pullProtoShare(event,type) {

                        var shareDate = {
                            postType:'shareProducts',
                            type:type,
                            title:title,
                            content:content,
                            productId:id,
                            imgUrl:'',
                            url:url


                        };

                        var ua = navigator.userAgent.toLowerCase();
                        if (/iphone|ipad|ipod/.test(ua)) {
                            iosShare(shareDate);
                            event.stopPropagation();
                        } else {
                            androidShare(JSON.stringify(shareDate));
                            event.stopPropagation();
                        }
                    }

                }
            }

        })
    }



    //拉取安卓分享
    function androidShare(param) {
        window.huifa.shareProducts(param);
    }

    //拉取iOS分享

    function iosShare(param) {
        window.webkit.messageHandlers.shareProducts.postMessage(param);
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

});


$(document).ready(function () {
    new auiLazyload({
        errorImage:'../image/errorimg.png'
    });
});

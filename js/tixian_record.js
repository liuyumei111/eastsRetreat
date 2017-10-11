/**
 * Created by Administrator on 2017/10/11.
 */
$(document).ready(function () {

    var tpl = $('#tixian-record-template').html();
    var cmp = Handlebars.compile(tpl);

    var totalheight = 0,
        range = 200,
        num = 0,
        start = 0,
        length = 11,
        maxNum = 0,
        flag = 0;
    getRecord();
    function getRecord() {
        if (flag){
            return false;
        }
        $('.no-info').hide();
        $('.loading').show();
        flag = 1;
        $.ajax({
            url:C.marketInterface.tixianDetail,
            type:'get',
            dataType:'json',
            data:{
                token:C.marketToken,
                start:start,
                length:length
            },
            success:function (response) {
                if (response.result === 'success'){
                    $('.loading').hide();
                    num++;
                    var data = response.data;
                    maxNum = data.count;
                    start = num * length;
                    if (maxNum == 0){
                        $('.no-info').show();
                    }
                    if (data.list.length > 0){
                        $('#tixian-record').append(cmp(data));
                    }else {
                        $('.no-info').show();
                        num = maxNum +1;
                    }
                    flag = 0;
                }
            }
        });
    }


    //监听滚动高度，加载数据
    $(window).on('scroll', function () {
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

        if (num >= maxNum) {
            return;
        }
        if (($(document).height() - range) <= totalheight && num < maxNum) {
            //这里不能使用模板填充，应该是append()....
            getRecord();
        }
    });
    

});
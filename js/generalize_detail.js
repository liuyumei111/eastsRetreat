/**
 * Created by Administrator on 2017/9/20.
 */

$(document).ready(function () {

    $('.select-datetime input').datepicker({
        format:'yyyy-mm-dd',
        showMeridian:true,
        autoclose:true,
        language:'zh-CN',
        pickDate:true,
        minView:2,
        pickTime:true,
        todayBtn:'true',
        startDate:'2016-09-10',
        endDate:new Date()
    });



    var totalTpl = $('#total-template').html();
    var totalCmp = Handlebars.compile(totalTpl);

    var orderNumber ='',
        startTime='',
        endTime='',
        orderType='',
        range = 200,
        pageLength = 10,
        maxnum = 0,
        num = 0,
        totalheight = 0,
        flag = 0,
        start = 0;


    getOrderInfo();
    $('.aui-searchbar-btn').click(function () {
        start = num = 0;
        query()
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
            getOrderInfo();
        }
    });

    function getOrderInfo() {
        if (flag){
            return ;
        }
        $('.none-data').hide();
        $('.no-info').hide();

        flag = 1;
        var loading =dialog.loading();
        $.ajax({
            url:C.marketInterface.tgmx,
            type:'get',
            dataType:'json',
            data:{
                token:C.marketToken,
                orderNum:orderNumber,
                orderType:orderType,
                startTime:startTime,
                endTime:endTime,
                start:start,
                length:pageLength
            },
            complete:function () {
                loading.close();
            },
            success:function (response) {
                if (response.result === 'success'){
                    num++;

                    console.log(response.data);
                    var data = response.data;
                    var money = data.money;
                    $('.total-sales').html(money);
                    maxnum = data['count'];
                    start = num *pageLength;
                    if (maxnum == 0){
                        $('.none-data').show();
                    }
                    if (data.orders.length >0){

                        $('#total-data').append(totalCmp(data));
                    }else {
                        /*$('.no-info').show();*/
                    }
                    flag = 0;

                }else if (response.result === 'login'){
                    alert('登录过期请重新登录');
                    againLogin();
                }else {
                    alert(response.errorMsg);
                }
            }
        })
    }



    //开始时间
    function checkNull(id) {
        if (id=="starttime"){
            var starttime= $('#starttime').val();
            // console.log(starttime);
            if (isNull(starttime)){
                alert('开始时间不能为空');
                return false;
            }
            return true;
        }
        // 结束时间
        if (id=="endtime"){
            var endtime=$('#endtime').val();
            // console.log(endtime);
            if (isNull(endtime)){
                alert('结束时间不能为空');
                return false;
            }
            return true;
        }
    }

    /*检测开始时间小于结束时间*/
    function checkDate() {
        startTime=$('#starttime').val();
        endTime=$('#endtime').val();

        // 开始时间和结束时间之间最大间隔30天
        var mile=24*60*60*1000;
        var interval=30*mile;
        if(startTime < endTime && 0 < startTime - endTime < interval){
            return true;
        }
        if (startTime == '' && endTime =='' ){
            return true;
        }
        alert("开始时间需要小于结束时间");
        return false;
    }

    /*
     查询 操作*/
    function query(){
        /*if(!checkNull('starttime')){
            return ;
        }
        if(!checkNull('endtime')){
            return;
        }*/
        if(!checkDate()){
            return;
        }else {
            orderNumber = $('#search-input').val();
            orderType = $('#total-select').val();
            startTime = $('#starttime').val();
            endTime = $('#endtime').val();

            $('#total-data').empty();
            getOrderInfo();
        }

    }
    //判断字符串时间是否为空
    function isNull(timeString){
        if(timeString == null || timeString == ""){
            return true;
        }
        return false;
    }





});
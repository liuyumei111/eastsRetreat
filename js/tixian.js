/**
 * Created by Administrator on 2017/10/10.
 */
function submit() {
    var txje=$("#txje").val();
    var zfbzh=$("#zfbzh").val();
    var zfbname=$("#zfbname").val();

    var totalSales= $('.sales').html();
    console.log(txje);
    console.log(totalSales);
    if(txje==""){
        layer.open({
            content:"请输入提现金额"
            ,time:2
            ,skin:'msg'
        });
        return false
    }else if(txje < 1){
        layer.open({
            content:"提现金额必须大于1元"
            ,time:2
            ,skin:'msg'
        });
        return false
    }else if (txje > totalSales){
        layer.open({
            content:"提现金额不能大于现有金额"
            ,time:2
            ,skin:'msg'
        });
        return false
    }
    else if(zfbzh==""){
        layer.open({
            content:"请输入支付宝账号"
            ,time:2
            ,skin:'msg'
        });
        return false
    }else if(zfbname==""){
        layer.open({
            content:"请输入支付宝用户名"
            ,time:2
            ,skin:'msg'
        });
        return false
    }
    $.ajax({
        url:C.marketInterface.tixian,
        type:'get',
        dataType:'json',
        data:{
            token:C.marketToken,
            account:zfbzh,
            money:txje,
            name:zfbname
        },
        success:function (response) {
            if (response.result === 'success'){
                dialog.tusiSuccess('提现请求已发送！');
                gettxje();
                setTimeout(function () {
                    location.href = 'tixian_record.html';
                },1500);
            }
        }
    })
}
$('.aui-icon-left').click(function () {
    history.go(-1);
});

$('aui-pull-left').click(function () {
    history.go(-1);
});
var money=0;
function gettxje() {
    $.ajax({
        url:C.marketInterface.my,
        type:'get',
        dataType:'json',
        data:{
            token: C.marketToken
        },
        success:function (res) {
            console.log(res);
            money=res.data.money;
            $(".sales").html(res.data.money);
        }
    })
}
gettxje();
function alltx() {
    $("#txje").val(money)
}
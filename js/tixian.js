/**
 * Created by Administrator on 2017/10/10.
 */
function submit() {
    var txje=$("#txje").val();
    var zfbzh=$("#zfbzh").val();
    var zfbname=$("#zfbname").val();
    if(txje==""){
        layer.open({
            content:"请输入提现金额"
            ,time:2
            ,skin:'msg'
        });
        return false
    }else if(zfbzh==""){
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
        url:C.marketInterface.tixian11111111111111111,
        type:'get',
        dataType:'json',
        data:{

        },
        success:function (res) {

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
            $(".tixian-sales").html(res.data.money+"元")
        }
    })
}
gettxje();
function alltx() {
    $("#txje").val(money)
}
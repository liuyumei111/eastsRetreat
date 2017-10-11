
//初始化图片验证
var verifyCode = new GVerify("v_container");
//    图片验证码值
var code = '';
//    电话值
var phone = '';
//    短信验证码
var code = '';

//    ~~~~~点击确定绑定手机号
$('#Determine').click(function () {
    //      手机号
    if ($("#nmdPhone").val() == 0) {
        alert('请输入手机号');
        $("#nmdPhone").focus();
        return false;
    }
    if (!$("#nmdPhone").val().match(/(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[3，6,7,8]\d{8}$|(^18\d{9}$)/)) {
        alert('手机号格式有误');
        return false;
    }
    code = verifyCode.options.code;
    console.log(code);
    //     图片验证码
    if ($('#code_input').val() == '') {
        alert("请输入图形验证码");
        return false;
    }
    if ($('#code_input').val() != code) {
        alert('图形验证码错误');
        return false;
    }

    //      短信验证码
    if ($("#information").val() == 0) {
        alert('请输入短信验证码');
        return false;
    }
    //获取手机号
    phone = $('#nmdPhone').val();
    //获取验证码
    code = $('#information').val();
    $.ajax({
        url: C.marketInterface.bindingtel,
        type: 'POST',
        data: {
            token: C.marketToken,
            phone: phone,
            code: code
        },
        datatype: 'json',
        success: function (data) {
            if (data.result == 'success') {
                alert('绑定成功');
                window.location.href = 'my.html'
            } else if (data.result == 'login') {
                alert(data.errorMsg);
            } else {
                alert(data.errorMsg);
            }
        },
        error: function () {
            //alert('服务器异常');
        }
    })
});

//    ~~~~点击获取验证码
var countdown = 60;
function sendemail() {
    //      验证手机号
    if ($("#nmdPhone").val() == 0) {
        alert('请输入手机号');
        $("#nmdPhone").focus();
        return false;
    }
    if (!$("#nmdPhone").val().match(/(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[3，6,7,8]\d{8}$|(^18\d{9}$)/)) {
        alert('手机号格式有误');
        return false;
    }
    code = verifyCode.options.code;
    //     图片验证码
    if ($('#code_input').val() == '') {
        alert("请输入图形验证码");
        return false;
    }
    if ($('#code_input').val() != code) {
        alert('图形验证码错误');
        return false;
    }
//        获取到按钮元素
    var obj = $("#btn");
//        执行settime函数
    settime(obj);
    //获取手机号
    phone = $('#nmdPhone').val();
    $.ajax({
        url: 'http://192.168.199.107:8083/market/mobile/uc/phone/send',
        type: 'POST',
        data: {
            phone: phone,
        },
        datatype: 'json',
        success: function (data) {
            if (data.result == 'success') {
                console.log(data);
                //alert('验证码发送成功');
            } else if (data.result == 'login') {
                alert('登录过期，请重新登录');
                againLogin();
            } else {
                alert(data.errorMsg);
            }
        },
        error: function () {
            //alert('服务器异常')
        }
    })
}
function settime(obj) { //发送验证码倒计时
    //console.log(countdown);
    if (countdown == 0) {
        //不禁用input元素
        obj.attr('disabled', false);
        // obj.removeattr("disabled");
        //给这个input添加value
        obj.val("获取验证码");
        // 总时间
        countdown = 60;
        return;
    } else {
        // 禁用input元素
        obj.attr('disabled', true);
        //给这个input添加value
        obj.val("重新发送(" + countdown + ")");
        // 总时间每次都减1
        countdown--;
    }
    // 开启定时器,一秒执行一次
    setTimeout(function () {
            settime(obj)
        }
        , 1000)
}
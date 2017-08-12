/**
 * Created by Administrator on 2017/8/12.
 */


$(document).ready(function () {
    var openId='',userHeadImg='',userNickName='';
    $.ajax({
        url:C.getWxUserInfo,
        type:'get',
        dataType:'json',
        data:{},
        success:function (response) {
            var data=JSON.stringify(response);
            localStorage.setItem('wxUserInfo',data);
        }
    });

    $(document).on('click','.invite-submit',inviteSubmit);
    function inviteSubmit() {

        var inviteCode=$('.invite-code').find('input').val();
        if (inviteCode==null||inviteCode==''||inviteCode==undefined){
            alert('请输入邀请码');
        }else {
            var data=JSON.parse(localStorage.getItem('wxUserInfo'));
            openId=data.openid;
            //console.log(openId);
            userNickName=data.nickname;
            userHeadImg=data.headimgurl;
            $.ajax({
                url:C.marketInterface.reg,
                type:'get',
                dataType:'json',
                data:{
                    invitingCode:inviteCode,
                    openid:openId,
                    userNickName:userNickName,
                    userHeadImg:userHeadImg

                },
                success:function (response) {
                    if (response.result=='success'){
                        var data=response.data;
                        localStorage.setItem('token',data.accessToken);
                        var token=localStorage.getItem('token');
                        //console.log(token);
                        alert('注册成功');
                        location.href='http://www.rrfun.com.cn/Market/index.html';
                    }else {
                        alert(response.errorMsg);
                    }
                }
             })
        }

    }
});
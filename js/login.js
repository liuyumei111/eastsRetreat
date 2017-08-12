/**
 * Created by Administrator on 2017/8/12.
 */
$(document).ready(function () {

$(document).on('click','.login-touch-in',getOpenId);

function getOpenId() {
    var oppenId=localStorage.getItem('wxUserInfo');
    if (oppenId==0||oppenId==undefined){
        alert('null');
        location.href='http://www.rrfun.com.cn/Uc/inviteCode.html';
    }else {
        alert('value');
        location.href='index.html';

    }
}


});
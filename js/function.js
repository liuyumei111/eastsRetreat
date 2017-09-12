/**
 * Created by Administrator on 2017/8/8.
 */

/**
 * location.search
 *传入key，返回location.search中对应的value
 *截取出当前url后面的id
 * */
function locationSearcher(key) {
    var search = location.search.split('?');
    if(search.length>1){
        var params = search[1].split('&');
        for(var i=0;i<params.length; i++){
            var item = params[i].split('=');
            var k = item[0];
            if(key == k){
                return item[1];
            }
        }
    }
    return null;
}

//ios重新登录
function iosIsLogin() {
    window.webkit.messageHandlers.goLogin.postMessage(null);
}

//Android重新登录
function androidIsToken() {
    window.huifa.goLogin();
}










/*模拟弹窗*/
var dialog={};
dialog.alert = function (data) {
    data.type = 'alert';
    data.width = '270px';
    data.title = data.title ? data.title : '温馨提示';
    data.okText = data.okText ? data.okText : "知道了";
    return $.dialog(data);
};

dialog.confirm = function (data) {
    data.type = 'confirm';
    data.width = '270px';
    return $.dialog(data);
};

dialog.loading = function (con) {
    return $.dialog({content: con, titleIcon: "load", width: '230px', type: "loading"});
};

dialog.tusiSuccess = function (con) {
    return $.dialog({content: con, titleIcon: "success", width: '230px', type: "tusi", time: 1000});
};

dialog.tusiError = function (con , time) {
    time = time ? time : 3000;
    return $.dialog({content: con, titleIcon: "error", width: '230px', type: "tusi", time: time});
};

dialog.tusi = function (con) {
    return $.dialog({content: con, width: '230px', type: "tusi", time: 1000});
};


function againLogin() {

    var againData={
        postType:'againLogin'

    };

    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        iosAgainLogin(againData);
    } else {
        androidAgainLogin(JSON.stringify(againData));
    }
}


function iosAgainLogin(param) {
    window.webkit.messageHandlers.againLogin.postMessage(param);
}

function androidAgainLogin(param) {
    window.huifa.againLogin(param);
}




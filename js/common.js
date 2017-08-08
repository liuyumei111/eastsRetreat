/**
 * Created by Administrator on 2017/7/26.
 */

//判断是否维护中
/*if (C.isWeihu){
    if (C.status != 'iuuweihu' && typeof pageStatus == 'undefined') jumpUrl('weihu.html');
}*/

$(document).ready(function () {
    

/*

$(document).on("click.jumpurl", 'a', function (event) {
    //有nojump class 的不做跳转处理
    //if ($(this).hasClass('nojump') || $(this).hasClass('gologin')) return;
    //获取 a 标签href
    var url = $(this).attr("href");
    //不包含 .html 的 不做跳转处理
    if (url.indexOf(".html") > -1) {
        event.preventDefault();
        jumpUrl(url);
    }
});

/!**
 * 跳转页面
 * @param url
 * *!/
function jumpUrl(url) {
    location.href=versionUrl(url);
}

/!**
 * 拼接 跳转URL 加上版本号
 * @param url
 * @returns {string}
 *!/
function versionUrl(url) {
    url = url.replace(/[\?|&]vt=\d+/, '');
    return url;
    //return url + (url.indexOf("?") > -1 ? "&" : "?") + 'vt=' + C.versionTime;
}
*/


/*后退一步*/

$('.aui-icon-left').click(function () {
    history.go(-1);
});


/*Helper 配置*/
//包邮不包邮
Handlebars.registerHelper('exemption',function (value) {
    if (value=='001'){
        return '退货免邮费';
    }else if (value=='002'){
        return '退货不包邮';
    }
});

//有没有运费
Handlebars.registerHelper('freight',function (value) {
    if (value=='001'){
        return '包邮 免运费';
    }else if (value=='002'){
        return ' ';
    }
});

//包邮免运费
Handlebars.registerHelper('submitBaoyou',function (value) {
    if (value=='包邮 免运费'){
        return value;
    }else if (value==''){
        return '包邮 免运费';
    }
})







});
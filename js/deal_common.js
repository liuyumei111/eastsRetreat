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
     }*/

    /**
     * 拼接 跳转URL 加上版本号
     * @param url
     * @returns {string}
     */
    function versionUrl(url) {
        url = url.replace(/[\?|&]vt=\d+/, '');
        return url;
        //return url + (url.indexOf("?") > -1 ? "&" : "?") + 'vt=' + C.versionTime;
    }


    /*后退一步*/

    $('back-member').click(function () {
        window.location.href='my.html';
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
    });

    //是否为空
    Handlebars.registerHelper('isYesNull',function (p, options) {
        var flag=0;

        if (p==null||p==''){
            return flag;
        }else {
            flag=1;
            return flag;
        }
    });

    //分离以逗号隔开的Json数据
    Handlebars.registerHelper('splitDetailImg',function (value) {
        var splitvalue=value.split(',');
        var reValues=[];
        for ( var i=0; i<splitvalue.length; i++ ){
            var reValue={};
            reValue.name=splitvalue[i];
            reValues[i]=reValue;
        }
        return reValues;

    });

    //比较两个值
    //sym可以是<,>,=
    Handlebars.registerHelper('compare',function (first, sym, sec) {
        var r=first+sym+sec;
        return eval(r);
    });


    //判断是否为空时
    Handlebars.registerHelper('isNull',function (p, options) {
        if (p==null){
            return options.fn(this);
        }else {
            return options.fn(this);
        }
    });

    //判断value的状态，渲染不同的数据
    Handlebars.registerHelper('valueCompare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }
        var operators = {
            '==':     function(l, r) {return l == r; },
            '===':    function(l, r) {return l === r; },
            '!=':     function(l, r) {return l != r; },
            '!==':    function(l, r) {return l !== r; },
            '<':      function(l, r) {return l < r; },
            '>':      function(l, r) {return l > r; },
            '<=':     function(l, r) {return l <= r; },
            '>=':     function(l, r) {return l >= r; },
            'typeof': function(l, r) {return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }

        var result = operators[operator](left, right);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    
    





});
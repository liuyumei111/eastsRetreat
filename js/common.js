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

    $('.aui-icon-left').click(function () {
        history.go(-1);
    });

    $('aui-pull-left').click(function () {
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


    /**
     * 微信接口
     */
    function wxApi() {
        this.wx = null;
        this.done = true;
        this.init();
    }


//微信JSapi
    wxApi.prototype = {
        init: function () {
            var that = this;
            url = location.href.split('#')[0];
            ajaxCom({
                url: C.interface.wxJsApi,
                data: {url: url},
                success: function (data) {
                    wx.config(data);
                    wx.ready(function () {
                        showLog('配置成功');
                        that.wx = wx;
                        wx.hideAllNonBaseMenuItem();
                        wx.showMenuItems({
                            menuList:  C.wxShowMenu // 要显示的菜单项，所有menu项见附录3
                        });
                        that.shareUserQuan();
                        that.shareUser();
                        if (typeof loadingObj != 'undefined') loadingObj.close();
                    });
                    wx.error(function (res) {
                        showLog("配置失败 : ", res);
                    });
                },
                error: function (data) {
                    return false;
                }
            });
        },
        _init: function () {
            var that = this;
            if (!that.wx) {
                dialog.tusiError("微信API暂未加载完成~请稍后~" , 1000);
                return false;
            }
            return true;
        },
        saoma: function (callback) {
            var that = this;
            if (!that._init()) return false;
            that.wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    callback(res);
                },
                cancel: function () {

                }
            });
        },

        imgYulan: function (current, urls) {
            var that = this;
            if (!that._init()) return false;
            that.wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            });
        },

        /**
         * 分享朋友圈
         */
        shareUserQuan: function () {
            var that = this;
            that.wx.onMenuShareTimeline({
                title: C.shareUserQuan.title,
                link: C.shareUserQuan.link,
                imgUrl: C.shareUserQuan.imgUrl,
                success: function () {
                    //dialog.tusiSuccess('分享成功');
                },
                cancel: function () {

                }
            });
        },

        /**
         * 分享至朋友
         * @param data
         */
        shareUser: function () {
            var that = this;
            that.wx.onMenuShareAppMessage({
                title: C.shareUser.title,
                link: C.shareUser.link,
                imgUrl: C.shareUser.imgUrl,
                desc: C.shareUser.desc, // 分享描述
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    //dialog.tusiSuccess('分享成功');
                },
                cancel: function () {

                }
            });
        },

        /**
         * 选择上传图片
         */
        chooseImage: function (callback, number, type) {
            var that = this;
            if (!that._init()) return false;
            if (!that.done) return false;
            number = number ? number : 1;
            that.done = false;
            that.wx.chooseImage({
                count: number, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    for (k in res.localIds) {
                        type ? callback(res.localIds[k]) : that.uploadImage(res.localIds[k], callback);
                    }
                    that.done = true;
                },
                cancel: function () {
                    that.done = true;
                }
            });
        },

        /**
         * 上传图片
         * @param id
         * @param callback
         * @returns {boolean}
         */
        uploadImage: function (id, callback) {
            var that = this;
            if (!that._init()) return false;
            that.wx.uploadImage({
                localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    callback(id, res.serverId);
                },
                cancel: function (data) {
                    console.log(data);
                }
            });
        },

        /**
         * 关闭
         * @returns {boolean}
         */
        close: function () {
            var that = this;
            if (!that._init()) return false;
            that.wx.closeWindow();
        },
    }





});
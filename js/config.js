/**
 * Created by Administrator on 2017/7/27.
 */

(function (w) {
    var apiHost='http://192.168.199.107:8081';
    // var apiHost='http://www.rrfun.com.cn:8080';
    var marketHost='http://192.168.199.107:8083';
    //var marketHost='http://www.rrfun.com.cn:8081';

    //配置项
    w.C={};
    //域名
    C.host=apiHost+'/mall/mobile/';
    C.market=marketHost+'/market/mobile/';

    //是否开启打印日志
    C.debug=true;
    //是否正在维护
    C.isWeihu=false;
    //手机验证正则
    C.phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    //邮箱验证正则
    C.emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    //安全码验证正则
    C.selfNumberReg = /^[0-9a-zA-Z]{8,16}$/;
    //发送验证码时间
    C.putCodeTime=60;

    C.token='201708031209898169cdb594d601fc4471a9c3bab8c7fe386b';
    //C.marketToken=localStorage.getItem('token');
    C.marketToken='201708271127141342d9445d6a2d3c4b23b8d680f7ace49987';

    //获取微信oppenId
    C.getWxUserInfo='http://www.rrfun.com.cn/Uc/getInfo';
    //mall接口
    C.interface={
        //折扣商城首页
        discount:'product/index',
        //商品详情
        detail:'product/detail',
        //意见反馈
        opinion:'uc/feedback/add',
        //商品类别
        selectType:'index/categorys',
        //显示所有的收货地址
        allAddress:'uc/address/list',
        //添加收货地址
        addAddress:'uc/address/add',
        //修改收货地址
        insertAddress:'uc/address/edit',
        //删除收货地址
        deleteAddress:'uc/address/delete',
        //根据商品id获得所有评价信息
        detailComment:'product/feedbacks'

    };
    //market接口
    C.marketInterface={
        //店铺分享
        share:'store/share',
        //我的店铺
        myShop:'uc/store/index',
        //东东推个人中心
        my:'uc/index',
        // 绑定手机号
        bindingtel:'uc/phone/bind',
        // 设置
        setup:'uc/set/index',
        //团队管理
        teamadmin:'uc/group/index',
        //我的团队
        myteam:'uc/group/peoples',

        //我的老师
        myTeacher:'uc/teacher/index',
        //注册登录提交验证码
        reg:'login/reg',
        //获取公告
        notice:'notice/list',
        //公告详情
        noticeDetail:'notice/detail',
        //商品中心
        discount:'product/index',
        //商品类别
        selectType:'index/categorys',
        //推广中心
        promotionCenter:'index/index',
        //销售管理(成功，失败，交易中)
        orderList:'uc/order/list',
        //个人店铺中删除商品
        delMyShop:'uc/store/del',
        //分享给朋友或朋友圈
        shareFriend:'product/send',
        //微信群发波次商品
        batchShare:'product/weixinBatch',
        //微信群发当前波的商品
        weixinBatchSend:'product/weixinBatchSend',
        //发送到微信朋友圈
        friendBatch:'product/friendBatch'
    };

    //组合mall接口地址
    for (k in C.interface){
        C.interface[k]=C.host + C.interface[k];
    }

    //组合market接口地址
    for (k in C.marketInterface){
        C.marketInterface[k]=C.market+C.marketInterface[k];
    }

    //获取当前域名
    var localHostUrl = window.location.href.replace(/(\?.+?)$/g, '');
    localHostUrl = localHostUrl.replace(localHostUrl.split("/").pop(), '');
    C.localHostUrl = localHostUrl;




})(window);














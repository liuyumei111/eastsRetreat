/**
 * Created by Administrator on 2017/7/27.
 */

(function (w) {
    //商城
    //var apiHost='http://192.168.199.107:8081';
    var apiHost='http://www.jhjvip.cn:8080';
    //云店
   // var marketHost='http://192.168.199.107:8083';
    var marketHost='http://www.jhjvip.cn:8081';
    //配置项
    w.C={};
    //域名
    C.host=apiHost+'/mall/mobile/';
    C.market=marketHost+'/market/mobile/';

    // C.marketToken=localStorage.getItem('token');
    localStorage.setItem('token','201710091133173209b3a0c272ea794c45bf22af197f4fbd40');
    C.marketToken=localStorage.getItem('token');

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
        detailComment:'product/feedbacks',
        //秒杀首页
        seckill:'seckill/list',
        //秒杀详情
        seckillDetail:'seckill/detail',
        seckillBanner:'seckill/banners',
        //京东数据接口
        jdShop:'jd/index'

    };
    //market接口
    C.marketInterface={
        //店铺分享
        share:'uc/store/share',
        //我的店铺
        myShop:'uc/store/index',
        //东东推个人中心
        my:'uc/index',
        //修改昵称
        name:'uc/name',
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
        //分享中心
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
        friendBatch:'product/friendBatch',
        //秒杀首页
        seckill:'seckill/list',
        //秒杀详情
        seckillDetail:'seckill/detail',
        //秒杀banner
        seckillBanner:'seckill/banners',
        //修改昵称
        edit:'uc/edit',
        //分享明细
        tgmx:'uc/tgmx',
        //买家管理
        mjmx:'uc/mjgl',
        //首页京东商品分享
        homeJDShare:'jd/share',
        //首页京东数据
        jdShop:'jd/index',
        //首页京东数据
        //提现请求接口
        tixian:'tixian/add',
        //提现记录
        tixianDetail:'tixian/list'
    };

    //商城合mall接口地址
    for (k in C.interface){
        C.interface[k]=C.host + C.interface[k];
    }

    //云店组合market接口地址
    for (k in C.marketInterface){
        C.marketInterface[k]=C.market+C.marketInterface[k];
    }

    //获取当前域名
    var localHostUrl = window.location.href.replace(/(\?.+?)$/g, '');
    localHostUrl = localHostUrl.replace(localHostUrl.split("/").pop(), '');
    C.localHostUrl = localHostUrl;

})(window);














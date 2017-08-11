/**
 * Created by Administrator on 2017/7/27.
 */

(function (w) {
    var apiHost='http://192.168.199.107:8081';
    var marketHost='http://192.168.199.107:8083';
    
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
    C.marketToken='201708081456494396f958ae5f48764562a6025ecc7215a9da';
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
        deleteAddress:'uc/address/delete'
        

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
        myteam:'uc/group/peoples'







    };
    //组合mall接口地址
    for (k in C.interface){
        C.interface[k]=C.host + C.interface[k];
    }

    //组合market接口地址
    for (k in C.marketInterface){
        C.marketInterface[k]=C.market+C.marketInterface[k];
    }


})(window);














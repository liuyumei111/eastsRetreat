/**
 * Created by Administrator on 2017/9/20.
 */


define(function () {
    require.config({
        baseUrl:'./eastRetreat',
        paths:{
            'jquery':'js/jquery-3.0.0.min',
            'datepicker':'common/bootstrap/dist/js/bootstrap.min.js',
            'Handlebar':'js/handlebars-v4.0.10',
            'C':'js/config'
        },
        shim:{
            'function':''
        }
    });
});
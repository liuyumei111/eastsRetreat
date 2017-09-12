/**
 * Created by Administrator on 2017/8/3.
 */
$(document).ready(function () {
    var areaAddr = new LArea();
    areaAddr.init({
        'trigger': '#arrAdress',
        'valueTo': '#areaAddrValue',
        'keys': {
            id: 'value',
            name: 'text'
        },
        'type': 2,
        'data': [provs_data, citys_data, dists_data]
    });

    $(document).on('click','#nmbSubmit',submitInfo);
    function submitInfo() {
        if($("#nmdName").val()==0){
            alert('请填写收货人姓名');
            $("#nmdName").focus();
            return false;
        }
        reg = /^[\u4E00-\u9FA5]{2,6}$/;
        if(!reg.test($("#nmdName").val())){
            alert('请输入正确的姓名')
            $("#nmdName").focus()
            return false;
        }
        if($("#nmdPhone").val()==0){
            alert('请填写收货人手机号码');
            $("#telphone").focus();
            return false;
        }
        if(!$("#nmdPhone").val().match(/(^13\d{9}$)|(^14)[5,7]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[3，6,7,8]\d{8}$|(^18\d{9}$)/)) {
            alert('手机号格式有误');
            return false;
        }
        if($("#nmdDetailAddress").val().length<2){
            alert('请填写收货人详细地址到门牌号');
            $("#address").focus();
            return false;
        }

        //姓名
        var mbdName=$('#nmdName').val();
        //手机号
        var mbdPhone=$('#nmdPhone').val();
        //街道
        var mbdStreet=$('#nmdStreet').val();
        //地区
        var mbdAddress=$('#arrAdress').val();
        //详细地址
        var mbdDetailAddress=$('#nmdDetailAddress').val();
        //是否默认为收货地址
        var flag=0;
        if ($('#defaultShouhuo').is(':checked')){
            flag=1;
        }else {
            flag=0;
        }

        $.ajax({
            url:C.interface.addAddress,
            dataType:'json',
            type:'post',
            data:{
                addressCityAera:mbdAddress,
                addressDetail:mbdDetailAddress,
                addressName:mbdName,
                addressPhone:mbdPhone,
                isMain:flag,
                token:C.token
            },
            success:function (response) {
                if (response.result=='success'){
                    alert('添加成功');
                }else if (response.result=='fail'){
                    alert('登录过期请重新登录');
                    againLogin();
                }else {
                    alert(response.errorMsg);
                }
            }
        })
    }
});
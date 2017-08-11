/**
 * Created by Administrator on 2017/8/8.
 */

$(document).ready(function () {
    var detailId=locationSearcher('productsId');
    //详情数据模板
    var detailTpl=$('#detail-template').html();
    var detailCmp=Handlebars.compile(detailTpl);

    $.ajax({
        url:C.interface.detail,
        type:'get',
        dataType:'json',
        data:{
            productId:detailId
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                $('#detail-content-box').html(detailCmp(data));

            }
        }
    });
    
   




});








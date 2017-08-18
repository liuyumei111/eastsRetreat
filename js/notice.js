/**
 * Created by Administrator on 2017/8/17.
 */

$(document).ready(function () {

    //获取公告id
    var id=locationSearcher('id');

    var nDetailTpl=$('#notice-detail-template').html();
    var nDetailCmp=Handlebars.compile(nDetailTpl);

    $.ajax({
        url:C.marketInterface.noticeDetail,
        type:'get',
        dataType:'json',
        data:{
            id:id
        },
        success:function (response) {
            if (response.result=='success'){
                var data=response.data;
                $('#notice-detail').html(data.content);
            }
        }
    })

});

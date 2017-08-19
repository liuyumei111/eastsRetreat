/**
 * Created by Administrator on 2017/8/19.
 */
$(document).ready(function () {
    $(document).on('click','.out-login',function () {

        dialog.confirm({
            title: "确认要退出吗?",
            content: "",
            ok: function () {
                localStorage.removeItem('token');
                setTimeout(function () {
                    dialog.tusiSuccess('删除成功');
                }, 500);
            },
            cancel: function () {
            }
        })
    });

});
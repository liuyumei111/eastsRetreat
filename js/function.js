/**
 * Created by Administrator on 2017/8/8.
 */


/**
 * location.search
 *传入key，返回location.search中对应的value
 *截取出当前url后面的id
 * */
function locationSearcher(key) {
    var search = location.search.split('?');
    if(search.length>1){
        var params = search[1].split('&');
        for(var i=0;i<params.length; i++){
            var item = params[i].split('=');
            var k = item[0];
            if(key == k){
                return item[1];
            }
        }
    }
    return null;
}

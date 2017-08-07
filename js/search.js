/**
 * Created by Administrator on 2017/7/24.
 */
//下面是搜索用的JS代码
apiready = function(){
    api.parseTapmode();
};
var searchBar = document.querySelector(".aui-searchbar-input");
if(searchBar){
    searchBar.onclick = function(){
        document.querySelector(".aui-searchbar-cancel").style.marginRight = 0;
    }
}
document.querySelector(".aui-searchbar-cancel").onclick = function(){
    this.style.marginRight = "-"+this.offsetWidth+"px";
    document.getElementById("search-input").value = '';
    document.getElementById("search-input").blur();
};
function doSearch(){
    var searchValue = document.getElementById("search-input").value;
    if(searchValue){
        alert("您输入的内容是:"+searchValue);
    }
}




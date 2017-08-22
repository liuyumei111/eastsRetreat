apiready = function(){
    api.parseTapmode();
}
var searchBar = document.querySelector(".aui-searchbar");
var searchBarInput = document.querySelector(".aui-searchbar input");
var searchBarBtn = document.querySelector(".aui-searchbar .aui-searchbar-btn");
var searchBarClearBtn = document.querySelector(".aui-searchbar .aui-searchbar-clear-btn");
if(searchBar){
    searchBarInput.onclick = function(){
        searchBarBtn.style.marginRight = 0;
    }
    searchBarInput.oninput = function(){
        if(this.value.length){
            searchBarClearBtn.style.display = 'block';
            searchBarBtn.classList.add("aui-text-info");
            searchBarBtn.textContent = "搜索";
        }else{
            searchBarClearBtn.style.display = 'none';
            searchBarBtn.classList.remove("aui-text-info");
            searchBarBtn.textContent = "取消";
        }
    }
}
searchBarClearBtn.onclick = function(){
    this.style.display = 'none';
    searchBarInput.value = '';
    searchBarBtn.classList.remove("aui-text-info");
    searchBarBtn.textContent = "取消";
}
searchBarBtn.onclick = function(){
    var keywords = searchBarInput.value;
    if(keywords.length){
        searchBarInput.blur();
    }else{
        this.style.marginRight = "-"+this.offsetWidth+"px";
        searchBarInput.value = '';
        searchBarInput.blur();
    }
}
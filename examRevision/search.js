var a = new Array(100);
for(var i = 0; i<a.length; i++){
    a[i] = 2*i;
}
//a.forEach(element => {
//    console.log(element);
//});
/*var arr = [10,20, ,30,40,50];
for (var i in arr){
    console.log(i);
}
for (var j of arr){
    console.log(j);
}
arr.forEach(element => {
    console.log(element);
});*/

function buttonPressed() {
    var inputVal = document.getElementById('inputVal');
    var result = document.getElementById('result');
    var searchKey = parseInt(inputVal.value);
    var element = a.indexOf(searchKey);
    
    if (element != -1){
        result.innerHTML = "Found vlaue" + element;
    }
    else {
        result.innerHTML = "Not found"
    }
}

function start() {
    var searchButton = document.getElementById('searchButton');
    searchButton.addEventListener("click", buttonPressed, false);
}

window.addEventListener("load",start,false)
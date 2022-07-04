let btnAdd = document.getElementById("btnAddProduct");
let btnList = document.getElementById("btnListProduct");
btnAdd.addEventListener("click",function(){
    location.replace("insert_product.html");
});
btnList.addEventListener("click",function(){
    location.replace("list_product_page.php") 
});
let product_name = document.getElementById("product_name");
let product_name_edt = document.getElementById("product_name_edt");
let description = document.getElementById("description");
let description_edt = document.getElementById("description_edt");
let price = document.getElementById("price");
let price_edt = document.getElementById("price_edt");
let cost = document.getElementById("cost");
let cost_edt = document.getElementById("cost_edt");
let update_btn = document.getElementById("update_btn");
let cancel_btn = document.getElementById("cancel_btn");
let submit_btn = document.getElementById("submit_btn");

cancel_btn.style.display = "none";
submit_btn.style.display = "none";
update_btn.addEventListener("click",function(){
    product_name_edt.value = product_name.innerHTML;
    description_edt.value = description.innerHTML;
    price_edt.value = price.innerHTML;
    cost_edt.value = cost.innerHTML;
    update(update_btn);
    update(cancel_btn);
    update(submit_btn);
    update(product_name);
    update(product_name_edt);
    update(description);
    update(description_edt);
    update(price);
    update(price_edt);
    update(cost);
    update(cost_edt);
});
cancel_btn.addEventListener("click",function(){
    update(update_btn);
    update(cancel_btn);
    update(submit_btn);
    update(product_name);
    update(product_name_edt);
    update(description);
    update(description_edt);
    update(price);
    update(price_edt);
    update(cost);
    update(cost_edt);
})
function update(element){
    if(getComputedStyle(element).display == "none"){
        element.style.display = "block";
    }else{
        element.style.display = "none";
    }
}

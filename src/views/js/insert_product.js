let img_selector1 = document.getElementById("fileToUpload1");
let image1 = document.getElementById("image1");
let img_selector2 = document.getElementById("fileToUpload2");
let image2 = document.getElementById("image2");
let img_selector3 = document.getElementById("fileToUpload3");
let image3 = document.getElementById("image3");
img_selector1.addEventListener("change", function () {
    image1.src = URL.createObjectURL(event.target.files[0]);
});
img_selector2.addEventListener("change", function () {
    image2.src = URL.createObjectURL(event.target.files[0]);
});
img_selector3.addEventListener("change", function () {
    image3.src = URL.createObjectURL(event.target.files[0]);
});


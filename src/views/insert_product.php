<?php
    require "../dbconnect.php";
    $target_dir = "../product_image/";
    $base_link = "https://cuongb2k53lvt.000webhostapp.com/FashionShop/product_image/";
    $product_name = $_POST["productName"];
    $description = $_POST["description"];
    $price = $_POST["price"];
    $cost = $_POST["cost"];
    $type = $_POST["type"];
    $subtype = $_POST["subtype"];
    $size_s = $_POST["size_s"];
    $size_m = $_POST["size_m"];
    $size_l = $_POST["size_l"];
    $size_xl = $_POST["size_xl"];
    $file_size1 = $_FILES["fileToUpload1"]["size"];
    $file_size2 = $_FILES["fileToUpload2"]["size"];
    $file_size3 = $_FILES["fileToUpload3"]["size"];
    $basename1 = $product_name.basename($_FILES["fileToUpload1"]["name"]);
    $basename2 = $product_name.basename($_FILES["fileToUpload2"]["name"]);
    $basename3 = $product_name.basename($_FILES["fileToUpload3"]["name"]);
    $target_file1 = $target_dir.$basename1;
    $target_file2 = $target_dir.$basename2;
    $target_file3 = $target_dir.$basename3;
    $uploadOk = 1;
    $insertProductOk = 1;
    $insertSizeOk = 0;
    $error = "";

    CheckFile($target_file1,$file_size1);
    CheckFile($target_file2,$file_size2);
    CheckFile($target_file3,$file_size3);
    // Check if image file is a actual image or fake image
    if(isset($_POST["submit"])){
        $check1 = getimagesize($_FILES["fileToUpload1"]["tmp_name"]);
        $check2 = getimagesize($_FILES["fileToUpload2"]["tmp_name"]);
        $check3 = getimagesize($_FILES["fileToUpload3"]["tmp_name"]);
        if($check1 !== false && $check2 !== false && $check3 !== false) {
            echo "File is an image ";
            $uploadOk = 1;
          } else {
            echo "File is not an image.";
            $uploadOk = 0;
          }
    }
    if(strlen($product_name) > 0 && strlen($description) > 0 && strlen($price) > 0
        && strlen($cost) > 0 && strlen($type) > 0 && strlen($subtype) > 0){
        $query = "INSERT INTO Product_FashionShop VALUES (null,'$product_name','$description','$price','$cost','$type','$subtype')";
        $data = mysqli_query($connect,$query);
        if($data){
            $insertProductOk = 1;
        }else{
            $insertProductOk = 0;
        }
    }
    // Check if $uploadOk, $insertProductOk is set to 0 by an error
    if ($uploadOk == 0 || $insertProductOk == 0) {
        echo "Sorry, your file was not uploaded.".$insertProductOk.mysqli_error($connect);
    // if everything is ok, try to upload file
    } else {
        $insertSizeOk = InsertQuantityProduct("S",$size_s,$product_name,$connect);
        $insertSizeOk += InsertQuantityProduct("M",$size_m,$product_name,$connect);
        $insertSizeOk += InsertQuantityProduct("L",$size_l,$product_name,$connect);
        $insertSizeOk += InsertQuantityProduct("XL",$size_xl,$product_name,$connect);
        if (move_uploaded_file($_FILES["fileToUpload1"]["tmp_name"], $target_file1)
        && move_uploaded_file($_FILES["fileToUpload2"]["tmp_name"], $target_file2)
        && move_uploaded_file($_FILES["fileToUpload3"]["tmp_name"], $target_file3)
        && $insertSizeOk == 4) {
            InsertPhotoProduct($basename1,$product_name,$connect,$base_link);
            InsertPhotoProduct($basename2,$product_name,$connect,$base_link);
            InsertPhotoProduct($basename3,$product_name,$connect,$base_link);
            echo "The product has been uploaded.";
            header('Location: product_page.html');
        } else {
            unlink("../product_image/".$basename1);
            unlink("../product_image/".$basename2);
            unlink("../product_image/".$basename3);
            $delete_quantity_product = "DELETE FROM Product_Size_FashionShop WHERE product_name = '$product_name'";
            $delete_product = "DELETE FROM Product_FashionShop WHERE product_name = '$product_name'";
            mysqli_query($connect,$delete_quantity_product);
            mysqli_query($connect,$delete_product);
            echo "Sorry, there was an error.".$insertSizeOk.$er;
        }
    }

    function InsertPhotoProduct($basename, $product_name, $connect, $base_link){
        $query = "INSERT INTO Product_Photo_FashionShop VALUES (null,'$product_name','$base_link$basename')";
        mysqli_query($connect,$query);
    }

    function InsertQuantityProduct($size, $quantity, $product_name, $connect){
        if(strlen($quantity) == 0){
            $quantity = 0;
        }
        $query = "INSERT INTO Product_Size_FashionShop VALUES (null,'$product_name','$size','$quantity')";
        $data = mysqli_query($connect,$query);
        if($data){
            return 1;
        }else{
            return 0;
        }
    }

    function CheckFile($target_file, $file_size){
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        // Check if file already exists
        if (file_exists($target_file)) {
            echo "Sorry, file already exists.";
            $uploadOk = 0;
        }
        // Check file size
        if ($file_size > 2000000) {
            echo "Sorry, your file is too large.";
            $uploadOk = 0;
        }
        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
            && $imageFileType != "gif" ) {
            echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
            $uploadOk = 0;
        }
    }
?>
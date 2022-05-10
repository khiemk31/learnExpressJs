<?php
    require "../dbconnect.php";
    $get_all_product = "SELECT * FROM Product_FashionShop";
    $data = mysqli_query($connect,$get_all_product);
    $arr_product = array();
    $table_product = '';
    class Product{
        function Product($product_name,$description,$price,$cost,$type,$subtype){
            $this->product_name = $product_name;
            $this->description = $description;
            $this->price = $price;
            $this->cost = $cost;
            $this->type = $type;
            $this->subtype = $subtype;
        }
    }
    while($row = mysqli_fetch_assoc($data)){
        array_push($arr_product, new Product($row['product_name'],$row['description'],$row['price'],$row['cost'],$row['type'],$row['subtype']));
    }
    
    for($i = 0; $i < count($arr_product); $i++){
        $table_product.='<tr><td>'.$arr_product[$i]->product_name.'</td>
        <td>'.$arr_product[$i]->description.'</td>
        <td>'.$arr_product[$i]->price.'</td>
        <td>'.$arr_product[$i]->cost.'</td>
        <td>'.$arr_product[$i]->type.'</td>
        <td>'.$arr_product[$i]->subtype.'</td>
        <td><button>Xem</button></td></tr>';
    }

    $html = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="main_web.css">
    <style>
        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>
</head>
<body>
    <div class="topnav">
        <a href="main_page.html">Trang chủ</a>
        <a href="user_page.php">Người dùng</a>
        <a class="active" href="product_page.html">Sản phẩm</a>
        <a href="login_admin.html" id="logout">Đăng xuất</a>
    </div>
    <table>
        <tr>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Giá bán</th>
            <th>Giá nhập</th>
            <th>Loại</th>
            <th>Loại chi tiết</th>
            <th>
                <button>Xem</button>
            </th>
        </tr>'.
        $table_product.'
    </table>
</body>
</html>';
    echo $html;
?>
<?php
include_once("config.php");
// Create connection

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
     die("Connection failed: " . $conn->connect_error);
}

if($_GET['usernames']){
	$sql = "SELECT email FROM user";
	$result = $conn->query($sql);
//create an array
    $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $emparray[] = $row['email'];
    }
}elseif($_GET['user']){
    $id = $_GET['user'];
    $sql = "SELECT * FROM user WHERE id=".$id;
    $result = $conn->query($sql);
    $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $emparray= $row;
    }
}elseif($_GET['insert']) {
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name;
    $age = $data->age;
    $email = $data->email;
    $password = $data->password;
    $rs = $conn->query("INSERT INTO `user`(`name`, `age`, `email`,`password`) VALUES ('".$name."','".$age."','".$email."','".$password."')");
} elseif($_GET['delete']){
    $data = json_decode(file_get_contents("php://input"));
    $index = $data->id;
    $conn->query("DELETE FROM user WHERE id = '".$index."'");
}elseif($_GET['edit']){
    $data = json_decode(file_get_contents("php://input"));
    $index = $data->id;
    $name = $data->name;
    $age = $data->age;
    $email = $data->email;
    $sql = "UPDATE user SET name='".$name."', age=".$age.", email='".$email."' , age='".$age."' WHERE id='".$index."'";
    echo $sql;
    $conn->query($sql) or die(mysql_error()) ;
}elseif(isset($_FILES['image'])){
     $fname = $_POST["fname"];
    //The error validation could be done on the javascript client side.
    $errors= array();        
    $file_name = $_FILES['image']['name'];
    $file_size =$_FILES['image']['size'];
    $file_tmp =$_FILES['image']['tmp_name'];
    $file_type=$_FILES['image']['type'];   
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $extensions = array("jpeg","jpg","png");        
    if(in_array($file_ext,$extensions )=== false){
     $errors[]="image extension not allowed, please choose a JPEG or PNG file.";
    }
    if($file_size > 2097152){
    $errors[]='File size cannot exceed 2 MB';
    }               
    if(empty($errors)==true){
        move_uploaded_file($file_tmp,"images/".$file_name);
        echo $fname . " uploaded file: " . "images/" . $file_name;
    }else{
        print_r($errors);
    }
}
else {
	$sql = "SELECT * FROM user";
	$result = $conn->query($sql);
//create an array
    $emparray = array();
    while($row =mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }
}

echo json_encode($emparray);
?>  

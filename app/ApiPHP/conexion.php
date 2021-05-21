<?php 

    $servidor = 'localhost';
    $usuario  = 'root';
    $password = '';
    $db       = 'videoteca';

    $con = mysqli_connect($servidor, $usuario, $password, $db, 3306) or die('error conexion');

    //PDO
   try{
      $dsn = "mysql:host=$servidor;dbname=$db;port=3306";
      $dbh = new PDO($dsn, $usuario, $password);
      $dbh -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   } catch(PDOEXCEPTION $e){
      echo $e -> getMessage();
   }

?>
<?php 

    $servidor = 'localhost';
    $usuario  = 'root';
    $password = '';
    $db       = 'videoteca';

    $con = mysqli_connect($servidor, $usuario, $password, $db, 3306) or die('error conexion');

?>
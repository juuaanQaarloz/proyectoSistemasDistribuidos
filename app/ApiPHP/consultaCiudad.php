<?php

    include('conexion.php');

    $pcQuery = "SELECT * FROM CIUDAD";

    $nreg = 0;
    $res = $dbh -> prepare($pcQuery);
    $res -> execute();
    $mapaList = "";
    $salida = "";
    while($obj = $res->fetch(PDO::FETCH_OBJ)){
        if($mapaList!="") { $mapaList .= ","; }
        $mapaList .= '{"id":'.$obj->id.',';
        $mapaList .= '"nombre":"'.$obj->nombre.'",';
        $mapaList .= '"continente":"'.$obj->continente.'"}';
    }
    $salida = '{"datos":['.$mapaList.']';

    echo($salida);
  ?>
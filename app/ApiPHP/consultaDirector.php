<?php

    include('conexion.php');

    $pcQuery = "SELECT * FROM DIRECTOR";

    $nreg = 0;
    $res = $dbh -> prepare($pcQuery);
    $res -> execute();
    $mapaList = "";
    $salida = "";
    while($obj = $res->fetch(PDO::FETCH_OBJ)){
        if($mapaList!="") { $mapaList .= ","; }
        $mapaList .= '{"id":'.$obj->id.',';
        $mapaList .= '"nombre":"'.$obj->nombre.'",';
        $mapaList .= '"lugarNacimiento":"'.$obj->lugarNacimiento.'",';
        $mapaList .= '"tel":"'.$obj->tel.'"}';
    }
    $salida = '{"datos":['.$mapaList.']';

    echo($salida);
  ?>
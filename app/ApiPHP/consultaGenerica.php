<?php

    include('conexion.php');

    $pcQuery = "SELECT * FROM ACTOR";

    $nreg = 0;
    $res = $dbh -> prepare($pcQuery);
    $res -> execute();
    $mapaList = "";
    $salida = "";
    while($obj = $res->fetch(PDO::FETCH_OBJ)){
        //$mapaObj = "{id:".$obj->id.",nombre:".$obj->nombre.",nacionalidad:".$obj->nombre."}";
        if($mapaList!="") { $mapaList .= ","; }
        $mapaList .= '{"id":'.$obj->id.',';
        $mapaList .= '"nombre":"'.$obj->nombre.'",';
        $mapaList .= '"nacionalidad":"'.$obj->nacionalidad.'"}';
    }
    $salida = '{"datos":['.$mapaList.']';



    echo($salida);
  ?>
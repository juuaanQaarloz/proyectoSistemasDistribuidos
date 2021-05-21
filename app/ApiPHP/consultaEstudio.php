<?php

    include('conexion.php');

    $pcQuery = "SELECT E.id,
                       E.ciudad,
                       C.nombre nombreCiudad,
                       C.continente,
                       E.nombre,
                       E.direccion,
                       E.telefono
                  FROM ESTUDIO E, CIUDAD C
                 WHERE E.ciudad = C.ID";

    $nreg = 0;
    $res = $dbh -> prepare($pcQuery);
    $res -> execute();
    $mapaList = "";
    $salida = "";
    while($obj = $res->fetch(PDO::FETCH_OBJ)){
        if($mapaList!="") { $mapaList .= ","; }
        $mapaList .= '{"id":'.$obj->id.',';
        $mapaList .= '"ciudad":"'.$obj->ciudad.'",';
        $mapaList .= '"nombreCiudad":"'.$obj->nombreCiudad.'",';
        $mapaList .= '"continente":"'.$obj->continente.'",';
        $mapaList .= '"nombre":"'.$obj->nombre.'",';
        $mapaList .= '"direccion":"'.$obj->direccion.'",';
        $mapaList .= '"telefono":"'.$obj->telefono.'"}';
    }
    $salida = '{"datos":['.$mapaList.']';

    echo($salida);
  ?>
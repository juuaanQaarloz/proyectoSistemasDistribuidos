<?php
    include('conexion.php');
    $pcQuery = "SELECT * FROM ACTOR";
    $postdata = file_get_contents("php://input");
    $mapaList = "";
    $salida = "";
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata, true);
        if( trim($request['id']) === '' ) {
            return http_response_code(400);
        }
        $id = mysqli_real_escape_string($con, (int)$request['id']);
        $res = $dbh -> prepare($pcQuery + " WHERE id = $id");
        $res -> execute();
        while($obj = $res->fetch(PDO::FETCH_OBJ)){
            if($mapaList!="") { $mapaList .= ","; }
            $mapaList .= '{"id":'.$obj->id.',';
            $mapaList .= '"nombre":"'.$obj->nombre.'",';
            $mapaList .= '"nacionalidad":"'.$obj->nacionalidad.'"}';
        }
        $salida = '{"datos":['.$mapaList.']';
        echo($salida);
    } else {
        $res = $dbh -> prepare($pcQuery);
        $res -> execute();
        while($obj = $res->fetch(PDO::FETCH_OBJ)){
            if($mapaList!="") { $mapaList .= ","; }
            $mapaList .= '{"id":'.$obj->id.',';
            $mapaList .= '"nombre":"'.$obj->nombre.'",';
            $mapaList .= '"nacionalidad":"'.$obj->nacionalidad.'"}';
        }
        $salida = '{"datos":['.$mapaList.']';
        echo($salida);
     }
?>
  <?php

   include('conexion.php');

   $pcQuery = "SELECT PR.id,
                      PR.pelicula
                      P.actor,
                      A.nombre,
                      A.nacionalidad,
                      P.director,
                      D.nombre nombreDirector,
                      D.lugarNacimiento,
                      D.tel telDirector,
                      P.estudio,
                      E.ciudad,
                      C.nombre nombreCiudad,
                      C.continente,
                      E.nombre nombreEstudio,
                      E.direccion direccionEstudio,
                      E.telefono telEstudio,
                      P.fproduccion,
                      P.costo,
                      PR.cinema,
                      C.nombre nombreCinema,
                      C.continente continenteCinema,
                      PR.h_inicio horaInicio,
                      PR.h_fin horaFin
                 FROM PROYECCIONES PR, PELICULA P, CINEMA C, ACTOR A, DIRECTOR D, ESTUDIO E, CIUDAD C
                WHERE P.id = PR.pelicula
                  AND C.id = PR.cinema
                  AND A.id = P.actor
                  AND D.id = P.director
                  AND E.id = P.id
                  AND C.id = E.ciudad";

   $nreg = 0;
   $res = $dbh -> prepare($pcQuery);
   $res -> execute();
   $mapaList = "";
   $salida = "";
   while($obj = $res->fetch(PDO::FETCH_OBJ)){
       if($mapaList!="") { $mapaList .= ","; }
       $mapaList .= '{"id":'.$obj->id.',';
       $mapaList .= '"pelicula":"'.$obj->pelicula.'",';
       $mapaList .= '"actor":"'.$obj->actor.'",';
       $mapaList .= '"nombre":"'.$obj->nombre.'",';
       $mapaList .= '"nacionalidad":"'.$obj->nacionalidad.'",';
       $mapaList .= '"director":"'.$obj->director.'",';
       $mapaList .= '"nombreDirector":"'.$obj->nombreDirector.'",';
       $mapaList .= '"lugarNacimiento":"'.$obj->lugarNacimiento.'",';
       $mapaList .= '"telDirector":"'.$obj->telDirector.'",';
       $mapaList .= '"estudio":"'.$obj->estudio.'",';
       $mapaList .= '"ciudad":"'.$obj->ciudad.'",';
       $mapaList .= '"nombreCiudad":"'.$obj->nombreCiudad.'",';
       $mapaList .= '"continente":"'.$obj->continente.'",';
       $mapaList .= '"nombreEstudio":"'.$obj->nombreEstudio.'",';
       $mapaList .= '"direccionEstudio":"'.$obj->direccionEstudio.'",';
       $mapaList .= '"telEstudio":"'.$obj->telEstudio.'",';
       $mapaList .= '"fproduccion":"'.$obj->fproduccion.'",';
       $mapaList .= '"costo":"'.$obj->costo.'",';
       $mapaList .= '"cinema":"'.$obj->cinema.'",';
       $mapaList .= '"nombreCinema":"'.$obj->nombreCinema.'",';
       $mapaList .= '"continenteCinema":"'.$obj->continenteCinema.'",';
       $mapaList .= '"horaInicio":"'.$obj->horaInicio.'",';
       $mapaList .= '"horaFin":"'.$obj->horaFin.'"}';
   }
   $salida = '{"datos":['.$mapaList.']';

   echo($salida);
 ?>
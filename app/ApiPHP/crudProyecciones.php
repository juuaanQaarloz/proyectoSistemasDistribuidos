<?php
    include('conexion.php');
    $postdata = file_get_contents("php://input");
    if(isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata, true);

        if( trim($request['accion']) === '' ) {
            return http_response_code(400);
        }

        $accion = mysqli_real_escape_string($con, trim($request['accion']));

        if($accion === 'INSERT') {
            $pelicula = mysqli_real_escape_string($con, trim($request['pelicula']));
            $cinema = mysqli_real_escape_string($con, trim($request['cinema']));
            $hInicio = mysqli_real_escape_string($con, trim($request['hInicio']));
            $hFin = mysqli_real_escape_string($con, trim($request['hFin']));

            $sql = "INSERT INTO PROYECCIONES (id, pelicula, cinema, h_inicio, h_fin) VALUES (null,'$pelicula','$cinema', '$hInicio', '$hFin')";

            if($con->query($sql)) {
                http_response_code(201);
                $product = [ 'id' => mysqli_insert_id($con),'pelicula' => $pelicula, 'cinema' => $cinema , 'h_inicio' => $hInicio , 'h_fin' => $hFin ];
                echo json_encode($product);
            } else {
                http_response_code(422);
            }
        } else if( $accion === 'UPDATE') {

            $id = mysqli_real_escape_string($con, (int)$request['id']);
            $pelicula = mysqli_real_escape_string($con, trim($request['pelicula']));
            $cinema = mysqli_real_escape_string($con, trim($request['cinema']));
            $hInicio = mysqli_real_escape_string($con, trim($request['hInicio']));
            $hFin = mysqli_real_escape_string($con, trim($request['hFin']));
            $sql = "UPDATE PROYECCIONES SET pelicula = '$pelicula', cinema = '$cinema', h_inicio = '$hInicio', h_fin = '$hFin' WHERE id = $id";
            if (!mysqli_query($con, $sql)) {
                echo("Error description: " . mysqli_error($con));
            }
        } else if($accion === 'DELETE') {
            $id = mysqli_real_escape_string($con, (int)$request['id']);
            $sqlDel = "DELETE FROM PROYECCIONES WHERE id = $id";
            if (!mysqli_query($con, $sqlDel)) {
                echo("Error description: " . mysqli_error($con));
            }

        }

    }
 ?>


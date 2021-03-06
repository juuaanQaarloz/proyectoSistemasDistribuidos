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
            $name = mysqli_real_escape_string($con, trim($request['nombre']));
            $direccion = mysqli_real_escape_string($con, trim($request['direccion']));

            $sql = "INSERT INTO CINEMA (id,nombre,direccion) VALUES (null,'$name','$direccion')";

            if($con->query($sql)) {
                http_response_code(201);
                $product = [ 'id' => mysqli_insert_id($con),'nombre' => $name, 'direccion' => $direccion ];
                echo json_encode($product);
            } else {
                http_response_code(422);
            }
        } else if( $accion === 'UPDATE') {

            $id = mysqli_real_escape_string($con, (int)$request['id']);
            $name = mysqli_real_escape_string($con, trim($request['nombre']));
            $direccion = mysqli_real_escape_string($con, trim($request['direccion']));
            $sql = "UPDATE CINEMA SET nombre = '$name', direccion = '$direccion' WHERE id = $id";
            if (!mysqli_query($con, $sql)) {
                echo("Error description: " . mysqli_error($con));
            }
        } else if($accion === 'DELETE') {
            $id = mysqli_real_escape_string($con, (int)$request['id']);
            $sqlDel = "DELETE FROM CINEMA WHERE id = $id";
            if (!mysqli_query($con, $sqlDel)) {
                echo("Error description: " . mysqli_error($con));
            }

        }

    }
 ?>
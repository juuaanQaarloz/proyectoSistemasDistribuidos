<?php

    echo(1);

    include('conexion.php');

    $pcQuery = "SELECT * FROM ACTOR";

    echo($pcQuery);

    $result = mysqli_query($con, $pcQuery);
  ?>
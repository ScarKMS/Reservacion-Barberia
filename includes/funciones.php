<?php

function obtenerServicios(){
    try {
        //Importar la conexcion
        require 'database.php';
        
        //Escribir el codio SQL
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $sql);

        //Obtener los resultados
        echo '<pre>';
        var_dump(mysqli_fetch_assoc($consulta));
        echo '</pre>';

    } catch (\Throwable $th) {
        //throw $th;

        var_dump($th);
    }
}

obtenerServicios();
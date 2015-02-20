<?php
    include('mysqlconf.php');

    $conn = new mysqli($servername, $username, $password, $db);
    if ($conn->connect_error) {
        die("Connection failed: ".$conn->connect_error);
    }

    if (isset($_GET['matchid'])) {
        
    }
?>
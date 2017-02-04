<?php
header('Content-Type: application/json');

define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
if (isset($_SESSION['pl_id'])){
    unset($_SESSION['pl_id']);
    session_destroy();
    echo json_encode(array(
        'state' => true
    ));
} else {
    echo json_encode(array(
        'state' => true
    ));
}
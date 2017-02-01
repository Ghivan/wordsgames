<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
define('PASSWORD_MIN_LENGTH', 6);

if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
require_once MAIN_DIR . "/login/includes/auth.php";
require_once(MAIN_DIR  . '/_config/config.php');
require_once(MAIN_DIR  . '/_includes/database.php');
header('Content-Type: application/json');

if (!checkLogin()){
    echo json_encode(
        array(
            'state' => false,
            'errorMessage' => 'Логин или пароль введены неправильно'
        )
    );
    exit();
}

echo json_encode($_POST);
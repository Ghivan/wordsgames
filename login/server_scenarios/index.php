<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
define('LOGIN_SCRIPT', $_SERVER['SCRIPT_NAME']);

function login_classes_autoloader($class) {
    $path = '_includes/classes/' . $class . '.php';
    if (file_exists($path)){
        include_once $path;
    }
}
spl_autoload_register('login_classes_autoloader');
include_once MAIN_DIR . '/_app_files/_includes/autoloaders.php';
header('Content-Type: application/json');

if (empty($_POST['action']) || (empty($_POST['login']) && $_POST['pswrd'])){
    echo json_encode(array(
        'state' =>false,
        'message' => 'Воспользуйтесь формой авторизации'
    ));
    exit();
}

if ($_POST['action'] === 'login'){
    include_once '_includes/tasks/login.php';
}

if ($_POST['action'] === 'register'){
    include_once '_includes/tasks/register.php';
}





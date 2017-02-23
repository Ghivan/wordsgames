<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

function login_classes_autoloader($class) {
    $path = 'classes/' . $class . '.php';
    if (file_exists($path)){
        include_once $path;
    }
}
spl_autoload_register('login_classes_autoloader');
include_once MAIN_DIR . '/_app_files/_includes/autoloaders.php';
header('Content-Type: application/json');

if (empty($_POST['action']) || !Authorization::check()){
    echo json_encode(array(
        'state' =>false,
        'message' => 'Воспользуйтесь вкладкой настройки личного кабинета'
    ));
    exit();
}

define('PLAYER_ID', Authorization::getAuthorizedPlayerId());
if ($_POST['action'] === 'changeAvatar'){
    include_once 'tasks/change_avatar.php';
    exit();
}

if ($_POST['action'] === 'changeEmail'){
    include_once 'tasks/change_email.php';
    exit();
}

if ($_POST['action'] === 'changeLogin'){
    include_once 'tasks/change_login.php';
    exit();
}

if ($_POST['action'] === 'sendFeedback'){
    include_once 'tasks/send_feedback.php';
    exit();
}

if ($_POST['action'] === 'changePassword'){
    include_once 'tasks/change_password.php';
    exit();
}

if ($_POST['action'] === 'logOut'){
    Authorization::logOut();
    echo json_encode(array(
        'state' => true
    ));
    exit();
}

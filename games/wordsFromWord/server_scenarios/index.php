<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

function wfw_class_autoloader($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/games/wordsFromWord/server_scenarios/classes/' . $class . '.php';
}
include_once MAIN_DIR . '/_app_files/_includes/autoloaders.php';
spl_autoload_register('wfw_class_autoloader');
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
header('Content-Type: application/json');
if (empty($_SESSION['pl_id']) || empty($_POST['action'])){
    echo json_encode(array(
       'state' => false,
        'message' => 'Авторизируйтесь, чтобы начать игру'
    ));
    exit;
}


define('PLAYER_ID', $_SESSION['pl_id']);

if (empty($_SESSION['cur_level']) && empty($_POST['lvl'])){
    $_SESSION['cur_level'] = DBPlayerProgress::getLastPlayedLevel(PLAYER_ID);
}

if (!empty($_POST['lvl'])){
    $_SESSION['cur_level'] = $_POST['lvl'];
}

define('CURRENT_LEVEL', $_SESSION['cur_level']);


if ($_POST['action'] === 'getInitialInfo'){
    include_once 'tasks/getInitialInfo.php';
}

if ($_POST['action'] === 'checkWord'){
    include_once 'tasks/checkWord.php';
}

if ($_POST['action'] === 'getWordDefinition'){
    include_once 'tasks/getWordDefinition.php';
}

if ($_POST['action'] === 'useTip'){
    include_once 'tasks/useTip.php';
}



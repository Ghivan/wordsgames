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
if (!Authorization::check() || empty($_POST['action'])){
    echo json_encode(array(
       'state' => false,
        'message' => 'Авторизируйтесь, чтобы начать игру'
    ));
    exit;
}
define('PLAYER_ID', Authorization::getAuthorizedPlayerId());


if (empty($_SESSION['cur_level']) && empty($_POST['lvl'])){
    $_SESSION['cur_level'] = DBPlayerProgress::getLastPlayedLevel(PLAYER_ID);
}
if (!empty($_POST['lvl'])){
    $_SESSION['cur_level'] = $_POST['lvl'];
}

define('CURRENT_LEVEL', $_SESSION['cur_level']);

if ($_POST['action'] === 'getPlayerProgress'){
    include_once 'tasks/printPlayerProgress.php';
}

if ($_POST['action'] === 'getRecordTable'){
    include_once 'tasks/printTablescore.php';
}

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





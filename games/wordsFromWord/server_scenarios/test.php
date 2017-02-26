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

include_once "tasks/printTablescore.php";
?>
<form method="post" action="index.php">
    <div>
        <label for="initial">
            <input id="initial" type="radio" name="action" value="getInitialInfo" checked>getInitialInfo
        </label>
    </div>

    <div>
        <label for="userWord">
            UserWord: <input id="userWord" type="text" name="userWord" >
        </label>
        <label for="checkWord">
            <input id="checkWord" type="radio" name="action" value="checkWord"> checkWord
        </label>
    </div>

    <div>
        <label for="createRecord">
            CreateRecord: <input id="createRecord" type="text" name="createRecord" >
        </label>
        <label for="actionCreate">
            <input id="actionCreate" type="radio" name="action" value="createRecord"> createRecord
        </label>
    </div>
    <div>
        <label for="wordDefinition">
            getDefinition: <input id="wordDefinition" type="text" name="word" >
        </label>
        <label for="getDefinition">
            <input id="getDefinition" type="radio" name="action" value="getWordDefinition"> getDefinition
        </label>
    </div>
    <button type="submit">Submit</button>
</form>
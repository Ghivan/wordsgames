<?php
function my_autoloader($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/games/wordsFromWord/server_scenarios/classes/' . $class . '.php';
}
spl_autoload_register('my_autoloader');

var_dump((new DBPlayerProgress(68))->getScore());
var_dump((new DBPlayerProgress(68))->getProgressOnLvl(1));
var_dump((new DBPlayerGlobalInfo(68))->getGlobalInfo());
var_dump((new DBDictionary())->getWordDefinition('аак'));
var_dump((new DBGameInfo())->getPlayersRecordsTable());


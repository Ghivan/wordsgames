<?php


if (!defined('PLAYER_ID') || !defined('CURRENT_LEVEL') || empty($_POST['userWord'])) exit;
$checker = new AddingWordChecker(PLAYER_ID,CURRENT_LEVEL
    ,$_POST['userWord']);

echo json_encode(
    $checker->getChangedData()
);

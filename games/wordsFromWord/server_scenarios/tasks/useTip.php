<?php
if (!defined('PLAYER_ID') || !defined('CURRENT_LEVEL') || empty($_POST['tipType'])) exit;
header('Content-Type: application/json');

$tipExecution = new TipExecutor(strip_tags($_POST['tipType']), CURRENT_LEVEL, PLAYER_ID);
echo json_encode($tipExecution->getTipResult());
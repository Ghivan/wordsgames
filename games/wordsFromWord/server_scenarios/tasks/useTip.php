<?php
if (!defined('PLAYER_ID') || !defined('CURRENT_LEVEL') || empty($_POST['tipType'])) exit;

$tipExecution = new TipExecutor(strip_tags($_POST['tipType']), CURRENT_LEVEL, PLAYER_ID);
echo json_encode($tipExecution->getTipResult());
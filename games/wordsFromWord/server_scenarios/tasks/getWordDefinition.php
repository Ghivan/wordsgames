<?php
if (!defined('PLAYER_ID') || !defined('CURRENT_LEVEL') || empty($_POST['word'])) exit();
header('Content-Type: application/json');

$definition = DBDictionary::getWordDefinition(strip_tags($_POST['word']));
if(!empty($definition)){
 echo json_encode(array(
     'state' => true,
     'definition' => $definition
 ));
} else {
    echo json_encode(array(
        'state' => false
    ));
}
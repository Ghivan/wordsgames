<?php
header('Content-Type: text/html');

if (!defined('PLAYER_ID')) exit();
$records = DBGameInfo::getPlayersRecordsTable();
if (empty($records)){
    echo 'Рекордов пока нет. Станьте первым!';
    exit();
}
$place = 1;
echo "<table class='table table-responsive'><thead><tr><th>Место</th><th>Имя</th><th>Количество очков</th></tr></thead><tbody>";
foreach ($records as $player=>$score){
    echo "<tr><td>{$place}</td><td>{$player}</td><td>{$score}</td></tr>";
    $place++;
}
echo "</tbody></<table>";
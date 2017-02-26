<?php
header('Content-Type: text/html');

if (!defined('PLAYER_ID')) exit();
echo "<table class='table table-responsive'><thead><tr><th>Этап</th><th>Отгадано слов</th><th>Достигнутые цели</th></tr></thead><tbody>";
$totalPassedLevels = DBPlayerProgress::getPassedLvlQuantity(PLAYER_ID);

for ($i = 0; $i < $totalPassedLevels; $i++){
    $lvl = $i+1;
    $lvlInfo = DBPlayerProgress::getProgressOnLvl(PLAYER_ID, $lvl);
    $foundWordsNumber = count($lvlInfo['foundWords']);
    $totalWordsNumber = count(DBGameInfo::getWordVariantsOnLvl($lvl));
    $percentFound = floor($foundWordsNumber / $totalWordsNumber * 100);
    $achievement = '';
    if ($lvlInfo['star1status']){
        $achievement .= 'Отгадать 40% слов<br>';
    }

    if ($lvlInfo['star2status']){
        $missionUnique = DBGameInfo::getUniqueMission($lvl);
        $letter = '"' . mb_strtoupper(array_keys($missionUnique)[0]) . '"';
        $letterCount = array_values($missionUnique)[0];
        $achievement .= "Отгадать слов на букву {$letter}: {$letterCount}<br>";
    }

    if ($lvlInfo['star3status']){
        $achievement .= "Отгадать 100% слов<br>";
    }

    if (empty($achievement)){
        $achievement = 'Достижений нет';
    }

    echo  "<tr><td>{$lvl}</td><td>{$foundWordsNumber} ({$percentFound}%)</td><td>{$achievement}</td>";
}

echo "</tbody></<table>";
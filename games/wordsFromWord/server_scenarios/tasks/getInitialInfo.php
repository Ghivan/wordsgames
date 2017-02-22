<?php

if (!defined('PLAYER_ID') || !defined('CURRENT_LEVEL')) exit;

$playerGlobalInfo = DBPlayerGlobalInfo::getGlobalInfo(PLAYER_ID);
$playerProgressInfo = DBPlayerProgress::getProgressOnLvl(PLAYER_ID, CURRENT_LEVEL);
$levelInfo = DBGameInfo::getLevelInfo(CURRENT_LEVEL);

echo json_encode(array(
    'state' => true,
    'login' => $playerGlobalInfo['login'],
    'avatar' => $playerGlobalInfo['avatar'],
    'level' => CURRENT_LEVEL,
    'totalLevelsNumber' => DBGameInfo::getLevelsQuantity(),
    'levelsPassedNumber' => DBPlayerProgress::getPassedLvlQuantity(PLAYER_ID),
    'levelWord' => $levelInfo['word'],
    'wordVariants' => $levelInfo['wordVariants'],
    'foundWords' => (empty($playerProgressInfo['foundWords'])) ? array() : $playerProgressInfo['foundWords'],
    'score' => DBPlayerProgress::getScore(PLAYER_ID),
    'missions' => array(
        1 => (boolean) $playerProgressInfo['star1status'],
        2 => (boolean) $playerProgressInfo['star2status'],
        3 => (boolean) $playerProgressInfo['star3status']
    ),
    'missionUnique' => $levelInfo['missionUnique']
));
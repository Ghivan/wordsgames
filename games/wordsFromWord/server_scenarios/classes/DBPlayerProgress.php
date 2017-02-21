<?php

class DBPlayerProgress extends DB
{
    private static $queries = array(
        'scoreInfo' => 'SELECT `score` FROM `wfw_scoreTable` WHERE `pl_id` = :playerId',

        'progressOnLvl' => 'SELECT pl_res.`word`, pl_res.`lvl_status`, pl_res.foundWords, pl_res.star1status, pl_res.star2status, pl_res.star3status 
FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl`
WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl',

        'newScoreList' => 'INSERT INTO `wfw_scoreTable`(`pl_id`) VALUES(:playerId)',

        'progressRecordForNewLvl' => 'INSERT INTO `wfw_levelsPassed`(`pl_id`, `word`) VALUES(:playerId, (SELECT `word` FROM `wfw_levels` WHERE `level` = :lvl))',

        'levelPassageStatus' => 'SELECT pl_res.`lvl_status` FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl` WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl',

        'levelPassedQuantity' => 'SELECT count(`word`) as `quantity` FROM `wfw_levelsPassed` WHERE pl_id = :playerId AND `lvl_status` = TRUE ',

        'maxPlayedLevel' => 'SELECT MAX(level) as curLevel FROM wfw_levelsPassed as plProg, wfw_levels as lvls WHERE plProg.pl_id = :playerId AND plProg.word = lvls.word ',

        'updateFoundWords' => 'UPDATE `wfw_levelsPassed` SET `foundWords` = :foundWords WHERE `pl_id` = :playerId AND `word` = (SELECT wfw_levels.`word` FROM wfw_levels WHERE `level` = :lvl)',

        'augmentScore' => 'UPDATE `wfw_scoreTable` SET `score` = (`score` + :delta) WHERE `pl_id` = :playerId',

        'completeMission' => 'UPDATE `wfw_levelsPassed` SET {{}} = TRUE WHERE `pl_id` = :playerId AND `word` = (SELECT wfw_levels.`word` FROM wfw_levels WHERE `level` = :lvl)',

        'completeLvl' => 'UPDATE `wfw_levelsPassed` SET `lvl_status` = TRUE WHERE `pl_id` = :playerId AND `word` = (SELECT wfw_levels.`word` FROM wfw_levels WHERE `level` = :lvl)'
    );

    static function getLastPlayedLevel($playerId){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['maxPlayedLevel']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $result = $result['curLevel'];

            if ($result !== null){
                $curLevel = intval($result);
            } else {
                self::createNewScoreList($playerId);
                self::createProgressRecordForNewLvl($playerId,1);
                $curLevel = 1;
            }
            return $curLevel;

        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return null;
        }
    }

    static function getScore($playerId){
        try{
            $stmt = parent::getConnection()->prepare(self::$queries['scoreInfo']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!empty($result)){
                $userScore = intval($result['score']);
            } else {
                self::createNewScoreList($playerId);
                if (!$stmt->execute()){
                    ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                    $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                    throw new Exception($message);
                }
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $userScore = intval($result['score']);
            }
            return $userScore;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }
    }

    private static function createNewScoreList($playerId){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['newScoreList']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(),$stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }
    }

    static function getProgressOnLvl($playerId, $lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['progressOnLvl']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);

            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                throw new Exception($message);
            }

            $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);
            if (empty($playerProgressOnLvl)) {
                if ($lvl == 1) {
                    self::createProgressRecordForNewLvl($playerId, 1);
                    if (!$stmt->execute()){
                        ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                        $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                        throw new Exception($message);
                    }
                    $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);
                    $playerProgressOnLvl['foundWords'] = array();
                    return $playerProgressOnLvl;
                }

                $totalLvls = DBGameInfo::getLevelsQuantity();
                if ($lvl > $totalLvls){
                    return null;
                }

                $previousLvlStatus = self::checkLvlPassageStatus($playerId, $lvl -1);
                if ($previousLvlStatus){
                    self::createProgressRecordForNewLvl($playerId, $lvl);
                    if (!$stmt->execute()){
                        ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                        $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                        throw new Exception($message);
                    }
                    $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);
                    $playerProgressOnLvl['foundWords'] = array();
                    return $playerProgressOnLvl;
                }
            }

            if (empty($playerProgressOnLvl)) return null;

            if (empty($playerProgressOnLvl['foundWords'])){
                $playerProgressOnLvl['foundWords'] = array();
            } else {
                $playerProgressOnLvl['foundWords'] = json_decode($playerProgressOnLvl['foundWords']);
            }
            return $playerProgressOnLvl;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }
    }

    static function createProgressRecordForNewLvl($playerId, $lvl){
        try{
            $totalLvls = DBGameInfo::getLevelsQuantity();
            if ($lvl > $totalLvls){
                return false;
            }

            $stmt = parent::getConnection()->prepare(self::$queries['progressRecordForNewLvl']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);

            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                throw new Exception($message);
            }
            return true;

        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return false;
        }

    }

    static function checkLvlPassageStatus($playerId, $lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['levelPassageStatus']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                throw new Exception($message);
            }
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if (empty($result)) return false;
            return ($result['lvl_status']) ? true : false;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }

    }

    static function getPassedLvlQuantity($playerId){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['levelPassedQuantity']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (empty($result)) return null;

            return $result['quantity'];
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }

    }

    static function updateFoundWords($playerId, $lvl, array $foundWords){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['updateFoundWords']);
            $foundWords = json_encode($foundWords);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);
            $stmt->bindParam(':foundWords', $foundWords);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')' . ' Отгаданные слова: ' . json_encode($foundWords);
                throw new Exception($message);
            }
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }

    }

    static function augmentScore($playerId, $delta){
        try{
            $stmt = parent::getConnection()->prepare(self::$queries['augmentScore']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':delta', $delta);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', изменение очков: '. $delta . ')';
                throw new Exception($message);
            }
            return true;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }
    }

    static function setCompleteStatusOnMission($playerId, $lvl,  int $missionNumber){
        try {
            if (($missionNumber > 3) || ($missionNumber < 1)) return false;

            $star = 'star'.$missionNumber.'status';
            $query = str_replace('{{}}', $star, self::$queries['completeMission']);

            $stmt = parent::getConnection()->prepare($query);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')' . ' Номер миссии: ' . $missionNumber;
                throw new Exception($message);
            }
            return true;
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return false;
        }

    }

    static function completeLevel($playerId, $lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['completeLvl']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', уровень ' . $lvl . ')';
                throw new Exception($message);
            }
            return true;
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return false;
        }

    }
}
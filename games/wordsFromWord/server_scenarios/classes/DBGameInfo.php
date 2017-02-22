<?php

class DBGameInfo extends DB
{
    private static $queries = array(
        'levelInfo' => 'SELECT `level`, `word`, `wordVariants`, `missionUnique` FROM `wfw_levels` WHERE `level` = :lvl',

        'wordVariantsInfo' => 'SELECT `wordVariants` FROM `wfw_levels` WHERE `level` = :lvl',

        'levelsQuantity' => 'SELECT count(`level`) as totalNum FROM `wfw_levels`',

        'playersRecordsTable' => 'SELECT `login`, `score` FROM `players`, `wfw_scoreTable` WHERE wfw_scoreTable.pl_id = players.id ORDER BY `score` DESC LIMIT 10',

        'uniqueMission' => 'SELECT `missionUnique` FROM `wfw_levels` WHERE `level` = :lvl'
    );

    static function getLevelInfo($lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['levelInfo']);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (уровень: ' . $lvl . ')';
                throw new Exception($message);
            }
            $result =  $stmt->fetch(PDO::FETCH_ASSOC);
            $result['missionUnique'] = json_decode($result['missionUnique'], true);
            $result['wordVariants'] = mb_split(',', $result['wordVariants']);
            return $result;
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return null;
        }
    }

    static function getWordVariantsOnLvl($lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['wordVariantsInfo']);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (уровень: ' . $lvl . ')';
                throw new Exception($message);
            }
            $result =  $stmt->fetch(PDO::FETCH_ASSOC);
            $result = mb_split(',', $result['wordVariants']);
            return $result;
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return array();
        }
    }

    static function getLevelsQuantity(){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['levelsQuantity']);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (получение количества уровней)';
                throw new Exception($message);
            }
            $result =  $stmt->fetch(PDO::FETCH_ASSOC);
            return intval($result['totalNum']);
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return null;
        }

    }

    static function getPlayersRecordsTable(){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['playersRecordsTable']);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (получение таблицы рекордов)';
                throw new Exception($message);
            }

            $result =  $stmt->fetchAll(PDO::FETCH_ASSOC);
            $tablescore = array();
            foreach ($result as $record){
                $tablescore[$record['login']] = $record['score'];
            }
            return $tablescore;
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return array();
        }
    }

    static function getUniqueMission($lvl){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['uniqueMission']);
            $stmt->bindParam(':lvl', $lvl);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(),$stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (уровень: ' . $lvl . ')';
                throw new Exception($message);
            }
            $result =  $stmt->fetch(PDO::FETCH_ASSOC);
            return json_decode($result['missionUnique'], true);
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return null;
        }

    }
}
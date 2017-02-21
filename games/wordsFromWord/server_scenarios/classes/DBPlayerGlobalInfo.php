<?php

class DBPlayerGlobalInfo extends DB
{
    private static $queries = array(
        'globalInfo' => 'SELECT id, login, avatar, exp, level FROM `players` WHERE `id` = :playerId',

        'augmentExperience' => 'UPDATE `players` SET `exp` = (`exp` + :delta) WHERE `id` = :playerId'
    );


    static function getGlobalInfo($playerId){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['globalInfo']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }
    }

    static function augmentExperience($playerId, $delta){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['augmentExperience']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':delta', $delta);
            if (!$stmt->execute()) {
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', изменение опыта: '. $delta . ')';
                throw new Exception($message);
            }
            return true;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }
    }
}
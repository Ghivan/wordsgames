<?php

class DBPlayerGlobalInfo extends DB
{
    private static $queries = array(
        'globalInfo' => 'SELECT id, login, avatar, exp, level FROM `players` WHERE `id` = :playerId',

        'augmentExperience' => 'UPDATE `players` SET `exp` = (`exp` + :delta) WHERE `id` = :playerId'
    );


    static function getGlobalInfo($playerId){
        $stmt = parent::getConnection()->prepare(self::$queries['globalInfo']);
        $stmt->bindParam(':playerId', $playerId);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    static function augmentExperience($playerId, $delta){
        $stmt = parent::getConnection()->prepare(self::$queries['augmentExperience']);
        $stmt->bindParam(':playerId', $playerId);
        $stmt->bindParam(':delta', $delta);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
    }
}
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

    static function getGameLevelInfo($lvl){
        $stmt = parent::getConnection()->prepare(self::$queries['levelInfo']);
        if (!$stmt->execute(array(
            ':lvl' => $lvl
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        $result['missionUnique'] = json_decode($result['missionUnique'], true);
        $result['wordVariants'] = mb_split(',', $result['wordVariants']);

        return $result;

    }

    static function getWordVariantsOnLvl($lvl){
        $stmt = parent::getConnection()->prepare(self::$queries['wordVariantsInfo']);
        if (!$stmt->execute(array(
            ':lvl' => $lvl
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        $result = mb_split(',', $result['wordVariants']);

        return $result;
    }

    static function getLevelsQuantity(){
        $stmt = parent::getConnection()->prepare(self::$queries['levelsQuantity']);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        return intval($result['totalNum']);
    }

    static function getPlayersRecordsTable(){
        $stmt = parent::getConnection()->prepare(self::$queries['playersRecordsTable']);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result =  $stmt->fetchAll(PDO::FETCH_ASSOC);

        $tablescore = array();
        foreach ($result as $record){
            $tablescore[$record['login']] = $record['score'];
        }

        return $tablescore;
    }

    static function getUniqueMission($lvl){
        $stmt = parent::getConnection()->prepare(self::$queries['uniqueMission']);
        if (!$stmt->execute(array(
            ':lvl' => $lvl
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        return json_decode($result['missionUnique'], true);
    }
}
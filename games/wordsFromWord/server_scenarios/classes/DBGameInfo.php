<?php

class DBGameInfo
{
    private $dbc = null;
    private $queries = array(
        'levelInfo' => 'SELECT `level`, `word`, `wordVariants`, `missionUnique` FROM `wfw_levels` WHERE `level` = :lvl',
        'levelsQuantity' => 'SELECT count(`level`) as totalNum FROM `wfw_levels`',
        'playersRecordsTable' => 'SELECT `login`, `score` FROM `players`, `wfw_scoreTable` WHERE wfw_scoreTable.pl_id = players.id ORDER BY `score` DESC LIMIT 10'
    );

    function __construct()
    {
        $this->dbc = DB::getConnection();
    }

    public function getGameLevelInfo($lvl){
        $stmt = $this->dbc->prepare($this->queries['levelInfo']);
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

        $result['missionUnique'] = json_decode($result['missionUnique']);
        $result['wordVariants'] = mb_split(',', $result['wordVariants']);

        return $result;

    }

    public function getLevelsQuantity(){
        $stmt = $this->dbc->prepare($this->queries['levelsQuantity']);
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

    public function getPlayersRecordsTable(){
        $stmt = $this->dbc->prepare($this->queries['playersRecordsTable']);
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
}
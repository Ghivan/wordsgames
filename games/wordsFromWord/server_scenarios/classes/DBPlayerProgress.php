<?php

class DBPlayerProgress
{
    private $dbc = null;
    private $playerId;
    private $queries = array(
        'scoreInfo' => 'SELECT `score` FROM `wfw_scoreTable` WHERE `pl_id` = :playerId',
        'progressOnLvl' => 'SELECT pl_res.`word`, pl_res.`lvl_status`, pl_res.foundWords, pl_res.star1status, pl_res.star2status, pl_res.star3status 
FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl`
WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl',
        'levelsQuantity' => 'SELECT count(`level`) as totalNum FROM `wfw_levels`',
        'newScoreList' => 'INSERT INTO `wfw_scoreTable`(`pl_id`) VALUES(:playerId)',
        'progressRecordForNewLvl' => 'INSERT INTO `wfw_levelsPassed`(`pl_id`, `word`) VALUES(:playerId, (SELECT `word` FROM `wfw_levels` WHERE `level` = :lvl))',
        'levelPassageStatus' => 'SELECT pl_res.`lvl_status` FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl` WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl'
    );

    function __construct($playerId)
    {
        $this->dbc = DB::getConnection();
        $this->playerId = $playerId;
    }

    public function getScore(){
        $stmt = $this->dbc->prepare($this->queries['scoreInfo']);
        $stmt->bindParam(':playerId', $this->playerId);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)){
            $userScore = intval($result['score']);
        } else {
            $this->createNewScoreList();
            $userScore = 0;
        }

        return $userScore;
    }

    private function createNewScoreList(){
        $stmt = $this->dbc->prepare($this->queries['newScoreList']);
        $stmt->bindParam(':playerId', $this->playerId);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
    }

    public function getProgressOnLvl($lvl){
        $stmt = $this->dbc->prepare($this->queries['progressOnLvl']);
        $stmt->bindParam(':playerId', $this->playerId);
        $stmt->bindParam(':lvl', $lvl);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($playerProgressOnLvl) && $lvl == 1){
            $this->createProgressRecordForNewLvl(1);
            $stmt->execute();
            $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);
            $playerProgressOnLvl['foundWords'] = array();
            return $playerProgressOnLvl;
        }

        if (empty($playerProgressOnLvl)) return null;

        if (empty($playerProgressOnLvl['foundWords'])){
            $playerProgressOnLvl['foundWords'] = array();
        } else {
            $playerProgressOnLvl['foundWords'] = json_decode($playerProgressOnLvl['foundWords']);
        }

        return $playerProgressOnLvl;
    }

    private function createProgressRecordForNewLvl($lvl){
        $stmt = $this->dbc->prepare($this->queries['progressRecordForNewLvl']);
        $stmt->bindParam(':playerId', $this->playerId);
        $stmt->bindParam(':lvl', $lvl);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
    }

    public function checkLvlPassageStatus($lvl){
        $stmt = $this->dbc->prepare($this->queries['levelPassageStatus']);
        $stmt->bindParam(':playerId', $playerId);
        $stmt->bindParam(':lvl', $lvl);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($result)) return false;

        return ($result['lvl_status']) ? true : false;
    }

}
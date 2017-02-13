<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
include_once MAIN_DIR . '/_config/config.php';
class Database
{
    protected $dbc;

    function __construct()
    {
        $this->dbc = new PDO("mysql:host=".HOST.";dbname=".DB_NAME.";charset=UTF8", DB_USER, DB_PASSWORD);
    }


    public function getGameLevelInfo($lvl){
        $stmt = $this->dbc->prepare('SELECT `level`, `word`, `wordVariants`, `missionUnique` FROM `wfw_levels` WHERE `level` = :lvl');

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

    public function getPlayerProgress($playerId, $lvl){
        $queryStr = 'SELECT `score`, `lastLevel` FROM `wfw_scoreTable` WHERE `pl_id` = :playerId';

        $stmt = $this->dbc->prepare($queryStr);
        if (!$stmt->execute(array(
            ':playerId' => $playerId
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result){
            $this->createNewPlayerScoreList($playerId);
            $result = array(
                'score' => 0,
                'lastLevel' => 1
            );
            $playerProgressOnLvl = $this->getPlayerProgressOnLvl($playerId, 1);
            $result = array_merge($result, $playerProgressOnLvl);
            return $result;
        }

        $playerProgressOnLvl = $this->getPlayerProgressOnLvl($playerId, $lvl);

        return ($playerProgressOnLvl) ? array_merge($result, $playerProgressOnLvl) : null;
    }

    private function createNewPlayerScoreList($playerId){
        $queryStr = 'INSERT INTO `wfw_scoreTable`(`pl_id`) VALUES(:playerId)';

        $stmt = $this->dbc->prepare($queryStr);
        if (!$stmt->execute(array(
            ':playerId' => $playerId
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
    }

    private function getPlayerProgressOnLvl($playerId, $lvl){
        $queryStr = 'SELECT pl_res.`word`, pl_res.`lvl_status`, pl_res.foundWords, pl_res.star1status, pl_res.star2status, pl_res.star3status 
FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl`
WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl';

        $stmt = $this->dbc->prepare($queryStr);
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

        $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($playerProgressOnLvl)){
            if ($lvl == 1) {
                $this->createNewPlayerProgressList($playerId, $lvl);
                $stmt->execute();
                $playerProgressOnLvl = $stmt->fetch(PDO::FETCH_ASSOC);
                return $playerProgressOnLvl;
            } else {
                return null;
            }
        }

        $playerProgressOnLvl['foundWords'] = json_decode($playerProgressOnLvl['foundWords']);
        return $playerProgressOnLvl;

    }

    private function createNewPlayerProgressList($playerId, $lvl){
        $queryStr = 'INSERT INTO `wfw_levelsPassed`(`pl_id`, `word`) VALUES(:playerId, (SELECT `word` FROM `wfw_levels` WHERE `level` = :lvl))';

        $stmt = $this->dbc->prepare($queryStr);
        if (!$stmt->execute(array(
            ':playerId' => $playerId,
            ':lvl' => $lvl
        ))){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
    }

    public function checkPlayerPassageLvl($playerId, $lvl){
        $queryStr = 'SELECT pl_res.`lvl_status` FROM `wfw_levelsPassed` as `pl_res`, `wfw_levels` as `gm_lvl` WHERE pl_res.pl_id = :playerId AND pl_res.word = gm_lvl.word AND gm_lvl.level = :lvl';

        $stmt = $this->dbc->prepare($queryStr);
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


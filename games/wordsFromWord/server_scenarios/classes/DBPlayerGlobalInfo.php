<?php

class DBPlayerGlobalInfo
{
    private $dbc = null;
    private $playerId;
    private $queries = array(
        'globalInfo' => 'SELECT id, login, avatar, exp, level FROM `players` WHERE `id` = :playerId'
    );

    function __construct($playerId)
    {
        $this->dbc = DB::getConnection();
        $this->playerId = $playerId;
    }

    public function getGlobalInfo(){
        $stmt = $this->dbc->prepare($this->queries['globalInfo']);
        $stmt->bindParam(':playerId', $this->playerId);
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
}
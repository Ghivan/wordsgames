<?php

class DBDictionary
{
    private $dbc = null;
    private $queries = array(
        'getDefinition' => 'SELECT `definition` FROM `dictionary` WHERE `word` = :word',
    );

    function __construct()
    {
        $this->dbc = DB::getConnection();
    }

    public function getWordDefinition($word){
        $stmt = $this->dbc->prepare($this->queries['getDefinition']);
        $stmt->bindParam(':word', $word);
        if (!$stmt->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (empty($result)) return null;
        return $result['definition'];
    }
}
<?php

class DBDictionary extends DB
{
    private static $queries = array(
        'getDefinition' => 'SELECT `definition` FROM `dictionary` WHERE `word` = :word',
    );

    static function getWordDefinition($word){
        $stmt = parent::getConnection()->prepare(self::$queries['getDefinition']);
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
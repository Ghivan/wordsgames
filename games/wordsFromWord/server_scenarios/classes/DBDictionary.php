<?php

class DBDictionary extends DB
{
    private static $queries = array(
        'getDefinition' => 'SELECT `definition` FROM `dictionary` WHERE `word` = :word',
    );

    static function getWordDefinition($word){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['getDefinition']);
            $stmt->bindParam(':word', $word);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString, __LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (слово: ' . $word . ')';
                throw new Exception($message);
            }

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if (empty($result)) return null;
            return $result['definition'];
        } catch (Throwable $e) {
            ErrorLogger::logException($e);
            return null;
        }
    }
}
<?php
class DBGamesGlobalInfo extends DB
{
    private static $queries = array(
        'globalInfo' => 'SELECT id, name, rules, status, author, path  FROM games'
    );


    static function getGlobalInfo(){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['globalInfo']);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса информации об играх';
                throw new Exception($message);
            }
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }
    }
}
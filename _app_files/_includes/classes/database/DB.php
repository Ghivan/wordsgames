<?php
try {
    include_once $_SERVER['DOCUMENT_ROOT'] . '/_app_files/_includes/config.php';
} catch (Throwable $e) {
    ErrorLogger::logException($e);
}
class DB
{
    private static $dbc = null;

    protected static function getConnection()
    {

        if (!self::$dbc){
            try {
                self::$dbc = new PDO("mysql:host=".HOST.";dbname=".DB_NAME.";charset=UTF8", DB_USER, DB_PASSWORD);
            } catch (Throwable $e) {
                ErrorLogger::logException($e);
                return null;
            }
        }
        return self::$dbc;
    }
}
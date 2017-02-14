<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
include_once MAIN_DIR . '/_config/config.php';
class DB
{
    private static $dbc = null;

    public static function getConnection()
    {
        if (!self::$dbc){
            self::$dbc = new PDO("mysql:host=".HOST.";dbname=".DB_NAME.";charset=UTF8", DB_USER, DB_PASSWORD);
        }

        return self::$dbc;
    }


}



<?php

class ErrorLogger
{
    private static $pathToErrorLog = '_errors/error_log.txt';
    private static $pathToDBErrorLog = '_errors/db_error_log.txt';

    public static function logException(Throwable $exception){
        $curdir = getcwd();
        if (!file_exists(self::$pathToErrorLog)){
            foreach ($array = mb_split('/', self::$pathToDBErrorLog) as $index=>$dir){
                if (mb_strpos($dir, '.') == false){
                    if (!is_dir($dir)){
                        mkdir($dir);
                    }
                    chdir($dir);
                } else {
                    chdir($curdir);
                }
            }
        }
        file_put_contents(self::$pathToErrorLog, "\n ------------------------------------- \n", FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, date(DATE_RFC822) . "\n", FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'Executing script: ' . $_SERVER['PHP_SELF'] . "\n", FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'File: ' . $exception->getFile() . "\n",  FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'Line: ' . $exception->getLine() . "\n",  FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'Stack Trace: ' . "\n" . $exception->getTraceAsString() . "\n",  FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'ErrorCode: ' . $exception->getCode() . "\n",  FILE_APPEND);
        file_put_contents(self::$pathToErrorLog, 'Message: ' . $exception->getMessage() . "\n",  FILE_APPEND);
    }

    public static function logFailedDBRequest(array $error, $queryString, string $line, string $file){
        $curdir = getcwd();
        if (!file_exists(self::$pathToDBErrorLog)){
            foreach ($array = mb_split('/', self::$pathToDBErrorLog) as $index=>$dir){
                if (mb_strpos($dir, '.') == false){
                    if (!is_dir($dir)){
                        mkdir($dir);
                    }
                    chdir($dir);
                } else {
                    chdir($curdir);
                }
            }
        }
        file_put_contents(self::$pathToDBErrorLog, "\n ------------------------------------- \n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, date(DATE_RFC822) . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'Executing script: ' . $_SERVER['PHP_SELF'] . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'File: ' . $file . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'Line: ' . __LINE__  . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'SQLSTATE error code: ' . $error[0] . ' Driver specific error code: ' . $error[1] . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'Driver specific error message: ' . $error[2] . "\n", FILE_APPEND);
        file_put_contents(self::$pathToDBErrorLog, 'Query string: ' . $queryString . "\n", FILE_APPEND);
    }

}
<?php
class Templator
{
    public static function includeTab($tabName){
        $path =  $_SERVER['DOCUMENT_ROOT'] . '/cabinet/templates/tabs/' . $tabName . '.php';
        if (file_exists($path)){
            include_once $path;
        }
    }
}
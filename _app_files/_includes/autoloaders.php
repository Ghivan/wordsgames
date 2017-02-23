<?php
function global_database_autoloader($class) {
    $path = $_SERVER['DOCUMENT_ROOT'] . '/_app_files/_includes/classes/database/' . $class . '.php';
    if (file_exists($path)){
        include_once $path;
    }
}
function global_classes_autoloader($class) {
    $path = $_SERVER['DOCUMENT_ROOT'] . '/_app_files/_includes/classes/' . $class . '.php';
    if (file_exists($path)){
        include_once $path;
    }
}
spl_autoload_register('global_database_autoloader');
spl_autoload_register('global_classes_autoloader');
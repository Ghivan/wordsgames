<?php
include_once '_app_files/_includes/autoloaders.php';
if (Authorization::check()){
    header('Location: /cabinet/');
} else {
    header('Location: /login/');
}
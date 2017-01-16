<?php
require_once "login/includes/auth.php";

if (checkLogin()){
    header('Location: /cabinet/');
} else {
    header('Location: /login/');
}
<?php
class Authorization
{
    public static function check(){
        if (session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        return (isset($_SESSION['pl_id'])) ? true : false;
    }
    public static function logIn($playerId){
        if (!defined('LOGIN_SCRIPT') || LOGIN_SCRIPT !== '/login/server_scenarios/index.php') return false;

        if (session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        $_SESSION['pl_id'] = $playerId;
        return (isset($_SESSION['pl_id'])) ? true : false;
    }

    public static function logOut(){
        if (session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        unset($_SESSION['pl_id']);
        unset($_SESSION['cur_level']);
    }

    public static function getAuthorizedPlayerId(){
        if (session_status() !== PHP_SESSION_ACTIVE){
            session_start();
        }
        return isset($_SESSION['pl_id']) ? $_SESSION['pl_id'] : null;
    }
}
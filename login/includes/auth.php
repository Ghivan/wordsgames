<?php

if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

function checkLogin()
{
    return (isset($_SESSION['pl_id'])) ? true : false;
}



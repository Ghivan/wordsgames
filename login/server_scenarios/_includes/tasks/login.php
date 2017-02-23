<?php
if (!defined('LOGIN_SCRIPT')) exit();
$result = DBUserAuth::authorize($_POST['login'], $_POST['pswrd']);
echo json_encode($result);
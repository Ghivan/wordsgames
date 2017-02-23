<?php
if (!defined('LOGIN_SCRIPT')) exit();
if (empty($_POST['cpswrd']) || ($_POST['cpswrd'] != $_POST['pswrd'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Переданные данные не корректны'
        )
    );
    exit();
}
$result = DBUserRegistrator::register($_POST['login'], $_POST['pswrd'], $_POST['email']);
echo json_encode($result);
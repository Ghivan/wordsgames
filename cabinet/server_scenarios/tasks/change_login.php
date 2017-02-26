<?php
if (!defined('PLAYER_ID') || empty($_POST['login'])) exit();

if (!InputValidator::validateLogin($_POST['login'])){
    echo json_encode(array(
            'state' => false,
            'message' => InputValidator::LOGIN_REQUIREMENTS
        )
    );
    exit();
}

if (DBPlayerSettingsChanger::updateLogin(PLAYER_ID, $_POST['login'])){
    echo json_encode(array(
            'state' => true
        )
    );
} else {
    echo json_encode(array(
            'state' => false,
            'message' => 'Пользователь с таким логином уже зарегистрирован'
        )
    );
}
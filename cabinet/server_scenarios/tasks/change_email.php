<?php
if (!defined('PLAYER_ID') || empty($_POST['email'])) exit();

if (!InputValidator::validateEmail($_POST['email'])){
    echo json_encode(array(
            'state' => false,
            'message' => 'Электронная почта введена некорректно'
        )
    );
    exit();
}

if (DBPlayerSettingsChanger::updateEmail(PLAYER_ID, $_POST['email'])){
    echo json_encode(array(
        'state' => true
        )
    );
} else {
    echo json_encode(array(
            'state' => false,
            'message' => 'Пользователь с такoй электронной почтой уже зарегистрирован'
        )
    );
}
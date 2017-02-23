<?php
if (!defined('PLAYER_ID') || empty($_POST['oldPassword']) || empty($_POST['newPassword']) || ($_POST['newPassword'] != $_POST['confirmNewPassword'])) {
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Переданные данные не корректны'
        )
    );
    exit();
}
if (!InputValidator::validatePassword($_POST['newPassword']) || !InputValidator::validatePassword($_POST['oldPassword'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => InputValidator::PASSWORD_REQUIREMENTS
        )
    );
    exit();
}
echo json_encode(DBPlayerSettingsChanger::changePassword(PLAYER_ID, $_POST['oldPassword'], $_POST['newPassword']));
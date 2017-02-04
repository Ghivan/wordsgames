<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
define('PASSWORD_MIN_LENGTH', 6);

if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
require_once MAIN_DIR . "/login/includes/auth.php";
require_once(MAIN_DIR . '/_config/config.php');
require_once(MAIN_DIR . '/_includes/database.php');
header('Content-Type: application/json');

if (!checkLogin()){
    echo json_encode(
        array(
            'state' => false,
            'errorMessage' => 'Логин или пароль введены неправильно'
        )
    );
    exit();
}

if (!isset($_POST['oldPassword']) || !isset($_POST['newPassword']) || ($_POST['newPassword'] != $_POST['confirmNewPassword']) || (mb_strlen($_POST['newPassword']) < PASSWORD_MIN_LENGTH)){
    echo json_encode(
        array(
            'state' => false,
            'errorMessage' => 'Переданные данные не корректны'
        )
    );
    exit();
}

class PasswordChanger{
    private $db;

    private $userId;
    private $newHash;
    private $oldPassword;

    public $state;
    public $errorMessage ='';

    function __construct(string $oldPassword, string $newPassword)
    {
        $this-> db = new Database();
        $this->oldPassword = $oldPassword;
        $this->userId = $_SESSION['pl_id'];
        $this->newHash =  password_hash($newPassword, PASSWORD_DEFAULT);

        if (!$this->checkPassword()){
            $this->errorMessage = 'Старый пароль введен не верно';
            $this->state = false;
            return;
        }



        if ($this->updatePassword()){
            $this->state = true;
            return;
        } else {
            $this->errorMessage = 'Ошибка обновления пароля в базе данных (пароль не изменен)!';
            $this->state = false;
            return;
        }
    }

    private function checkPassword(){
        $userData = $this->db->execQuery("SELECT `password` FROM `players` WHERE `id` = :userId", array(
            ':userId' => $this->userId,
        ));

        return password_verify($this->oldPassword, $userData[0]['password']);
    }

    private function updatePassword(){
        $updateAttempt = $this->db->changeDataQuery("UPDATE `players` SET `password` = :password WHERE `id` = :userId", array(
            ':userId' => $this->userId,
            ':password' => $this->newHash,
        ));

        return ($updateAttempt > 0);
    }
}
try{
    $passwordAttempt = new PasswordChanger($_POST['oldPassword'], $_POST['newPassword']);
    echo json_encode(array(
        'state' => $passwordAttempt->state,
        'message' => $passwordAttempt->errorMessage
    ));
} catch (Exception $e){
    echo $e->getMessage();
}
<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

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
            'message' => 'Логин или пароль введены неправильно'
        )
    );
    exit();
}

class LoginUpdate{
    private $db;
    public $errorMessage ='';
    public $state;

    function __construct($newLogin)
    {
        if (!preg_match(LOGIN_REGEXP, $newLogin)){
            $this->state = false;
            $this->errorMessage = 'Логин должен состоять из букв, цифр, дефисов и подчёркиваний, от 3 до 16 символов.';
            return;
        }

        $this->db = new DB();

        if ($this->checkUserExistance($newLogin)){
            $this->errorMessage = 'Пользователь с таким именем уже зарегистрирован';
            $this->state = false;
            return;
        }

        if ($this->updateLogin($newLogin, $_SESSION['pl_id'])){
            $this->state = true;
        } else {
            $this->state = false;
            $this->errorMessage = 'Ошибка при обновлении логина';
        };
    }

    private function updateLogin($newLogin, $userId){
        $updateData = $this->db->changeDataQuery("UPDATE `players` SET `login`=:login WHERE  `id`=:userId", array(
            ':login' => $newLogin,
            ':userId' => $userId
        ));

        return ($updateData>0) ? true : false;
    }

    private function checkUserExistance($user){
        $userData = $this->db->execQuery("SELECT `id` FROM `players` WHERE `login` = :user", array(
            ':user' => $user,
        ));

        return !empty($userData);
    }
}

try{
    $loginAttempt = new LoginUpdate($_POST['login']);
    echo json_encode(array(
        'state' => $loginAttempt->state,
        'message' => $loginAttempt->errorMessage
    ));
} catch (Exception $e){
    echo $e->getMessage();
}


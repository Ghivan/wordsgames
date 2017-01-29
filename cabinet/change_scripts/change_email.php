<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
require_once MAIN_DIR . "/login/includes/auth.php";
require_once(MAIN_DIR  . '/_config/config.php');
require_once(MAIN_DIR  . '/_includes/database.php');
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

class EmailUpdate{
    private $db;
    public $errorMessage ='';
    public $state;

    function __construct($newEmail)
    {
        if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)){
            $this->errorMessage = 'Электронная почта введена некорректно';
            $this -> state = false;
            return;
        }

        $this->db = new Database();

        if ($this->checkEmailExistance($newEmail)){
            $this->errorMessage = 'Пользователь с такoй электронной почтой уже зарегистрирован';
            $this->state = false;
            return;
        }

        if ($this->updateEmail($newEmail, $_SESSION['pl_id'])){
            $this->state = true;
        } else {
            $this->state = false;
            $this->errorMessage = 'Ошибка при обновлении логина';
        };
    }

    private function updateEmail($newEmail, $userId){
        $updateData = $this->db->chageDataQuery("UPDATE `players` SET `email`=:email WHERE  `id`=:userId", array(
            ':email' => $newEmail,
            ':userId' => $userId
        ));

        return ($updateData>0) ? true : false;
    }

    private function checkEmailExistance($email){
        $userData = $this->db->execQuery("SELECT `id` FROM `players` WHERE `email` = :email", array(
            ':email' => $email,
        ));

        return !empty($userData);
    }
}

try{
    $updateAttempt = new EmailUpdate($_POST['email']);
    echo json_encode(array(
        'state' => $updateAttempt->state,
        'message' => $updateAttempt->errorMessage
    ));
} catch (Exception $e){
    echo $e->getMessage();
}


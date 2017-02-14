<?php
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

header('Content-Type: application/json');
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);


require_once(MAIN_DIR  . '/_config/config.php');
require_once(MAIN_DIR  . '/_includes/database.php');

if (!isset($_POST['submit']) || !isset($_POST['login']) || !isset($_POST['pswrd'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Логин или пароль введены неправильно'
        )
    );
    exit();
}

class Login{
    private $db;
    public $errorMessage ='';
    public $state;

    function __construct($user, $password)
    {
        $this->db = new DB();

        if (!preg_match(LOGIN_REGEXP, $user)){
            $this->state = false;
            $this->errorMessage = 'Логин должен состоять только из букв, цифр, дефисов и подчёркиваний, от 3 до 16 символов.';
            return;
        }

        if (!preg_match(PASSWORD_REGEXP, $password)){
            $this->state = false;
            $this->errorMessage = 'Пароль должен состоять только из букв, цифр, дефисов и подчёркиваний, от 6 до 16 символов.';
            return;
        }

        $userId = $this->getUserId($user, $password);

        if (isset($userId)){
            $_SESSION['pl_id'] = $userId;
            $this -> state = true;
        } else {
            $this -> state = false;
            $this->errorMessage = 'Логин или пароль введены неправильно';
        }
    }

    private function getUserId(string $user, string $password){

        $userRegData = $this->db->execQuery("SELECT `id`,`password` FROM `players` WHERE `login` = :user", array(
            ':user' => $user,
        ));

        if (empty($userRegData)){
            return null;
        }

        $userRegData = $userRegData[0];

        if (password_verify($password, $userRegData['password'])) {

            if (password_needs_rehash($userRegData['password'], PASSWORD_DEFAULT)) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $userRegData = $this->db->execQuery("UPDATE `players` SET `password` = :password WHERE `login` = :user", array(
                    ':user' => $user,
                    ':password' => $newHash
                ));
            }

            return $userRegData['id'];
        } else {
            return null;
        }
    }
}

try{
    $loginAttempt = new Login($_POST['login'], $_POST['pswrd']);
    echo json_encode(array(
        'state' => $loginAttempt->state,
        'message' => $loginAttempt->errorMessage
    ));
} catch (Exception $e){
    echo $e->getMessage();
}

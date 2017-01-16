<?php
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

header('Content-Type: application/json');
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

define('LOGIN_MIN_LENGTH', 4);
define('PASSWORD_MIN_LENGTH', 6);

require_once(MAIN_DIR  . '/_config/config.php');
require_once(MAIN_DIR  . '/_includes/database.php');

if (!isset($_POST['submit']) || !isset($_POST['login']) || !isset($_POST['pswrd'])){
    echo json_encode(
        array(
            'state' => false,
            'errorMessage' => 'Логин или пароль введены неправильно'
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
        $this->db = new Database();

        if (mb_strlen($user) < LOGIN_MIN_LENGTH || mb_strlen($password) < PASSWORD_MIN_LENGTH){
            $this->errorMessage = 'Недостаточная длина логина или пароля';
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

<?php
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

header('Content-Type: application/json');
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);


require_once(MAIN_DIR  . '/_config/config.php');
require_once(MAIN_DIR  . '/_includes/database.php');

if (!isset($_POST['submit']) || !isset($_POST['login']) || !isset($_POST['pswrd']) || !isset($_POST['cpswrd']) || ($_POST['cpswrd'] != $_POST['pswrd'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Переданные данные не корректны'
        )
    );
    exit();
}

class UserRegistration{
    private $db;

    private $user;
    private $email;
    private $hash;

    public $state;
    public $errorMessage ='';

    function __construct(string $user, string $password, string $email = null)
    {
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

        $this-> db = new DB();
        $this->user =  $user;

        if (!empty($email)){
            $this->email =  filter_var($email, FILTER_VALIDATE_EMAIL) ? filter_var($email, FILTER_SANITIZE_EMAIL) : null;
        }
        $this->hash =  password_hash($password, PASSWORD_DEFAULT);

        if ($this->checkUserExistance()){
            $this->errorMessage = 'Пользователь с таким именем или электронной почтой уже зарегистрирован';
            $this->state = false;
            return;
        }

        $newUserId = $this->addNewUserToDB();

        if (intval($newUserId)>0){
            $_SESSION['pl_id'] = $newUserId;
            $this->state = true;
        } else {
            $this->state = false;
            $this->errorMessage = 'Ошибка при регистрации';
        }

    }

    private function checkUserExistance(){
        $userData = $this->db->execQuery("SELECT `id` FROM `players` WHERE `login` = :user OR `email` = :email", array(
            ':user' => $this->user,
            ':email' => $this->email
        ));

        return !empty($userData);
    }

    private function addNewUserToDB(){
        $this->db->execQuery("INSERT INTO `players`(`login`, `password`, `email`) VALUES(:user,:password, :email)", array(
            ':user' => $this->user,
            ':password' => $this->hash,
            ':email' => isset($this->email) ? $this->email : ''
        ));

        return $this->db->getLastId();

}
}


try{
    $registrationAttempt = new UserRegistration($_POST['login'], $_POST['pswrd'], isset($_POST['email']) ? $_POST['email'] : null);
    echo json_encode(array(
        'state' => $registrationAttempt->state,
        'message' => $registrationAttempt->errorMessage
    ));
} catch (Exception $e){
    echo $e->getMessage();
}


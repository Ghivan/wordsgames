<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
define('AVATAR_MAX_SIZE', 500);//kilobytes
define('DEFAULT_AVATAR', '/files/images/players/no_avatar.png');

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

if (!isset($_FILES['userAvatar'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Ошибка передачи файла'
        )
    );
    exit();
}

class ChangeAvatar{
    private $db;
    public $errorMessage ='';
    public $state;
    public $newSRC = '/files/images/players/no_avatar.png';

    function __construct( $newAvatar)
    {
        $allowedTypes = [ 'image/png', 'image/jpeg'];
        $detectedType = mime_content_type($newAvatar['tmp_name']);

        if (!in_array($detectedType,$allowedTypes)){
            $this->errorMessage = 'Неверное расширение файла: требуется только jpg или png.';
            $this -> state = false;
            return;
        }

        if ($newAvatar['size'] > AVATAR_MAX_SIZE*1024){
            $this->errorMessage = 'Файл больше ' . AVATAR_MAX_SIZE . ' KB';
            $this -> state = false;
            return;
        }

        $this->db = new Database();

        $newPath = $this->downloadNewAvatar($newAvatar);

        if ($newPath){
           $this->db->changeDataQuery('UPDATE `players` SET `avatar` = :newPath WHERE `id` = :userId', array(
                ':newPath' => $newPath,
                ':userId' => $_SESSION['pl_id']
            ));

            $this->newSRC = $newPath;
            $this->state = true;
        }
    }

    private function downloadNewAvatar($newAvatar){
        $ext = pathinfo($newAvatar['name'], PATHINFO_EXTENSION);
        $path = '/files/images/players/'.$_SESSION['pl_id'] . '.' . $ext;

        $oldAvatar = $this->db->execQuery('SELECT `avatar` FROM `players` WHERE `id` = :userId', array(
            ':userId' => $_SESSION['pl_id']
        ));

        if ($oldAvatar[0]['avatar'] != DEFAULT_AVATAR && file_exists(MAIN_DIR . $oldAvatar[0]['avatar'])){
            unlink(MAIN_DIR . $oldAvatar[0]['avatar']);
        }

        if (!move_uploaded_file($newAvatar['tmp_name'], MAIN_DIR . $path)){
            $this->state =  false;
            $this->errorMessage = 'Ошибка при загрузке файла';
            return false;
        } else {
            return $path;
        }
    }
}




try{
    $avatarAttempt = new ChangeAvatar( $_FILES['userAvatar']);
    echo json_encode(array(
        'state' => $avatarAttempt->state,
        'message' => $avatarAttempt->errorMessage,
        'src' => $avatarAttempt->newSRC
    ));
} catch (Exception $e){
    echo $e->getMessage();
}


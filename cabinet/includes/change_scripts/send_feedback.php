<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
define('WAIT_SENDMESSAGE_TIME', 30);

if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}
require_once(MAIN_DIR  . '/login/includes/auth.php');
if (!checkLogin()){
    header('Location: /login/');
    exit;
}
header('Content-Type: application/json');

if (empty($_POST['player']) || empty($_POST['player-email']) || empty($_POST['subject']) || empty($_POST['message-header']) || empty($_POST['message-body'])){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Переданные данные не корректны!'
        )
    );
    exit();
}

$curTime = time();
if (isset($_SESSION['SEND_MAIL_TIME'])) {
    $delta = floor(($curTime - $_SESSION['SEND_MAIL_TIME']) / 60);
    if ($delta < WAIT_SENDMESSAGE_TIME) {
        echo json_encode(
            array(
                'state' => false,
                'message' => 'Отправка сообщений возможна только раз в ' . WAIT_SENDMESSAGE_TIME . ' минут. Следующее сообщение можно отправить через '. (WAIT_SENDMESSAGE_TIME - $delta). ' минут.'
            )
        );
        exit();
    }
}else {
    $_SESSION['SEND_MAIL_TIME'] = $curTime;
}


require_once(MAIN_DIR  . '/_config/config.php');
require_once (MAIN_DIR  . '/_includes/database.php');

$to = 'admin@wordsgames.by';

$subject = strip_tags($_POST['subject']).': '.strip_tags($_POST['message-header']);

$message =  'Id игрока: ' .
    $_SESSION['pl_id'] .
    '. Имя/Логин игрока: ' .
    strip_tags($_POST['player']) . ".\r\n" .
    htmlspecialchars($_POST['message-body']);
$message = wordwrap($message, 70, "\r\n", true);

$contentType = "Content-Type: text/html; charset=UTF-8";
$fromEmail = (filter_var($_POST['player-email'], FILTER_VALIDATE_EMAIL)) ? $_POST['player-email'] : 'admin@wordsgames.by';
$from = 'From: =?UTF-8?Q?'. strip_tags($_POST['player']). '?= <'. $fromEmail . '>';
$date= 'Date: '. date('r', time());
$headers = $contentType. "\r\n" . $date . "\r\n" . $from;

if (mail($to,$subject,$message,$headers)){
    $_SESSION['SEND_MAIL_TIME'] = $curTime;
    echo json_encode(
        array(
            'state' => true,
            'message' => 'Сообщение успешно отправлено!'
        )
    );
    exit();
} else {
    unset($_SESSION['SEND_MAIL_TIME']);
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Сообщение не отправлено (ошибка почтового сервера)!'
        )
    );
    exit();
}

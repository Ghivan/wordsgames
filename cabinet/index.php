<?php
if (session_status() !== PHP_SESSION_ACTIVE){
    session_start();
}

define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
require_once(MAIN_DIR  . '/login/includes/auth.php');
if (!checkLogin()){
    header('Location: /login/');
}

require_once(MAIN_DIR  . '/_config/config.php');
require_once (MAIN_DIR  . '/_includes/database.php');
require_once "includes/model.php";
require_once "includes/view.php";
require_once "includes/controller.php";

$controller = new Controller();
?>

<!DOCTYPE html>

<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="/_libraries/bootstrap/bootstrap.min.css">
    <script src="/_libraries/jquery-3.1.1.min.js"></script>
    <script src="/_libraries/bootstrap/bootstrap.min.js"></script>
    <script src="js/cabinet.js?ver=9"></script>
    <link rel="stylesheet" href="/cabinet/css/style.css?ver=0.2">

    <title>Личный кабинет</title>
</head>

<body>
<div class="container">
    <div class="row">
        <div class="col-xs-4 col-sm-3 player-info">
            <?php
            $controller->printUserInfoBlock();
            ?>


            <ul class="nav nav-pills nav-stacked affix"
                data-offset-top = "350"
                data-spy="affix">

                <li role="presentation" class="active">
                    <a href="#game-list"
                       data-toggle="tab">
                        Каталог игр
                    </a>
                </li>

                <li role="presentation">
                    <a href="#profile-configure"
                       data-toggle="modal">
                        Настройки профиля
                    </a>
                </li>

                <li role="presentation">
                    <a href="#feedback"
                       data-toggle="tab">
                        Обратная связь
                    </a>
                </li>

                <li>
                    <a href="/" id="unregister">
                        Выход
                    </a>
                </li>

            </ul>

        </div>
        <div class="col-xs-8 col-sm-9 game-catalog tab-content">
           <?php include_once 'includes/tabs/game_list.php';?>
           <?php include_once 'includes/tabs/profile_configure.php';?>
           <?php include_once 'includes/tabs/feedback.php';?>
        </div>
    </div>
    
    <div id="loader">
        <img src="/files/images/loading.gif" alt="Загрузка...">
    </div>

    <script>


        $('document').ready(function () {

            setTimeout(function () {
                let nav = $('.nav')[0],
                    offset = $(nav).offset().top;
                nav.setAttribute('data-offset-top', offset);
            }, 1000);



            $('#unregister').on('click', function (e) {
                e.preventDefault();
                e.cancelBubble =true;
                e.stopImmediatePropagation();

                $.post("/login/includes/unregister.php", function(data) {
                    if (data.state){
                        window.location.href = '/login/';
                    } else {
                        alert('Нет соединения с сервером!');
                    }
                })
            });
        });


    </script>
</body>

</html>


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
    <link rel="stylesheet" href="/cabinet/css/style.css?ver0.3">

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
                       data-toggle="tab">
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
            <div class="container-fluid tab-pane active in fade" id="game-list">
                <div class="row">
                    <div class="h1 center-block text-center">
                        Доступные игры
                    </div>
                </div>

                <div class="row game-search">
                    <div class="form-horizontal col-md-5 col-md-offset-7">

                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>
                            <input type="password" id="gm-search" name="gm-search" class="form-control" placeholder="Поиск по играм..." required>
                        </div>

                    </div>
                </div>

                <?php
                $controller->printGameBox();
                ?>
            </div>
            <div class="container-fluid tab-pane fade" id="profile-configure">
                Настройки профиля
            </div>
            <div class="container-fluid tab-pane fade" id="feedback">
                Обратная связь
            </div>

        </div>
    </div>
</body>

</html>


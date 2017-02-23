<?php
session_start();
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);

include_once MAIN_DIR . '/_app_files/_includes/autoloaders.php';
function cabinet_class_autoloader($class) {
    $path = $path = $_SERVER['DOCUMENT_ROOT'] . '/cabinet/server_scenarios/classes/' . $class . '.php';
    if (file_exists($path)){
        include_once $path;
    }
}
spl_autoload_register('cabinet_class_autoloader');


if (!Authorization::check()) {
    header('Location: /login/');
    exit();
}

$controller = new Controller();
?>
<!DOCTYPE html>

<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Личный кабинет игрока. Доступ к каталогу игр и настройкам профиля" />
    <meta property="og:type" content="Личный кабинет пользователя" />

    <link rel="stylesheet" href="/_app_files/libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/cabinet/css/style.css">
    <title>Личный кабинет</title>
    <script src="/_app_files/libraries/jquery-3.1.1.min.js"></script>
    <script src="/_app_files/libraries/bootstrap/bootstrap.min.js"></script>
    <script src="js/app.js"></script>
</head>

<body>
<div id="loader">
    <img src="/_app_files/images/loading.gif" alt="Загрузка...">
</div>
<div class="container">
    <div class="row">
        <div class="col-xs-4 col-sm-3 player-info">

            <?php
            Controller::printUserInfoBlock();
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
                       data-toggle="modal"
                       id="profile-configure-btn">
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
            <?php Templator::includeTab('game_list'); ?>
            <?php Templator::includeTab('profile_configure');?>
            <?php Templator::includeTab('feedback'); ?>
        </div>
    </div>
</body>
</html>

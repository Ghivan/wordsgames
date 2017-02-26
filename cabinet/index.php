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
header('Cache-Control: max-age=0, must-revalidate');

$controller = new Controller();
?>
<!DOCTYPE html>
<html>
<head>
    <?php include_once $_SERVER['DOCUMENT_ROOT'] . '/_app_files/_includes/head_meta_tags.php' ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Личный кабинет игрока. Доступ к каталогу игр и настройкам профиля" />
    <meta property="og:type" content="Личный кабинет пользователя" />
    <link rel="stylesheet" href="/_app_files/libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/cabinet/css/style.css?ver=19">

    <title>Личный кабинет</title>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-91641758-1', 'auto');
        ga('send', 'pageview');

    </script>
    <script type=text/javascript>(function(g,a,i){(a[i]=a[i]||[]).push(function(){try{a.yaCounter42700799=new Ya.Metrika({id:42700799,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true})}catch(c){}});var h=g.getElementsByTagName("script")[0],b=g.createElement("script"),e=function(){h.parentNode.insertBefore(b,h)};b.type="text/javascript";b.async=true;b.src="https://mc.yandex.ru/metrika/watch.js";if(a.opera=="[object Opera]"){g.addEventListener("DOMContentLoaded",e,false)}else{e()}})(document,window,"yandex_metrika_callbacks");</script>
</head>
<body>
<noscript><div><img src=https://mc.yandex.ru/watch/42700799 style=position:absolute;left:-9999px alt /></div></noscript>
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
    <script src="/_app_files/libraries/jquery-3.1.1.min.js"></script>
    <script src="/_app_files/libraries/bootstrap/bootstrap.min.js"></script>
    <script src="js/app.js?ver=19"></script>
</body>
</html>

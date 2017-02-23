<?php
define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
include_once MAIN_DIR . '/_app_files/_includes/autoloaders.php';
if (Authorization::check()) {
    header('Location: /cabinet/');
    exit();
}
?>
<!DOCTYPE html>

<html>

<head>
    <?php include_once MAIN_DIR . '/_app_files/_includes/head_meta_tags.php' ?>
    <link rel="stylesheet" href="/_app_files/libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/login/css/style.css?ver2.34">

    <meta property="og:url" content="http://www.wordsgames.by/" />
    <meta property="og:image" content="http://www.wordsgames.by/favicon/android-chrome-192x192.png" />
    <meta property="og:description" content="Тематический сборник различных игр, направленных на развитие словарного запаса и расширение кругозора." />
    <meta property="og:site_name" content="Игровой сайт 'Игры со словами'" />
    <meta property="og:type" content="Страница авторизации" />

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Регистрация на игровом сайте 'Игра со словами'." />
    <title>Регистрация</title>

</head>

<body>

<!--Контейнер-->
<div class="container">
    <div class="panel-container">
        <!--Кнопки переключения режима панели-->
        <div>
            <ul class="nav nav-tabs">
                <li class="active"><a href="#login" data-toggle="tab">Вход</a></li>
                <li><a href="#register" data-toggle="tab">Регистрация</a></li>
            </ul>
        </div>
        <!--Панель-->
        <div class="panel panel-default">

            <!--Заголовок-->
            <div class="panel-header">
                <h1>Игры со словами</h1>
                <div class="alert alert-danger hidden" role="alert" id="registerError">
                    <strong>Ошибка! </strong><span id="global-error-message"></span>
                </div>
            </div>


            <!--Содержимое панели (основное)-->
            <div class="panel-body tab-content clearfix">

                <!--Режим входа-->
                <div class="tab-pane in fade active" id="login">

                    <!--Форма входа-->
                    <form id="login-form" class="form-horizontal">

                        <!--Ввод логина-->
                        <div class="form-group">
                            <label for="user">Введите логин:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                                <input type="text" class="form-control" id="user" placeholder="Логин..." required>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="enter-login-error"></div>
                        </div>

                        <!--Ввод пароля-->
                        <div class="form-group">
                            <label for="pswrd">Введите пароль:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                <input type="password" class="form-control" id="pswrd" placeholder="Пароль..." required>
                                <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="enter-pswrd-error"></div>
                        </div>

                        <!--Кнопка входа-->
                        <input type="button" class="btn center-block" id="login-button" value="Войти">

                    </form>

                </div>
                <!--Конец режима входа-->

                <!--Режим регистрации-->
                <div class="tab-pane" id="register">

                    <!--Регистрационная форма-->
                    <form id="register-form" class="form-horizontal">

                        <!--Ввод логина-->
                        <div class="form-group">
                            <label for="new-user">Придумайте логин:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                                <input type="text" class="form-control" id="new-user" placeholder="Логин..." required>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="register-login-error"></div>
                        </div>

                        <!--Ввод пароля-->
                        <div class="form-group">
                            <label for="new-pswrd">Придумайте пароль:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                <input type="password" class="form-control" id="new-pswrd" placeholder="Пароль..." required>
                                <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="register-pswrd-error"></div>
                        </div>

                        <!--Повтор пароля-->
                        <div class="form-group">
                            <label for="c-new-pswrd">Повторите пароль:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                                <input type="password" class="form-control" id="c-new-pswrd" placeholder="Повтор пароля..." required>
                                <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="register-cpswrd-error"></div>
                        </div>

                        <!--Ввод электронной почты-->
                        <div class="form-group">
                            <label for="new-email">Введите Ваш email:</label>
                            <div class="input-group">
                                <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                                <input type="email" class="form-control" id="new-email" placeholder="example@gmail.com">
                                <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                                <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                            </div>
                            <div class="help-block text-center text-danger" id="register-email-error"></div>
                        </div>

                        <!--Кнопка регистрации-->
                        <input type="button" class="btn center-block" id="register-button" value="Зарегистрироваться">

                    </form>
                    <!--Конец регистрационной формы-->
                </div>
                <!--Конец режима регистрации-->
            </div>
            <!--Конец содержимого панели (основного)-->

        </div>
        <!--Конец панели-->
    </div>

</div>
<!--Конец контейнера-->


</body>

</html>

<script src="/_app_files/libraries/jquery-3.1.1.min.js"></script>
<script src="/_app_files/libraries/bootstrap/bootstrap.min.js"></script>
<script src="js/reg.js"></script>
<script>(function(d,e,j,h,f,c,b){d.GoogleAnalyticsObject=f;d[f]=d[f]||function(){(d[f].q=d[f].q||[]).push(arguments)},d[f].l=1*new Date();c=e.createElement(j),b=e.getElementsByTagName(j)[0];c.async=1;c.src=h;b.parentNode.insertBefore(c,b)})(window,document,"script","https://www.google-analytics.com/analytics.js","ga");ga("create","UA-91641758-1","auto");ga("send","pageview");</script>
<script type=text/javascript>(function(g,a,i){(a[i]=a[i]||[]).push(function(){try{a.yaCounter42700799=new Ya.Metrika({id:42700799,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true})}catch(c){}});var h=g.getElementsByTagName("script")[0],b=g.createElement("script"),e=function(){h.parentNode.insertBefore(b,h)};b.type="text/javascript";b.async=true;b.src="https://mc.yandex.ru/metrika/watch.js";if(a.opera=="[object Opera]"){g.addEventListener("DOMContentLoaded",e,false)}else{e()}})(document,window,"yandex_metrika_callbacks");</script>
<noscript><div><img src=https://mc.yandex.ru/watch/42700799 style=position:absolute;left:-9999px alt /></div></noscript>
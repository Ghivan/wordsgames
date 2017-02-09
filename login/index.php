<?php

define('MAIN_DIR', $_SERVER['DOCUMENT_ROOT']);
require_once MAIN_DIR . "/login/includes/auth.php";

if (checkLogin()){
    header('Location: /cabinet/');
}
?>

<!DOCTYPE html>

<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Регистрация на игровом сайте 'Игра со словами'." />
    <meta property="og:type" content="Страница авторизации" />
    <title>Регистрация</title>
    <link rel="stylesheet" href="/_libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/login/css/style.css?ver2.34">
    <?php include_once MAIN_DIR . '/_config/links_amd_meta.php'?>
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
<script src="/_libraries/jquery-3.1.1.min.js"></script>
<script src="/_libraries/bootstrap/bootstrap.min.js"></script>
<script src="/login/js/reg.js"></script>
</body>

</html>
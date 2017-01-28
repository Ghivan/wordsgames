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

    <link rel="stylesheet" href="/_libraries/bootstrap/bootstrap.min.css">

    <script src="/_libraries/jquery-3.1.1.min.js"></script>
    <script src="/_libraries/bootstrap/bootstrap.min.js"></script>

    <link rel="stylesheet" href="/login/css/style.css?ver0.17">

    <script src="/login/js/register.js?ver0.19"></script>
    <title>Регистрация</title>

</head>

<body>

<!--Контейнер-->
<div class="container">
    <div class="panel-container">
    <!--Кнопки переключения режима панели-->
    <div class="panel-header">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#login" data-toggle="tab">Вход</a></li>
            <li><a href="#register" data-toggle="tab">Регистрация</a></li>
        </ul>
    </div>
<!--Панель-->
    <div class="panel panel-default">

        <!--Заголовок-->
        <h1>Игры со словами</h1>

        <!--Содержимое панели (основное)-->
        <div class="panel-body tab-content clearfix">

            <!--Режим входа-->
            <div class="tab-pane in fade active" id="login">

                <!--Форма входа-->
                <form id="login-form" class="form-horizontal">

                    <!--Ввод логина-->
                    <div>
                        <div class="input-group">
                            <label for="user"  class="sr-only">Введите логин</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                            <input type="text" class="form-control" id="user" placeholder="Введите логин..." required>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Ввод пароля-->
                    <div>
                        <div class="input-group">
                            <label for="pswrd"  class="sr-only">Введите пароль</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            <input type="password" class="form-control" id="pswrd" placeholder="Введите пароль..." required>
                            <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Кнопка входа-->
                    <input type="button" class="btn btn-block" id="login-button" value="Войти">

                </form>

            </div>
            <!--Конец режима входа-->

            <!--Режим регистрации-->
            <div class="tab-pane" id="register">

                <!--Регистрационная форма-->
                <form id="register-form" class="form-horizontal">

                    <!--Ввод логина-->
                    <div>
                        <div class="input-group">
                            <label for="new-user"  class="sr-only">Придумайте логин</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-user"></span></span>
                            <input type="text" class="form-control" id="new-user" placeholder="Придумайте логин..." required>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Ввод пароля-->
                    <div>
                        <div class="input-group">
                            <label for="new-pswrd"  class="sr-only">Придумайте пароль</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            <input type="password" class="form-control" id="new-pswrd" placeholder="Придумайте пароль..." required>
                            <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Повтор пароля-->
                    <div>
                        <div class="input-group">
                            <label for="c-new-pswrd" class="sr-only">Повторите пароль</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></span>
                            <input type="password" class="form-control" id="c-new-pswrd" placeholder="Повторите пароль..." required>
                            <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Ввод электронной почты-->
                    <div>
                        <div class="input-group">
                            <label for="new-email"  class="sr-only">Введите Ваш email</label>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></span>
                            <input type="email" class="form-control" id="new-email" placeholder="Введите Ваш email..." required>
                            <span class="glyphicon glyphicon-ok form-control-feedback hidden"></span>
                            <span class="glyphicon glyphicon-alert form-control-feedback hidden"></span>
                        </div>
                        <span class="help-block text-center text-danger hidden">Текст ошибки</span>
                    </div>

                    <!--Кнопка регистрации-->
                    <input type="button" class="btn btn-block" id="register-button" value="Зарегистрироваться">

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
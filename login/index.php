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
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-M34HVNK');</script>
    <!-- End Google Tag Manager -->
    <link rel="stylesheet" href="/_app_files/libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/login/css/style.css?ver=28">
    <title>Игры со словами</title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Игровой сайт «Игры со словами» представляет собой платформу для размещения игр соответствующей тематики. Зарегистрированные игроки имеют доступ к имеющимся на ресурсе играм, а также участвуют в рейтинге, формируемом на основе игрового уровня пользователя. Опыт набирается в результате прохождения различных игр и выполнения определенных задач. Администрация ресурса рассматривает возможность некоммерческого сотрудничества с разработчиками, желающими поучаствовать в развитиии ресурса либо продемонстрировать свои наработки, соответствующие тематике ресурса. За дополнительной информацией обращайтесь по электронной почте: admin@wordsgames.by" />
    <script type="application/ld+json">
    {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "description": "Игровой сайт «Игры со словами» представляет собой платформу для размещения игр соответствующей тематики. Зарегистрированные игроки имеют доступ к имеющимся на ресурсе играм, а также участвуют в рейтинге, формируемом на основе игрового уровня пользователя. Опыт набирается в результате прохождения различных игр и выполнения определенных задач. Администрация ресурса рассматривает возможность некоммерческого сотрудничества с разработчиками, желающими поучаствовать в развитиии ресурса либо продемонстрировать свои наработки, соответствующие тематике ресурса.",
    "url": "https://wordsgames.by/login/",
    "author" : {
    "@type": "Person",
    "email": "admin@wordsgames.by"
    }
    }
    </script>

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
<!-- Google Tag Manager (noscript) -->
<noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M34HVNK"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>
    <!-- End Google Tag Manager (noscript) -->
    <div><img src=https://mc.yandex.ru/watch/42700799 style=position:absolute;left:-9999px alt /></div>
</noscript>
<div id="fb-root"></div>
<script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.8&appId=763828750438528";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
<script type="text/javascript" src="//vk.com/js/api/openapi.js?139"></script>
<script type="text/javascript">
    VK.init({apiId: 5897034, onlyWidgets: true});
</script>
<!--Контейнер-->
<div class="container">
    <div class="panel-container">
        <!--Кнопки переключения режима панели-->
        <div>
            <ul class="nav nav-tabs">
                <li class="active"><a href="#login" data-toggle="tab">Вход</a></li>
                <li><a href="#register" data-toggle="tab">Регистрация</a></li>
                <li><a href="#about" data-toggle="tab">О проекте</a></li>
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

                <!--Режим О проекте-->
                <div class="tab-pane fade" id="about">

                    <p>Игровой сайт «Игры со словами» представляет собой платформу для размещения игр соответствующей тематики. </p>
                    <p>Зарегистрированные игроки имеют доступ к имеющимся на ресурсе играм, а также участвуют в рейтинге, формируемом на основе игрового уровня пользователя. Опыт набирается в результате прохождения различных игр и выполнения определенных задач.</p>
                    <p>Администрация ресурса рассматривает возможность некоммерческого сотрудничества с разработчиками, желающими поучаствовать в развитиии ресурса либо продемонстрировать свои наработки, соответствующие тематике ресурса.</p>
                    <p>За дополнительной информацией обращайтесь по электронной почте: <a href="mailto:admin@wordsgames.by">admin@wordsgames.by</a></p>
                    <p>Пример игры (без возможности сохранения результатов в базе данных ресурса): <a href="/demo/wfw/index.html" target="_blank">Игра "Слова из слова"</a></p>

                </div>
                <!--Конец о проекте-->
                <div class="social-buttons">

                    <div class="fb-share-button" data-href="https://wordsgames.by/login/" data-layout="button" data-size="small" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwordsgames.by%2Flogin%2F&amp;src=sdkpreparse">Поделиться</a></div>
                    <a class="twitter-share-button"
                       href="https://twitter.com/intent/tweet?text=Сайт%20Игры%20со%20словами&url=https%3A%2F%2Fwordsgames.by%2F"
                       data-size="small">
                        Tweet</a>
                    <div id="vk_like"></div>
                    <script type="text/javascript">
                        VK.Widgets.Like("vk_like", {type: "mini", verb: 1, height: 20});
                    </script>

                </div>
                <script>window.twttr = (function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0],
                            t = window.twttr || {};
                        if (d.getElementById(id)) return t;
                        js = d.createElement(s);
                        js.id = id;
                        js.src = "https://platform.twitter.com/widgets.js";
                        fjs.parentNode.insertBefore(js, fjs);

                        t._e = [];
                        t.ready = function(f) {
                            t._e.push(f);
                        };

                        return t;
                    }(document, "script", "twitter-wjs"));</script>
                <span class="version">v1.0.1</span>

            </div>
            <!--Конец содержимого панели (основного)-->

        </div>
        <!--Конец панели-->
    </div>

</div>
<!--Конец контейнера-->
<script src="/_app_files/libraries/jquery-3.1.1.min.js"></script>
<script src="/_app_files/libraries/bootstrap/bootstrap.min.js"></script>
<script src="js/reg.js?ver=19"></script>

</body>

</html>




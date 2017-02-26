<?php
session_start();
?>
<!doctype HTML>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/_app_files/libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css?ver=19">
    <!-- Twitter Card data -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Слова из слова">
    <meta name="twitter:description" content="Необходимо составлять слова из букв показанного на экране слова. Для перехода на следующий этап необходимо отгадать не менее 30% вариантов слов текущего.
Слово должно быть нарицательным именем существительным в единственном числе. Уменьшительно-ласкательные формы, а также сокращения не принимаются.">
    <meta name="twitter:image" content="https://www.wordsgames.by/_app_files/images/favicon/android-chrome-256x256.jpg">
    <meta name="twitter:creator" content="@bgR8QMqXAIc0ZOW">
    <meta name="twitter:site" content="@bgR8QMqXAIc0ZOW">

    <!-- Open Graph data -->
    <meta property="og:title" content="Игры со словами" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.wordsgames.by/games/wordsFromWord/" />
    <meta property="og:image" content="https://www.wordsgames.by/_app_files/images/favicon/android-chrome-256x256.png" />
    <meta property="og:description" content="Необходимо составлять слова из букв показанного на экране слова. Для перехода на следующий этап необходимо отгадать не менее 30% вариантов слов текущего.
Слово должно быть нарицательным именем существительным в единственном числе. Уменьшительно-ласкательные формы, а также сокращения не принимаются." />
    <meta property="fb:app_id" content="763828750438528" />
    <title>Слова из слова</title>
    <meta name="description" content="Необходимо составлять слова из букв показанного на экране слова. Для перехода на следующий этап необходимо отгадать не менее 30% вариантов слов текущего.
Слово должно быть нарицательным именем существительным в единственном числе. Уменьшительно-ласкательные формы, а также сокращения не принимаются." />
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
            <img src="/_app_files/players_avatars/no_avatar.png" alt="Ваш аватар" class="img-responsive img-circle center-block avatar" id="userAvatar">
            <h2 id="userLoginLabel">Игрок</h2>
            <p class="link-to-cabinet"><a href="/cabinet/">Вернуться в личный кабинет</a></p>

            <div class="tablescore">
                <div>Этап: <span id="level-number">0</span></div>
                <div>Очки: <span id="score-value">0</span></div>
            </div>

            <div class="progress">
                <span>Слов отгадано: <span id="found-words-number">0</span>/<span id="total-words-number">0</span></span>
                <div id="user-progress-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0"> </div>
            </div>

            <div class="level-map-box">
                <div class="label label-info">Карта этапов <span class="glyphicon glyphicon-triangle-bottom"></span></div>
                <div class="btn-group-sm" id="level-buttons-container"></div>
            </div>

            <div class="tips">
                <div class="label label-info">Подсказки <span class="glyphicon glyphicon-triangle-bottom"></span></div>
                <div class="btn-group-sm">
                    <a class="btn">
                        <img id="word-definition-tip" title="Показать определение неотгаданного слова." alt="Показать определение неотгаданного слова." src="images/tips/definition_gray.png" draggable="false">
                    </a>
                    <a class="btn">
                        <img id="hole-word-tip" title="Показать неотгаданное слово целиком." alt="Показать неотгаданное слово целиком." src="images/tips/word_gray.png" draggable="false">
                    </a>
                </div>
            </div>


        </div>


        <div class="col-xs-8 col-sm-9 gamefield">
            <div id="missions-icon" class="row missions">

                <img id="mission1-icon" src="images/missions/incomplete.png" alt="Первая звезда" title="Отгадать больше 40% слов">
                <img id="mission2-icon" src="images/missions/incomplete.png" alt="Вторая звезда">
                <img id="mission3-icon" src="images/missions/incomplete.png" alt="Третья звезда" title="Отгадать 100% слов">
            </div>

            <div id="help-button"><a href="#help-box" data-toggle="modal"><span class="glyphicon glyphicon-question-sign"></span></a> </div>
            <!--Блок помощи-->
            <div id="help-box" class="modal fade">

                <!-- Модальное окно -->
                <div class="modal-dialog">

                    <!--Все содержимое модального окна -->
                    <div class="modal-content">

                        <!-- Заголовок модального окна -->
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 class="modal-title">Помощь</h4>
                        </div>

                        <!-- Основное содержимое мод
                        ального окна -->
                        <div class="modal-body">
                            <div id="help">
                                <h2>Правила</h2>
                                <div class='textGuide'>
                                    <p>Необходимо составлять слова из показанного на экране слова. Слово должно быть нарицательным именем существительным в единственном числе. Уменьшительно-ласкательные формы, а также сокращения не принимаются. Минимальная длина слова&nbsp;&mdash;&nbsp;3&nbsp;буквы. Для перехода на следующий этап необходимо отгадать не менее 30% вариантов слов текущего.</p>
                                </div>
                                <h2>Управление</h2>
                                <div class='textGuide'>
                                    <p>Чтобы выбрать букву, кликните мышкой. Повторный клик по последней выбранной букве снимает выделение.</p>
                                    <p>Клавиша <kbd>Esc</kbd> отменяет ввод всего слова.</p>
                                    <p>Клавиша <kbd>Backspace&nbsp;&#8592;&nbsp;</kbd>  отменяет ввод последней буквы.</p>
                                </div>
                                <h2>Цели этапов</h2>
                                <div class="textGuide">
                                    <p>Первая звезда&nbsp;&mdash;&nbsp;отгадать 40% возможных слов на уровне. Бонус: 1 000 очков.</p>
                                    <p>Вторая звезда&nbsp;&mdash;&nbsp;отгадать три слова, начинающихся на заданную букву (наведите курсор на вторую звезду, чтобы ее узнать). Бонус: 500 очков.</p>
                                    <p>Третья звезда&nbsp;&mdash;&nbsp;отгадать все возможные слова на уровне. Бонус: 10 000 очков.</p>
                                </div>
                                <h2>Подсказки</h2>
                                <div>
                                    <img src="images/tips/definition.png" alt="Показать определение неотгаданного слова.">
                                    <p>Показать определение неотгаданного слова. Стоимость подсказки: 100 очков</p>
                                </div>
                                <div>
                                    <img src="images/tips/word.png" alt="Показать неотгаданное слово целиком.">
                                    <p>Показать неотгаданное слово. Стоимость подсказки: 250 очков.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <!--Конец всего содержимого модального окна -->

                </div>
                <!--Конец модального окна -->

            </div>
            <!--Конец блока помощи-->

            <div id="user-input-word" class="row"></div>

            <div id="user-input-controls-btn" class="row">
                <div id="clear-letter-btn">Стереть букву</div>
                <div id="clear-word-btn">Стереть все слово</div>
            </div>

            <div id="level-main-word" class="row"></div>

            <div id="user-found-words-box" class="row"></div>
        </div>
    </div>
    <!--окно сообщений-->
    <div id="message-modal-box" class="modal fade">

        <!-- Модальное окно -->
        <div class="modal-dialog">

            <!--Все содержимое модального окна -->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 id="message-modal-header">Подсказка</h4>
                </div>

                <!-- Основное содержимое модального окна -->
                <div class="modal-body">

                    <p id="message-modal-content"></p>

                </div>

            </div>
            <!--Конец всего содержимого модального окна -->

        </div>
        <!--Конец модального окна -->

    </div>
    <!--Конец окно сообщений-->
    <script src="/_app_files/libraries/jquery-3.1.1.min.js"></script>
    <script src="/_app_files/libraries/bootstrap/bootstrap.min.js"></script>
    <script src="js/app.js?ver=19"></script>
</div>
</body>
</html>

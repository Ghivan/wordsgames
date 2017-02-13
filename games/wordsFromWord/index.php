<!doctype HTML>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/_libraries/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="style/style.css">
    <title>Слова из слова</title>

</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-xs-4 col-sm-3 player-info">
            <img src="/files/images/players/73.png" alt="Ваш аватар" class="img-responsive img-circle center-block avatar" id="userAvatar">
            <h2 id="userLoginLabel">Alex</h2>

            <div class="tablescore">
                <div>Уровень: <span id="level-number">5</span></div>
                <div>Очки: <span id="score-value">345</span></div>
            </div>

            <div class="progress">
                <span>Слов отгадано: <span id="found-words-number">143</span>/<span id="total-words-number">146</span></span>
                <div id="user-progress-bar" class="progress-bar" role="progressbar" aria-valuenow="52" aria-valuemin="0" aria-valuemax="146" style="width: 95%"> </div>
            </div>

            <div class="menus">

                <div class="level-map-box">
                    <div class="label label-info">Карта уровней</div>
                    <div class="btn-group-sm">
                        <a class="btn btn-info">1</a>
                        <a class="btn btn-info">2</a>
                        <a class="btn btn-info active">3</a>
                        <a class="btn btn-info disabled">4</a>
                    </div>
                </div>

                <div class="tips">
                    <div class="label label-info">Подсказки</div>
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

        </div>
        <div class="col-xs-8 col-sm-9 gamefield">
            <div id="missions-icon" class="row missions">
                <img src="images/missions/incomplete.png" alt="Первая звезда" title="Отгадайте больше 40% слов">
                <img src="images/missions/complete.png" alt="Вторая звезда" title="Отгадайте 3 слова на букву &quot;р&quot;">
                <img src="images/missions/incomplete.png" alt="Третья звезда" title="Отгадайте 100% слов">
            </div>

            <div id="user-input-word" class="row">
                орда
            </div>
            <div id="level-main-word" class="row">
                <span class="active">р</span>
                <span>о</span>
                <span>д</span>
                <span>и</span>
                <span>н</span>
                <span>а</span>
            </div>
            <div id="user-found-words-box" class="row">
                <div class="found-word">род</div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
<script src="/_libraries/bootstrap/bootstrap.min.js"
<script src="js/app.js"></script>

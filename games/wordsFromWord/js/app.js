var Model = (function () {
    function Model(success, error, lvl) {
        this.tipsCost = {
            holeWord: 100,
            wordDefinition: 50
        };
        this.userWord = '';
        var that = this;
        $.ajax({
            url: 'server_scenarios/index.php',
            type: 'post',
            data: {
                'action': 'getInitialInfo',
                'lvl': (lvl) ? lvl : null
            },
            success: function (data) {
                if (data.state) {
                    that.initialize(data);
                    success();
                }
                else {
                    error(data.message);
                }
            },
            error: function () {
                error('Ошибка соединения с сервером');
            }
        });
    }
    Model.prototype.initialize = function (data) {
        this.login = data.login;
        this.avatar = data.avatar;
        this.level = parseInt(data.level);
        this.totalLevelsNumber = parseInt(data.totalLevelsNumber);
        this.levelsPassedNumber = parseInt(data.levelsPassedNumber);
        this.levelWord = data.levelWord;
        this.wordVariants = data.wordVariants;
        this.foundWords = data.foundWords;
        this.score = parseInt(data.score);
        this.missions = data.missions;
        this.missionUnique = data.missionUnique;
    };
    Model.prototype.getUserInfoData = function () {
        return {
            avatar: this.avatar,
            login: this.login,
            level: this.level,
            totalLevelsNumber: this.totalLevelsNumber,
            levelsPassedNumber: this.levelsPassedNumber,
            foundWordsNumber: this.foundWords.length,
            totalWordsNumber: this.wordVariants.length,
            score: this.score,
            tipsState: {
                holeWord: this.score >= this.tipsCost.holeWord,
                wordDefinition: this.score >= this.tipsCost.wordDefinition,
            }
        };
    };
    Model.prototype.getGamefieldData = function () {
        return {
            missions: this.missions,
            levelMainWord: this.levelWord,
            foundWords: this.foundWords,
            missionUnique: this.missionUnique
        };
    };
    Model.prototype.updateUserInputWord = function (word) {
        this.userWord = word;
    };
    Model.prototype.getUserInputWord = function () {
        return this.userWord;
    };
    Model.prototype.checkUserWord = function (word, onAlreadyFound, onNewFound) {
        var model = this;
        if (this.foundWords.indexOf(word) > -1) {
            onAlreadyFound(word);
            return;
        }
        if (this.wordVariants.indexOf(word) > -1) {
            $.ajax({
                url: 'server_scenarios/index.php',
                type: 'post',
                data: {
                    'action': 'checkWord',
                    'userWord': word
                },
                success: function (data) {
                    if (data.state) {
                        model.score = data.score;
                        model.foundWords = data.foundWords;
                        onNewFound({
                            word: data.word,
                            score: data.score,
                            missions: data.missions,
                            foundWordsNumber: data.foundWords.length,
                            lvl_status: data.lvl_status || false
                        });
                    }
                }
            });
        }
    };
    Model.prototype.getCurrentLevel = function () {
        return this.level;
    };
    return Model;
}());
var Loader = (function () {
    function Loader() {
        this.box = $('#loader');
    }
    Loader.prototype.show = function () {
        this.box.show();
    };
    Loader.prototype.hide = function () {
        this.box.hide();
    };
    return Loader;
}());
var PlayerInfo = (function () {
    function PlayerInfo() {
        this.avatar = $('#userAvatar');
        this.loginLabel = $('#userLoginLabel');
        this.scoreLabel = $('#score-value');
        this.levelLabel = $('#level-number');
        this.foundWordsLabel = $('#found-words-number');
        this.totalWordsLabel = $('#total-words-number');
        this.progressBar = $('#user-progress-bar');
        this.levelButtonsContainer = $('#level-buttons-container');
        this.tipHoleWord = $('#hole-word-tip');
        this.tipWordDefinition = $('#word-definition-tip');
    }
    PlayerInfo.prototype.setNewAvatar = function (src) {
        this.avatar.attr('src', src + '?' + Date.now());
    };
    PlayerInfo.prototype.setLoginLabel = function (login) {
        this.loginLabel.text(login);
    };
    PlayerInfo.prototype.setLevelLabel = function (lvlNumber) {
        this.levelLabel.text(lvlNumber);
    };
    PlayerInfo.prototype.setScoreLabel = function (score) {
        this.scoreLabel.text(score);
    };
    PlayerInfo.prototype.setFoundWordsLabel = function (number) {
        this.foundWordsLabel.text(number);
    };
    PlayerInfo.prototype.setTotalWordsLabel = function (number) {
        this.totalWordsLabel.text(number);
    };
    PlayerInfo.prototype.setProgressBar = function (cur, max) {
        if (max) {
            this.progressBar.attr('aria-valuemax', max);
        }
        else {
            max = parseInt(this.progressBar.attr('aria-valuemax'));
        }
        this.progressBar.attr('aria-valuenow', cur);
        this.progressBar.css('width', cur / max * 100 + '%');
    };
    PlayerInfo.prototype.createLevelMap = function (totalLevelsNumber, currentLevel, levelsPassedNumber) {
        this.levelButtonsContainer.html('');
        var _loop_1 = function (i) {
            var lvl = i + 1, button = $('<a class="btn btn-info" id="lvl-btn-' + lvl + '">' + lvl + '</a>');
            button.appendTo(this_1.levelButtonsContainer);
            var lvlBtnClick = new CustomEvent('lvlBtnClick', { detail: lvl });
            button.on('click', function () {
                document.dispatchEvent(lvlBtnClick);
            });
            if (lvl === currentLevel) {
                button.addClass('active');
            }
            if (lvl > levelsPassedNumber + 1) {
                button.addClass('disabled');
            }
        };
        var this_1 = this;
        for (var i = 0; i < totalLevelsNumber; i++) {
            _loop_1(i);
        }
    };
    PlayerInfo.prototype.enableTip = function (tipName) {
        switch (tipName) {
            case 'holeWord':
                this.tipHoleWord.attr('src', 'images/tips/word.png');
                break;
            case 'wordDefinition':
                this.tipWordDefinition.attr('src', 'images/tips/definition.png');
                break;
        }
    };
    PlayerInfo.prototype.disableTip = function (tipName) {
        switch (tipName) {
            case 'holeWord':
                this.tipHoleWord.attr('src', 'images/tips/word_gray.png');
                break;
            case 'wordDefinition':
                this.tipWordDefinition.attr('src', 'images/tips/definition_gray.png');
                break;
        }
    };
    return PlayerInfo;
}());
var Gamefield = (function () {
    function Gamefield() {
        this.star1mission = $('#mission1-icon');
        this.star2mission = $('#mission2-icon');
        this.star3mission = $('#mission3-icon');
        this.userInputWord = $('#user-input-word');
        this.levelMainWord = $('#level-main-word');
        this.userFoundWordsBox = $('#user-found-words-box');
    }
    Gamefield.prototype.showCompleteMission = function (missionNumber) {
        this['star' + missionNumber + 'mission'].attr('src', 'images/missions/complete.png');
    };
    Gamefield.prototype.showIncompleteMission = function (missionNumber) {
        this['star' + missionNumber + 'mission'].attr('src', 'images/missions/incomplete.png');
    };
    Gamefield.prototype.printUserInputWord = function (word) {
        this.userInputWord.text(word);
    };
    Gamefield.prototype.clearUserInputWord = function () {
        this.userInputWord.text('');
    };
    Gamefield.prototype.printMainWordLetters = function (mainWord) {
        this.levelMainWord.html('');
        var _loop_2 = function (i) {
            var letter = $('<span>' + mainWord[i] + '</span>'), letterClick = new CustomEvent('letterClick', { 'detail': letter });
            letter.on('click', function () {
                document.dispatchEvent(letterClick);
            });
            letter.appendTo(this_2.levelMainWord);
        };
        var this_2 = this;
        for (var i = 0; i < mainWord.length; i++) {
            _loop_2(i);
        }
    };
    Gamefield.prototype.clearFoundWordsBox = function () {
        this.userFoundWordsBox.html('');
    };
    Gamefield.prototype.addFoundWord = function (newWord) {
        var value = newWord.text().toLowerCase(), containerId = 'container-per-word-length-' + value.length, container = $('#' + containerId);
        console.log('To insert: ', value);
        if (container.length === 0) {
            container = this.createSubContainer(containerId);
        }
        console.log('Container: ', container);
        var wordToInsertBefore = null, existingWordsCollection = container.children();
        if (existingWordsCollection.length === 0) {
            newWord.appendTo(container);
            console.log('Inserted to: ', container);
            console.log('----------');
            return;
        }
        for (var i = 0; i < existingWordsCollection.length; i++) {
            if (existingWordsCollection[i].id.toLowerCase() > value) {
                wordToInsertBefore = existingWordsCollection[i];
                break;
            }
        }
        if (wordToInsertBefore === null) {
            newWord.appendTo(container);
            console.log('Inserted to: ', container, 'on first position');
            console.log('----------');
        }
        else {
            newWord.insertBefore(wordToInsertBefore);
            console.log('Inserted to: ', container, 'Before: ', wordToInsertBefore);
            console.log('Inserted to: ', container, 'on first position');
            console.log('----------');
        }
    };
    Gamefield.prototype.createSubContainer = function (containerId) {
        var container = $('<div id="' + containerId + '"></div>'), containerToIntsertBefore = null, userFoundWordsBox = this.userFoundWordsBox, collection = userFoundWordsBox.children('[id^=container-per-word-length-]'), newContainerWordsLength = parseInt(containerId.match(/\d/)[0]);
        if (collection.length === 0) {
            container.appendTo(userFoundWordsBox);
        }
        else {
            for (var i = 0; i < collection.length; i++) {
                var existingContainerWordsLength = parseInt(collection[i].id.match(/\d/)[0]);
                if (existingContainerWordsLength > newContainerWordsLength) {
                    containerToIntsertBefore = collection[i];
                    break;
                }
            }
            if (containerToIntsertBefore === null) {
                container.appendTo(userFoundWordsBox);
            }
            else {
                container.insertBefore($(containerToIntsertBefore).prev('label'));
            }
        }
        var label;
        if (newContainerWordsLength % 100 >= 11 && newContainerWordsLength % 100 <= 20) {
            label = ' букв';
        }
        else if (newContainerWordsLength % 10 >= 5 || newContainerWordsLength % 10 === 0) {
            label = ' букв';
        }
        else {
            if (newContainerWordsLength % 10 >= 2) {
                label = ' буквы';
            }
            else {
                if (newContainerWordsLength % 10 === 1) {
                    label = ' буква';
                }
            }
        }
        container.before('<label class="found-words-subcontainer-label">' + newContainerWordsLength + label + '</label>');
        return container;
    };
    Gamefield.prototype.setUniqueMissionTitle = function (mission) {
        for (var letter in mission) {
            if (mission.hasOwnProperty(letter)) {
                var quantity = mission[letter];
                if (quantity % 100 >= 11 && quantity % 100 <= 20) {
                    quantity += ' слов';
                }
                else if (quantity % 10 >= 5 || quantity % 10 === 0) {
                    quantity += ' слов';
                }
                else {
                    if (quantity % 10 >= 2) {
                        quantity += ' слова';
                    }
                    else {
                        if (quantity % 10 === 1) {
                            quantity += ' слово';
                        }
                    }
                }
                this.star2mission.attr('title', 'Отгадайте ' + quantity + ' на букву ' + letter);
            }
        }
    };
    return Gamefield;
}());
var View = (function () {
    function View() {
        this.loader = new Loader();
        this.playerInfo = new PlayerInfo();
        this.gamefield = new Gamefield();
    }
    View.prototype.initializePlayerInfoBox = function (data) {
        this.playerInfo.setNewAvatar(data.avatar);
        this.playerInfo.setLoginLabel(data.login);
        this.playerInfo.setLevelLabel(data.level.toString());
        this.playerInfo.setScoreLabel(data.score);
        this.playerInfo.setFoundWordsLabel(data.foundWordsNumber.toString());
        this.playerInfo.setTotalWordsLabel(data.totalWordsNumber.toString());
        this.playerInfo.setProgressBar(data.foundWordsNumber, data.totalWordsNumber);
        this.playerInfo.createLevelMap(data.totalLevelsNumber, data.level, data.levelsPassedNumber);
        if (data.tipsState.wordDefinition) {
            this.playerInfo.enableTip('wordDefinition');
        }
        if (data.tipsState.holeWord) {
            this.playerInfo.enableTip('holeWord');
        }
    };
    View.prototype.initializeGameField = function (data) {
        for (var prop in data.missions) {
            if (data.missions.hasOwnProperty(prop)) {
                (data.missions[prop]) ? this.showCompleteMissionStateIcon(parseInt(prop)) : this.showIncompleteMissionStateIcon(parseInt(prop));
            }
        }
        this.updateUserInputWord();
        this.gamefield.printMainWordLetters(data.levelMainWord);
        this.gamefield.clearFoundWordsBox();
        if (data.foundWords) {
            for (var i = 0; i < data.foundWords.length; i++) {
                this.addFoundWord(data.foundWords[i]);
            }
        }
        this.gamefield.setUniqueMissionTitle(data.missionUnique);
    };
    View.prototype.updateProgress = function (foundWordsNumber) {
        this.playerInfo.setFoundWordsLabel(foundWordsNumber.toString());
        this.playerInfo.setProgressBar(foundWordsNumber);
    };
    View.prototype.showCompleteMissionStateIcon = function (missionNumber) {
        this.gamefield.showCompleteMission(missionNumber);
    };
    View.prototype.showIncompleteMissionStateIcon = function (missionNumber) {
        this.gamefield.showIncompleteMission(missionNumber);
    };
    View.prototype.updateUserInputWord = function (word) {
        if (word) {
            this.gamefield.printUserInputWord(word);
        }
        else {
            this.gamefield.clearUserInputWord();
        }
    };
    View.prototype.addFoundWord = function (word) {
        var wordBox = $('<div class="found-word" id="' + word + '">' + word + '</div>');
        this.gamefield.addFoundWord(wordBox);
        return wordBox;
    };
    View.prototype.updateScore = function (score) {
        this.playerInfo.setScoreLabel(score);
    };
    View.prototype.setActiveState = function (elem) {
        elem.addClass('active');
    };
    View.prototype.removeActiveState = function (elem) {
        elem.removeClass('active');
    };
    View.prototype.activateLevelLink = function (lvl) {
        $('#lvl-btn-' + lvl).removeClass('disabled');
    };
    return View;
}());
var Controller = (function () {
    function Controller() {
        this.freezeState = false;
        this.view = new View();
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this));
        $(document).on('letterClick', this.onLetterClick.bind(this));
        $(document).on('lvlBtnClick', this.changeLevel.bind(this));
        $(document).on('keydown', this.keyControls.bind(this));
    }
    Controller.prototype.freeze = function () {
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200);
        })(this);
    };
    Controller.prototype.onReceiveInitialData = function () {
        this.view.initializePlayerInfoBox(this.model.getUserInfoData());
        this.view.initializeGameField(this.model.getGamefieldData());
        this.view.loader.hide();
    };
    Controller.prototype.onError = function (message) {
        console.log(message);
        window.location.href = '/login/';
        this.view.loader.hide();
    };
    Controller.prototype.changeLevel = function (e) {
        var lvl = e.detail;
        if (lvl != this.model.getCurrentLevel()) {
            this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this), lvl);
        }
    };
    Controller.prototype.setLvl = function (lvl) {
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this), lvl);
    };
    Controller.prototype.onLetterClick = function (e) {
        if (this.freezeState)
            return;
        this.freeze();
        var letter = e.detail, userWord = this.model.getUserInputWord();
        if (!letter.hasClass('active')) {
            userWord += letter.text();
            letter.data('order', userWord.length);
            this.view.setActiveState(letter);
            this.view.updateUserInputWord(userWord);
            this.model.updateUserInputWord(userWord);
            if (userWord.length >= 3) {
                this.model.checkUserWord(userWord, this.onAlreadyFoundWord.bind(this), this.onNewFoundWord.bind(this));
            }
        }
        else {
            if (letter.data().order === userWord.length) {
                letter.data('order', 0);
                userWord = userWord.substr(0, userWord.length - 1);
                this.view.removeActiveState(letter);
                this.view.updateUserInputWord(userWord);
                this.model.updateUserInputWord(userWord);
            }
        }
    };
    Controller.prototype.onNewFoundWord = function (data) {
        this.showNewFoundWord(data.word);
        this.view.updateProgress(data.foundWordsNumber);
        this.view.updateScore(data.score);
        for (var prop in data.missions) {
            if (data.missions.hasOwnProperty(prop)) {
                if (data.missions[prop]) {
                    this.view.showCompleteMissionStateIcon(parseInt(prop.match(/\d/)[0]));
                }
            }
        }
        if (data.lvl_status) {
            this.view.activateLevelLink(this.model.getCurrentLevel() + 1);
        }
    };
    Controller.prototype.onAlreadyFoundWord = function (word) {
        var wordBox = $('#' + word);
        wordBox.addClass('alreadyFound');
        setTimeout(function () {
            wordBox.removeClass('alreadyFound');
        }, 2000);
    };
    Controller.prototype.showNewFoundWord = function (word) {
        this.view.updateUserInputWord('');
        this.model.updateUserInputWord('');
        $('#level-main-word').children().each(function () {
            var letter = $(this);
            if (letter.hasClass('active')) {
                letter.removeClass('active');
                letter.addClass('rotate');
                setTimeout(function () {
                    letter.removeClass('rotate');
                }, 2000);
            }
        });
        this.view.addFoundWord(word);
        this.onAlreadyFoundWord(word);
    };
    Controller.prototype.keyControls = function (e) {
        if (e.keyCode === 27) {
            this.clearUserInput();
        }
        if (e.keyCode === 8) {
            this.removeLastLetter();
            e.preventDefault();
        }
    };
    Controller.prototype.clearUserInput = function () {
        if (this.model.getUserInputWord().length === 0)
            return;
        $('#level-main-word').children().each(function () {
            var letter = $(this);
            letter.removeClass('active');
            letter.data('order', 0);
        });
        this.view.updateUserInputWord('');
        this.model.updateUserInputWord('');
    };
    Controller.prototype.removeLastLetter = function () {
        var userWord = this.model.getUserInputWord(), controller = this;
        if (userWord.length === 0)
            return;
        var letter = $(this);
        $('#level-main-word').children().each(function () {
            var letter = $(this);
            if (letter.data('order') === userWord.length) {
                controller.view.removeActiveState(letter);
                letter.data('order', 0);
                controller.view.updateUserInputWord(userWord.substr(0, userWord.length - 1));
                controller.model.updateUserInputWord(userWord.substr(0, userWord.length - 1));
            }
        });
    };
    return Controller;
}());
var app = new Controller();
//# sourceMappingURL=app.js.map
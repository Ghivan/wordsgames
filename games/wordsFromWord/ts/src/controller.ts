class Controller{
    private model: Model;
    private view: View;
    private freezeState: boolean = false;

    constructor(){
        this.view = new View();
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this));

        $(document).on('letterClick', this.onLetterClick.bind(this));
        $(document).on('lvlBtnClick',this.changeLevel.bind(this));
        $(document).on('foundWordClick',this.getWordDefinition.bind(this));
        $(document).on('keydown', this.keyControls.bind(this));
    }

    private freeze():void{
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200)
        })(this);
    }

    private getWordDefinition(e: CustomEventInit){
        if (this.freezeState) return;
        this.freeze();
        this.model.getWordDefinition(e.detail, this.view.showMessageInModalBox);
    }

    private onReceiveInitialData(){
        this.view.initializePlayerInfoBox(this.model.getUserInfoData());
        this.view.initializeGameField(this.model.getGamefieldData());
        this.view.loader.hide();
    }

    private onError(message: string){
        console.log(message);
        window.location.href = '/login/';
        this.view.loader.hide();
    }

    private changeLevel(e){
        let lvl = e.detail;
        if (lvl != this.model.getCurrentLevel()){
            this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this), lvl)
        }
    }

    private setLvl(lvl: number){
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this), lvl);

    }

    private onLetterClick(e){
        if (this.freezeState) return;
        this.freeze();
        let letter = e.detail,
            userWord = this.model.getUserInputWord();
        if (!letter.hasClass('active')){
            userWord += letter.text();
            letter.data('order', userWord.length);
            this.view.setActiveState(letter);
            this.view.updateUserInputWord(userWord);
            this.model.updateUserInputWord(userWord);
            if (userWord.length >= 3){
                this.model.checkUserWord(userWord, this.onAlreadyFoundWord.bind(this), this.onNewFoundWord.bind(this), );
            }
        } else {
            if (letter.data().order === userWord.length){
                letter.data('order', 0);
                userWord = userWord.substr(0, userWord.length-1);
                this.view.removeActiveState(letter);
                this.view.updateUserInputWord(userWord);
                this.model.updateUserInputWord(userWord);
            }
        }
    }

    private onNewFoundWord(data: ServerAnswerCheckWord){
        let message = 'Заработано опыта -&nbsp;' + data.experience +
            ', очков -&nbsp;' + data.points + '.<br>';

        this.showNewFoundWord(data.word);

        this.view.updateProgress(data.foundWordsNumber);
        this.view.updateScore(data.score);
        for (let prop in data.missions){
            if (data.missions.hasOwnProperty(prop)){
                if (data.missions[prop]){
                    let missionNumber = parseInt(prop.match(/\d/)[0]);
                    this.view.showCompleteMissionStateIcon(missionNumber);
                    message += 'Выполнена ' + missionNumber + '-я миссия.<br>';
                }
            }
        }

        if (data.lvl_status){
            let nextLevel = this.model.getCurrentLevel() + 1;
            this.view.activateLevelLink(nextLevel);
            message += 'Открыт ' + nextLevel + '-й уровень.';
        }

        this.view.showFloatMessage(message);
    }

    private onAlreadyFoundWord(word: string){
        let wordBox = $('#' + word);
        wordBox.addClass('alreadyFound');
        setTimeout(function(){
            wordBox.removeClass('alreadyFound');
        }, 2000)
    }


    private showNewFoundWord(word){
        this.view.updateUserInputWord('');
        this.model.updateUserInputWord('');
        $('#level-main-word').children().each(function(){
            let letter = $(this);
            if (letter.hasClass('active')){
                letter.removeClass('active');
                letter.addClass('rotate');
                setTimeout(function(){
                    letter.removeClass('rotate');
                }, 2000)
            }
        });
        this.view.addFoundWord(word);
        this.onAlreadyFoundWord(word);
    }

    private keyControls(e: KeyboardEvent){
        if (e.keyCode === 27) {
            this.clearUserInput();
        }

        if (e.keyCode === 8) {
            this.removeLastLetter();
            e.preventDefault();
        }
    }

    private clearUserInput(){
        if (this.model.getUserInputWord().length === 0) return;
        $('#level-main-word').children().each(function(){
            let letter = $(this);
            letter.removeClass('active');
            letter.data('order', 0);
        });
        this.view.updateUserInputWord('');
        this.model.updateUserInputWord('');
    }

    private removeLastLetter(){
        let userWord = this.model.getUserInputWord(),
            controller = this;
        if (userWord.length === 0) return;
        let letter = $(this);
        $('#level-main-word').children().each(function(){
            let letter = $(this);
            if (letter.data('order') === userWord.length){
                controller.view.removeActiveState(letter);
                letter.data('order', 0);
                controller.view.updateUserInputWord( userWord.substr(0, userWord.length-1));
                controller.model.updateUserInputWord( userWord.substr(0, userWord.length-1));
            }
        });
    }

}
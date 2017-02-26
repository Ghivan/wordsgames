class Controller{
    private model: Model;
    private view: View;
    private freezeState: boolean = false;

    constructor(){
        this.view = new View();
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this));

        $(document).on('tipClick',this.useTip.bind(this));
        $(document).on('lvlBtnClick',this.changeLevel.bind(this));
        $(document).on('letterClick', this.onLetterClick.bind(this));
        $(document).on('foundWordClick',this.getWordDefinition.bind(this));
        $(document).on('keydown', this.keyControls.bind(this));

        $('#clear-letter-btn').on('click', this.removeLastLetter.bind(this));
        $('#clear-word-btn').on('click', this.clearUserInput.bind(this));
    }

    private freeze():void{
        this.freezeState = true;
        (function (context) {
            setTimeout(function () {
                context.freezeState = false;
            }, 200)
        })(this);
    }

    private useTip(e: CustomEvent){
        this.model.useTip(e.detail, this.onTipUsed.bind(this), this.onTipFailed.bind(this))
    }

    private onTipUsed(tipResult: string, score: number){
        this.view.updateScore(score);
        if (score < this.model.tipsCost.wordDefinition){
            this.view.disableTip('wordDefinition');
        }
        if (score < this.model.tipsCost.holeWord){
            this.view.disableTip('holeWord');
        }
        this.view.showMessageInModalBox('Подсказка', tipResult);
    }

    private onTipFailed(message: string){
        this.view.showFloatMessage(message, 'danger');
    }

    private getWordDefinition(e: CustomEvent){
        if (this.freezeState) return;
        this.freeze();
        this.model.getWordDefinition(e.detail, this.view.showMessageInModalBox);
    }

    private onReceiveInitialData(): void{
        this.view.initializePlayerInfoBox(this.model.getUserInfoData());
        this.view.initializeGameField(this.model.getGamefieldData());
        this.view.loader.hide();
    }

    private onError(message: string): void{
        console.log(message);
        window.location.href = '/login/';
        this.view.loader.hide();
    }

    private changeLevel(e: CustomEvent): void{
        let lvl = e.detail;
        if (lvl != this.model.getCurrentLevel()){
            this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this), lvl);
        }
    }

    private onLetterClick(e: CustomEvent): void{
        if (this.freezeState) return;
        this.freeze();
        let letter = e.detail,
            userWord = this.model.getUserInputWord();
        if (!letter.hasClass('active')){
            userWord += letter.text();
            letter.data('order', userWord.length);
            this.view.setActiveLetterState(letter);
            this.view.updateUserInputWord(userWord);
            this.model.updateUserInputWord(userWord);
            if (userWord.length >= 3){
                this.model.checkUserWord(userWord, this.onAlreadyFoundWord.bind(this), this.onNewFoundWord.bind(this), );
            }
        } else {
            if (letter.data().order === userWord.length){
                letter.data('order', 0);
                userWord = userWord.substr(0, userWord.length-1);
                this.view.removeActiveLetterState(letter);
                this.view.updateUserInputWord(userWord);
                this.model.updateUserInputWord(userWord);
            }
        }
    }

    private onNewFoundWord(data: ServerAnswerCheckWord): void{
        let message = 'Заработано опыта&nbsp;&mdash;&nbsp;' + data.experience +
            ', очков&nbsp;&mdash;&nbsp;' + data.points + '.<br>';

        this.showNewFoundWord(data.word);

        this.view.updateProgress(data.foundWordsNumber);
        this.view.updateScore(data.score);
        if (data.score >= this.model.tipsCost.wordDefinition){
            this.view.enableTip('wordDefinition');
        }
        if (data.score >= this.model.tipsCost.holeWord){
            this.view.enableTip('holeWord');
        }
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
            this.view.showMessageInModalBox('Новый этап!','Открыт ' + nextLevel + '-й этап.');
        }

        this.view.showFloatMessage(message, 'success');
    }

    private onAlreadyFoundWord(word: string): void{
        let wordBox = $('#' + word);
        wordBox.addClass('alreadyFound');
        setTimeout(function(){
            wordBox.removeClass('alreadyFound');
        }, 2000)
    }


    private showNewFoundWord(word): void{
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

    private clearUserInput(): void{
        if (this.model.getUserInputWord().length === 0) return;
        $('#level-main-word').children().each(function(){
            let letter = $(this);
            letter.removeClass('active');
            letter.data('order', 0);
        });
        this.view.updateUserInputWord('');
        this.model.updateUserInputWord('');
    }

    private removeLastLetter(): void{
        let userWord = this.model.getUserInputWord(),
            controller = this;
        if (userWord.length === 0) return;
        let letter = $(this);
        $('#level-main-word').children().each(function(){
            let letter = $(this);
            if (letter.data('order') === userWord.length){
                controller.view.removeActiveLetterState(letter);
                letter.data('order', 0);
                controller.view.updateUserInputWord( userWord.substr(0, userWord.length-1));
                controller.model.updateUserInputWord( userWord.substr(0, userWord.length-1));
            }
        });
    }

}
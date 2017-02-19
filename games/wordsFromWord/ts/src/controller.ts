class Controller{
    private model: Model;
    private view: View;
    private freezeState: boolean = false;

    constructor(){
        this.view = new View();
        this.model = new Model(this.onReceiveInitialData.bind(this), this.onError.bind(this));

        $(document).on('letterClick', this.onLetterClick.bind(this));
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

    private onReceiveInitialData(){
        this.view.initializePlayerInfoBox(this.model.getUserInfoData());
        this.view.initializeGameField(this.model.getGamefieldData());
        this.view.loader.hide();
    }

    private onError(message: string){
        console.log(message);
        this.view.loader.hide();
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
        this.clearUserInput();
        this.view.addFoundWord(data.word);
        this.view.updateProgress(data.foundWordsNumber);
        this.view.updateScore(data.score);
        for (let prop in data.missions){
            if (data.missions.hasOwnProperty(prop)){
               if (data.missions[prop]){
                   this.view.showCompleteMissionStateIcon(parseInt(prop.match(/\d/)[0]));
               }
            }
        }

        if (data.lvl_status){
            console.log(('passed'));
        }
    }

    private onAlreadyFoundWord(word: string){
        console.log(word);
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
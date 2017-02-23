class PlayerInfo{
    private avatar: JQuery;
    private loginLabel: JQuery;
    private scoreLabel: JQuery;
    private levelLabel: JQuery;
    private foundWordsLabel: JQuery;
    private totalWordsLabel: JQuery;
    private progressBar: JQuery;
    private levelButtonsContainer: JQuery;
    private tipHoleWord: JQuery;
    private tipWordDefinition: JQuery;

    constructor(){
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

        this.tipHoleWord.on('click', function (e) {
            let tipClick = new CustomEvent('tipClick',{detail: 'holeWord'});
            document.dispatchEvent(tipClick);
        });
        this.tipWordDefinition.on('click', function (e) {
            let tipClick = new CustomEvent('tipClick',{detail: 'wordDefinition'});
            document.dispatchEvent(tipClick);
        })
    }

    public setNewAvatar(src: string): void{
        this.avatar.attr('src', src + '?' + Date.now());
    }

    public setLoginLabel(login:string):void{
        this.loginLabel.text(login);
    }

    public setLevelLabel(lvlNumber: string):void{
        this.levelLabel.text(lvlNumber);
    }

    public setScoreLabel(score: number){
        this.scoreLabel.text(score);
    }

    public setFoundWordsLabel(number: string):void{
        this.foundWordsLabel.text(number);
    }

    public setTotalWordsLabel(number: string):void{
        this.totalWordsLabel.text(number);
    }

    public setProgressBar(cur: number, max?: number): void{
        if (max){
            this.progressBar.attr('aria-valuemax', max);
        } else {
            max = parseInt(this.progressBar.attr('aria-valuemax'));
        }
        this.progressBar.attr('aria-valuenow', cur);
        this.progressBar.css('width', cur/max*100 + '%');
    }

    public createLevelMap(totalLevelsNumber: number, currentLevel: number, levelsPassedNumber: number): void{
        this.levelButtonsContainer.html('');
        for (let i = 0; i < totalLevelsNumber; i++){
            let lvl = i+1,
                button = $('<a class="btn btn-info" id="lvl-btn-' + lvl + '">' + lvl + '</a>');
            button.appendTo(this.levelButtonsContainer);
            let lvlBtnClick = new CustomEvent('lvlBtnClick', {detail: lvl});
            button.on('click', function () {
               document.dispatchEvent(lvlBtnClick);
            });
            if (lvl === currentLevel){
                button.addClass('active');
            }

            if (lvl > levelsPassedNumber + 1){
                button.addClass('disabled');
            }
        }
    }

    public enableTip(tipName: string): void{
        switch (tipName){
            case 'holeWord':
                this.tipHoleWord.attr('src', 'images/tips/word.png');
                break;
            case 'wordDefinition':
                this.tipWordDefinition.attr('src', 'images/tips/definition.png');
                break;
        }
    }

    public disableTip(tipName: string): void{
        switch (tipName){
            case 'holeWord':
                this.tipHoleWord.attr('src', 'images/tips/word_gray.png');
                break;
            case 'wordDefinition':
                this.tipWordDefinition.attr('src', 'images/tips/definition_gray.png');
                break;
        }
    }
}
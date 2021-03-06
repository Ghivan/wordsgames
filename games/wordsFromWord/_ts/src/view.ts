/// <reference path="classes/ViewRelated/Loader.ts" />
/// <reference path="classes/ViewRelated/PlayerInfo.ts" />
/// <reference path="classes/ViewRelated/Gamefield.ts" />

class View{
    private playerInfo: PlayerInfo;
    private gamefield: Gamefield;
    public loader: Loader;
    constructor(){
        this.loader = new Loader();
        this.playerInfo = new PlayerInfo();
        this.gamefield = new Gamefield();
    }

    public initializePlayerInfoBox(data: UserInfoData){
        this.playerInfo.setNewAvatar(data.avatar);
        this.playerInfo.setLoginLabel(data.login);
        this.playerInfo.setLevelLabel(data.level.toString());
        this.playerInfo.setScoreLabel(data.score);
        this.playerInfo.setFoundWordsLabel(data.foundWordsNumber.toString());
        this.playerInfo.setTotalWordsLabel(data.totalWordsNumber.toString());
        this.playerInfo.setProgressBar(data.foundWordsNumber, data.totalWordsNumber);
        this.playerInfo.createLevelMap(data.totalLevelsNumber, data.level, data.levelsPassedNumber);
        if (data.tipsState.wordDefinition){
            this.playerInfo.enableTip('wordDefinition');
        }
        if (data.tipsState.holeWord){
            this.playerInfo.enableTip('holeWord');
        }
    }

    public initializeGameField(data: GamefieldData){
        for (let prop in data.missions){
            if (data.missions.hasOwnProperty(prop)){
                (data.missions[prop]) ? this.showCompleteMissionStateIcon(parseInt(prop)): this.showIncompleteMissionStateIcon(parseInt(prop));
            }
        }
        this.updateUserInputWord();
        this.gamefield.printMainWordLetters(data.levelMainWord);

        this.gamefield.clearFoundWordsBox();
        if (data.foundWords){
            for (let i = 0; i < data.foundWords.length; i++){
                this.addFoundWord(data.foundWords[i]);
            }
        }
        this.gamefield.setUniqueMissionTitle(data.missionUnique);
    }

    public updateProgress(foundWordsNumber: number): void{
        this.playerInfo.setFoundWordsLabel(foundWordsNumber.toString());
        this.playerInfo.setProgressBar(foundWordsNumber);
    }

    public showCompleteMissionStateIcon(missionNumber: number): void {
        this.gamefield.showCompleteMission(missionNumber)
    }
    public showIncompleteMissionStateIcon(missionNumber: number): void {
        this.gamefield.showIncompleteMission(missionNumber)
    }

    public updateUserInputWord(word?:string): void{
        if (word){
            this.gamefield.printUserInputWord(word);
        } else {
            this.gamefield.clearUserInputWord();
        }
    }

    public addFoundWord(word:string): JQuery{
        let wordBox = $('<div class="found-word" title="Показать определение" id="' + word + '">' + word + '</div>'),
            onFoundWordClick = new CustomEvent('foundWordClick', {detail: word});
        wordBox.on('click', function () {
            document.dispatchEvent(onFoundWordClick);
        });
        this.gamefield.addFoundWord(wordBox);
        return wordBox;
    }

    public updateScore(score): void{
        this.playerInfo.setScoreLabel(score);
    }

    public setActiveLetterState(elem: JQuery): void{
        elem.addClass('active');
    }

    public removeActiveLetterState(elem: JQuery): void{
        elem.removeClass('active');
    }

    public activateLevelLink(lvl): void{
        $('#lvl-btn-'+lvl).removeClass('disabled');
    }

    public showMessageInModalBox(header: string, message: string): void{
        $('#message-modal-header').text(header.toUpperCase());
        $('#message-modal-content').text(message);
        $('#message-modal-box').modal('show');
    }

    public showFloatMessage(message:string, type: string): void{
        let alertBox = $('<div id="float-message" class="alert alert-'+ type +' fade in"></div>');
        alertBox.html('<a href="#" class="close" data-dismiss="alert">&times;</a>' + message);
        alertBox.appendTo('.gamefield');
        alertBox.css('top', $(document).scrollTop() + 20 + 'px');


        setTimeout(function () {
            $("#float-message").alert('close');
        }, 2000);
    }

    public enableTip(tipType: string){
        this.playerInfo.enableTip(tipType);
    }

    public disableTip(tipType: string){
        this.playerInfo.disableTip(tipType);
    }
}

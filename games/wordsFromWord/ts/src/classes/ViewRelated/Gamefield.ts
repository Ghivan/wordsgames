class Gamefield{
    private star1mission: JQuery;
    private star2mission: JQuery;
    private star3mission: JQuery;
    private userInputWord: JQuery;
    private levelMainWord: JQuery;
    private userFoundWordsBox: JQuery;

    constructor(){
        this.star1mission = $('#mission1-icon');
        this.star2mission = $('#mission2-icon');
        this.star3mission = $('#mission3-icon');
        this.userInputWord = $('#user-input-word');
        this.levelMainWord = $('#level-main-word');
        this.userFoundWordsBox = $('#user-found-words-box')
    }

    public showCompleteMission(missionNumber: number): void{
        this['star' + missionNumber + 'mission'].attr('src', 'images/missions/complete.png')
    }

    public showIncompleteMission(missionNumber: number): void{
        this['star' + missionNumber + 'mission'].attr('src', 'images/missions/incomplete.png')
    }

    public printUserInputWord(word: string): void{
        this.userInputWord.text(word);
    }

    public clearUserInputWord(): void{
        this.userInputWord.text('');
    }

    public printMainWordLetters(mainWord: string){
        this.levelMainWord.html('');
        for (let i = 0; i < mainWord.length; i++){
            let letter = $('<span>' + mainWord[i] + '</span>'),
                letterClick = new CustomEvent('letterClick', {'detail' : letter});
            letter.on('click', function () {
               document.dispatchEvent(letterClick);
            });
            letter.appendTo(this.levelMainWord);
        }
    }

    public clearFoundWordsBox(): void{
        this.userFoundWordsBox.html('');
    }

    public addFoundWord(wordBox: JQuery): void{
        wordBox.appendTo(this.userFoundWordsBox);
    }

    public setUniqueMissionTitle(mission){
        for (let letter in mission){
            if (mission.hasOwnProperty(letter)){
                let quantity = mission[letter];
                if (quantity % 100 >= 11 && quantity % 100 <= 20) {
                    quantity += ' слов';
                } else if (quantity % 10 >= 5 ||quantity % 10 === 0) {
                    quantity += ' слов';
                } else {
                    if (quantity % 10 >= 2) {
                        quantity += ' слова';
                    } else {
                        if (quantity % 10 === 1) {
                            quantity += ' слово';
                        }
                    }
                }
                this.star2mission.attr('title', 'Отгадайте ' + quantity + ' на букву ' + letter);
            }
        }
    }
}
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
        this.star1mission.tooltip({placement: 'bottom'});
        this.star3mission.tooltip({placement: 'bottom'});

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

    public addFoundWord(newWord: JQuery): void{
        let value = newWord.text().toLowerCase(),
            containerId = 'container-per-word-length-' + value.length,
            container = $('#' + containerId);

        if (container.length === 0) {
            container = this.createSubContainer(containerId);
        }

        let wordToInsertBefore = null,
            existingWordsCollection = container.children();

        if (existingWordsCollection.length === 0){
            newWord.appendTo(container);
            return;
        }

        for (let i = 0; i < existingWordsCollection.length; i++){
            if (existingWordsCollection[i].id.toLowerCase() > value){
                wordToInsertBefore = existingWordsCollection[i];
                break;
            }
        }

        if (wordToInsertBefore === null){
            newWord.appendTo(container);
        } else{
            newWord.insertBefore(wordToInsertBefore);
        }
    }

    private createSubContainer(containerId: string): JQuery{
        let container = $('<div id="' + containerId + '"></div>'),
            containerToIntsertBefore = null,
            userFoundWordsBox = this.userFoundWordsBox,
            collection = userFoundWordsBox.children('[id^=container-per-word-length-]'),
            newContainerWordsLength = parseInt(containerId.match(/\d/)[0]);

        if (collection.length === 0) {
            container.appendTo(userFoundWordsBox);
        } else {
            for (let i = 0; i < collection.length; i++) {
                let existingContainerWordsLength = parseInt(collection[i].id.match(/\d/)[0]);
                if (existingContainerWordsLength > newContainerWordsLength) {
                    containerToIntsertBefore = collection[i];
                    break;
                }
            }

            if (containerToIntsertBefore === null){
                container.appendTo(userFoundWordsBox);
            } else{
                container.insertBefore($(containerToIntsertBefore).prev('label'));
            }
        }

        let label: string;

        if (newContainerWordsLength % 100 >= 11 && newContainerWordsLength % 100 <= 20) {
            label = ' букв';
        } else if (newContainerWordsLength % 10 >= 5 ||newContainerWordsLength % 10 === 0) {
            label = ' букв';
        } else {
            if (newContainerWordsLength % 10 >= 2) {
                label = ' буквы';
            } else {
                if (newContainerWordsLength % 10 === 1) {
                    label = ' буква';
                }
            }
        }

        container.before('<label class="found-words-subcontainer-label">' + newContainerWordsLength + label + '</label>');
        return container;
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
                let title = 'Отгадать ' + quantity + ' на букву ' + '"' + letter.toUpperCase() + '"';
                this.star2mission.attr('data-original-title', title);
                this.star2mission.tooltip({placement: 'bottom'});
            }
        }
    }
}
class Model{
    readonly tipsCost = {
        holeWord: 250,
        wordDefinition: 100
    };
    private login: string;
    private avatar: string;
    private level: number;
    private totalLevelsNumber: number;
    private levelsPassedNumber: number;
    private levelWord: string;
    private wordVariants: Array<string>;
    private foundWords: Array<string>;
    private score: number;
    private userWord: string = '';
    private missions: {
        1: boolean,
        2: boolean,
        3: boolean
    };
    private missionUnique;
    private dictionary = {};

    constructor(success: ()=> any, error: (message: string)=>any, lvl?: number){
        let that = this;
        $.ajax({
            url: 'server_scenarios/index.php',
            type: 'post',
            data: {
                'action': 'getInitialInfo',
                'lvl' : (lvl) ? lvl : null
            },
            success: function (data) {
                if (data.state){
                    that.initialize(data);
                    success();
                } else {
                    error(data.message);
                }
            },
            error: function(){
                error('Ошибка соединения с сервером');
            }
        })
    }

    public initialize(data: ServerAnswerInitialData){
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
    }

    public getUserInfoData(): UserInfoData{
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
        }
    }

    public getGamefieldData(): GamefieldData{
        return{
            missions: this.missions,
            levelMainWord: this.levelWord,
            foundWords: this.foundWords,
            missionUnique: this.missionUnique
        }
    }

    public updateUserInputWord(word: string):void{
        this.userWord = word;
    }

    public getUserInputWord():string{
        return this.userWord;
    }

    public checkUserWord(word: string, onAlreadyFound: (word) => any, onNewFound:(data: ServerAnswerCheckWord)=>any){
        let model = this;

        if (this.foundWords.indexOf(word) > -1){
            onAlreadyFound(word);
            return;
        }
        if (this.wordVariants.indexOf(word) > -1){
            $.ajax({
                url: 'server_scenarios/index.php',
                type: 'post',
                data: {
                    'action': 'checkWord',
                    'userWord' : word
                },
                success: function (data) {
                    if (data.state){
                        model.score = data.score;
                        model.foundWords = data.foundWords;
                        let level_status = false;
                        if ((data.lvl_status) && (model.totalLevelsNumber >= (model.level + 1))){
                            level_status = true;
                        }

                        onNewFound({
                            word: data.word,
                            score: data.score,
                            experience: data.experience,
                            points: data.points,
                            missions: data.missions,
                            foundWordsNumber: data.foundWords.length,
                            lvl_status: level_status
                        });
                    }
                }
            })
        }
    }

    public getCurrentLevel(){
        return this.level;
    }

    public getWordDefinition(word: string, success: (header: string, definition: string) => any){
        let model = this;
        if (this.dictionary[word]){
            success(word, this.dictionary[word]);
            return
        }
        $.ajax({
            url: 'server_scenarios/index.php',
            type: 'post',
            data: {
                'action': 'getWordDefinition',
                'word' : word
            },
            success: function (data) {
                if (data.state){
                    model.dictionary[word] = data.definition;
                    success(word, data.definition);
                } else {
                    console.warn('Word does not exist!');
                }
            }
        })
    }

    public useTip(tipType: string, success: (tipResult: string, score: number) => any, error: (message: string) => any,){
        if (this.score < this.tipsCost[tipType]) {
            error('Для использования данной подсказки необходимо ' + this.tipsCost[tipType] + ' очков');
            return;
        }

        if (this.foundWords.length === this.wordVariants.length) {
            error('Все слова уровня отгаданы');
            return;
        }

        let model = this;
        $.ajax({
            url: 'server_scenarios/index.php',
            type: 'post',
            data: {
                'action': 'useTip',
                'tipType' : tipType
            },
            success: function (data) {
                if (data.state){
                    model.score = data.score;
                    success(data.result, model.score);
                } else {
                    error(data.result);
                }
            },

            error: function () {
                error('Ошибка соединения с сервером!');
            }
        })
    }

}
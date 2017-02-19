class Model{
    readonly tipsCost = {
        holeWord: 100,
        wordDefinition: 50
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
        this.level = data.level;
        this.totalLevelsNumber = data.totalLevelsNumber;
        this.levelsPassedNumber = data.levelsPassedNumber;
        this.levelWord = data.levelWord;
        this.wordVariants = data.wordVariants;
        this.foundWords = data.foundWords;
        this.score = data.score;
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
                        onNewFound({
                            word: data.word,
                            score: data.score,
                            missions: data.missions,
                            foundWordsNumber: data.foundWords.length,
                            lvl_status: data.lvl_status || false
                        });
                    }
                }
            })
        }
    }

}
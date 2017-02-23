interface ServerAnswerInitialData{
    login: any,
    avatar: any,
    level: any;
    totalLevelsNumber: any;
    levelsPassedNumber: any;
    levelWord: any;
    wordVariants: Array<string>;
    foundWords: Array<string>;
    score: any;
    missions: {
        1: boolean,
        2: boolean,
        3: boolean
    };
    missionUnique: Object;
}

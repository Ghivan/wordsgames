interface ServerAnswerInitialData{
    login: string,
    avatar: string,
    level: number;
    totalLevelsNumber: number;
    levelsPassedNumber: number;
    levelWord: string;
    wordVariants: Array<string>;
    foundWords: Array<string>;
    score: number;
    missions: {
        1: boolean,
        2: boolean,
        3: boolean
    };
    missionUnique: Object;
}

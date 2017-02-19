interface UserInfoData{
    avatar: string;
    login: string;
    level: number;
    totalLevelsNumber: number;
    levelsPassedNumber: number;
    foundWordsNumber: number;
    totalWordsNumber: number;
    score: number;
    tipsState: {
        holeWord: boolean;
        wordDefinition: boolean;
    }
}

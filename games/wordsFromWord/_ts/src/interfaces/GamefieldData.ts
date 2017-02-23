interface GamefieldData{
    missions: {
        1?: boolean;
        2?: boolean;
        3?: boolean;
    };

    missionUnique: Object;

    levelMainWord: string;
    foundWords?: Array<string>;
}

<?php
class AddingWordChecker
{
    const POINTS_PER_LETTER = 10;
    const EXPERIENCE_PER_WORD = 1;

    const POINTS_FOR_LEVEL_COMPLETE = 150;
    const EXPERIENCE_FOR_LEVEL_COMPLETE = 20;

    const POINTS_FOR_FIRST_STAR = 1000;
    const EXPERIENCE_FOR_FIRST_STAR = 50;

    const POINTS_FOR_SECOND_STAR = 500;
    const EXPERIENCE_FOR_SECOND_STAR = 30;

    const POINTS_FOR_THIRD_STAR = 5000;
    const EXPERIENCE_FOR_THIRD_STAR = 250;

    const PERCENT_FOUND_FOR_LEVEL_COMPLETE = 0.3;
    const PERCENT_FOUND_FOR_FIRST_STAR = 0.4;
    const PERCENT_FOUND_FOR_THIRD_STAR = 1;

    private $playerId;
    private $state = false;
    private $gameLevel;
    private $levelStatus;
    private $wordToCheck;
    private $wordVariants;
    private $foundWords;
    private $star1status;
    private $star2status;
    private $star3status;
    private $changedData = array();

    function __construct($playerId, $gameLevel, $wordToCheck)
    {
        $wordToCheck = strip_tags($wordToCheck);

        $this->playerId = $playerId;
        $this->gameLevel = $gameLevel;
        $this->wordVariants = DBGameInfo::getWordVariantsOnLvl(CURRENT_LEVEL);

        $playerProgress = DBPlayerProgress::getProgressOnLvl($playerId, $gameLevel);
        $this->levelStatus = $playerProgress['lvl_status'];
        $this->foundWords = (empty($playerProgress['foundWords'])) ? array()  : $playerProgress['foundWords'];
        $this->star1status = $playerProgress['star1status'];
        $this->star2status = $playerProgress['star2status'];
        $this->star3status = $playerProgress['star3status'];

        $this->wordToCheck = $wordToCheck;

        if (!$this->checkWord()){
            $this->changedData['state']  = false;
            $this->changedData['message'] = 'Неверное слово';
            return;
        }

        $this->addWord();
    }

    public function getChangedData(){
        $this->changedData['state'] = $this->state;
        $this->changedData['score'] = DBPlayerProgress::getScore($this->playerId);
        $this->changedData['word'] = $this->wordToCheck;
        return $this->changedData;
    }

    private function checkWord(){
        if ((array_search($this->wordToCheck, $this->foundWords) !== false) ||
            (array_search($this->wordToCheck, $this->wordVariants) === false)) {
            $this->state = false;
        } else {
            $this->state = true;
        }
        return $this->state;
    }

    private function addWord(){
        if (!$this->state) return;

        array_push($this->foundWords, $this->wordToCheck);
        DBPlayerProgress::updateFoundWords($this->playerId, $this->gameLevel, $this->foundWords);
        $this->changedData['foundWords'] = $this->foundWords;

        $this->calculatePointsForWordLength();
        $this->checkLvlStatus();
        $this->checkMissions();
        DBPlayerProgress::augmentScore($this->playerId, $this->changedData['points']);
        DBPlayerGlobalInfo::augmentExperience($this->playerId, $this->changedData['experience']);
    }


    private function addPoints($points){
        if (isset($this->changedData['points'])){
            $this->changedData['points'] += $points;
        } else {
            $this->changedData['points'] = $points;
        }
    }

    private function addExperience($experience){
        if (isset($this->changedData['experience'])){
            $this->changedData['experience'] += $experience;
        } else {
            $this->changedData['experience'] = $experience;
        }
    }


    private function calculatePointsForWordLength(){
        $wordLength = mb_strlen($this->wordToCheck);
        $points = $wordLength * $this::POINTS_PER_LETTER;
        $experience = $this::EXPERIENCE_PER_WORD;
        switch ($wordLength){
            case (($wordLength > 3) && ($wordLength <= 5)):
                $points *= 1.1;
                $experience *= 2;
                break;
            case ($wordLength <= 7):
                $points *= 1.2;
                $experience *= 3;
                break;
            case ($wordLength <= 9):
                $points *= 1.3;
                $experience *= 4;
                break;
            case ($wordLength >= 10):
                $points *= 2;
                $experience *= 10;
                break;
        }

        $this->addPoints($points);
        $this->addExperience($experience);
    }

    private function checkLvlStatus(){
        if ((!$this->levelStatus) &&
            (count($this->foundWords) >= count($this->wordVariants)* $this::PERCENT_FOUND_FOR_LEVEL_COMPLETE)){
            $this->levelStatus = true;
            DBPlayerProgress::completeLevel($this->playerId, $this->gameLevel);
            $this->changedData['lvl_status'] = $this->levelStatus;

            $this->addPoints($this::POINTS_FOR_LEVEL_COMPLETE);
            $this->addExperience($this::EXPERIENCE_FOR_LEVEL_COMPLETE);
        }
    }

    private function checkMissions(){
        $this->changedData['missions'] = array();
        $this->checkFirstStarMission();
        $this->checkSecondStarMission();
        $this->checkThirdStarMission();
    }

    private function checkFirstStarMission(){
        if ($this->star1status) return;
        if (count($this->foundWords) >= count($this->wordVariants)* $this::PERCENT_FOUND_FOR_FIRST_STAR){
            $this->star1status = true;
            DBPlayerProgress::setCompleteStatusOnMission($this->playerId, $this->gameLevel, 1);
            $this->changedData['missions']['star1status'] = $this->star1status;

            $this->addPoints($this::POINTS_FOR_FIRST_STAR);
            $this->addExperience($this::EXPERIENCE_FOR_FIRST_STAR);
        }
    }

    private function checkSecondStarMission(){
        if ($this->star2status) return;
        $uniqueMission = DBGameInfo::getUniqueMission($this->gameLevel);
        $letter = array_keys($uniqueMission)[0];
        $quantity = array_values($uniqueMission)[0];
        $pattern = '/^'.$letter.'+/u';
        $matches = preg_grep($pattern, $this->foundWords);
        if (count($matches) >= $quantity){
            $this->star2status = true;
            DBPlayerProgress::setCompleteStatusOnMission($this->playerId, $this->gameLevel, 2);
            $this->changedData['missions']['star2status'] = $this->star2status;

            $this->addPoints($this::POINTS_FOR_SECOND_STAR);
            $this->addExperience($this::EXPERIENCE_FOR_SECOND_STAR);
        }
    }

    private function checkThirdStarMission(){
        if ($this->star3status) return;
        if (count($this->foundWords) >= count($this->wordVariants)* $this::PERCENT_FOUND_FOR_THIRD_STAR){
            $this->star3status = true;
            DBPlayerProgress::setCompleteStatusOnMission($this->playerId, $this->gameLevel, 3);
            $this->changedData['missions']['star3status'] = $this->star3status;

            $this->addPoints($this::POINTS_FOR_THIRD_STAR);
            $this->addExperience($this::EXPERIENCE_FOR_THIRD_STAR);
        }
    }
}

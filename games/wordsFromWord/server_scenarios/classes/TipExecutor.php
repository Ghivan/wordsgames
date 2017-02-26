<?php

class TipExecutor
{
    const WORD_DEFINITION_COST = 100;
    const HOLE_WORD_COST = 250;
    const AVAILABLE_TIPS = ['holeWord', 'wordDefinition'];

    private $playerId;
    private $playerScore;
    private $state = false;
    private $gameWordLevel;
    private $wordVariants;
    private $foundWords;
    private $notFoundWords;
    private $randomIndex;
    private $tipResult;

    function __construct($tipType, $level, $playerId)
    {
        $this->playerId = $playerId;
        $this->playerScore = DBPlayerProgress::getScore($this->playerId);
        $levelInfo = DBGameInfo::getLevelInfo($level);
        $this->gameWordLevel = $levelInfo['word'];
        $this->wordVariants = $levelInfo['wordVariants'];
        $this->foundWords = DBPlayerProgress::getProgressOnLvl($this->playerId, $level)['foundWords'];
        $this->notFoundWords = array_values(array_diff($this->wordVariants, $this->foundWords));
        if (count($this->notFoundWords) === 0){
            $this->state = false;
            return;
        }
        $this->randomIndex = random_int(0, count($this->notFoundWords) - 1);

        if ($this->checkTipAvailablity($tipType)){
            $this->state = true;
            $this->useTip($tipType);
        }
    }

    public function getTipResult(){
        if ($this->state){
            return array(
                'state' => $this->state,
                'score' => DBPlayerProgress::getScore($this->playerId),
                'result' => $this->tipResult,
            );
        } else {
            return array(
                'state' => $this->state,
                'result' => 'Данная подсказка не доступна.'
            );
        }
    }

    private function getRandomWordDefinition(){
        return DBDictionary::getWordDefinition($this->notFoundWords[$this->randomIndex]);
    }

    private function getRandomWord(){
        return $this->notFoundWords[$this->randomIndex];
    }

    private function checkTipAvailablity($tipType){
        if (array_search($tipType, $this::AVAILABLE_TIPS) === false) return false;
        switch ($tipType){
            case 'holeWord':
                return ($this->playerScore > $this::HOLE_WORD_COST);
                break;
            case  'wordDefinition':
                return ($this->playerScore > $this::WORD_DEFINITION_COST);
                break;
            default:
                return false;
                break;
        }
    }

    private function useTip($tipType){
        switch ($tipType){
            case 'holeWord':
                DBPlayerProgress::augmentScore($this->playerId, -$this::HOLE_WORD_COST);
                $this->tipResult = $this->getRandomWord();
                break;
            case  'wordDefinition':
                DBPlayerProgress::augmentScore($this->playerId, -$this::WORD_DEFINITION_COST);
                $this->tipResult = $this->getRandomWordDefinition();
                break;
        }
    }

}
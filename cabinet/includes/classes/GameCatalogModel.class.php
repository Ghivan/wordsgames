<?php
class GameCatalogModel
{
    private $publicCollection = [];
    private $developmentCollection = [];

    function __construct(array $gameData)
    {
        foreach ($gameData as $game) {
            switch ($game['status']) {
                case 'development':
                    array_push($this->developmentCollection, new GameModel($game));
                    break;
                case 'production':
                    array_push($this->publicCollection, new GameModel($game));
                    break;
            }
        }

    }

    public function getPublicGame()
    {
        if (empty($this->publicCollection)){
            return false;
        } else {
            return array_shift($this->publicCollection);
        }
    }

    public function getDeveloppedGame()
    {
        if (empty($this->developmentCollection)){
            return false;
        } else {
            return array_shift($this->developmentCollection);
        }
    }
}
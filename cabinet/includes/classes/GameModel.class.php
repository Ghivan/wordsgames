<?php
class GameModel
{
    private $id;
    private $name;
    private $rules;
    private $path;
    private $author;

    function __construct(array $gameData)
    {
        $this -> id = $gameData['id'];
        $this -> name = $gameData['name'];
        $this -> rules = $gameData['rules'];
        $this -> path = $gameData['path'];
        $this -> author = $gameData['author'];
    }

    function __get($name)
    {
        // TODO: Implement __get() method.
        return $this->$name;
    }

}
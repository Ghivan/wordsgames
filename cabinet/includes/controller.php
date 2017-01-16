<?php

function my_autoloader($class) {
    include $_SERVER['DOCUMENT_ROOT'] . '/cabinet/includes/classes/' . $class . '.class.php';
}
spl_autoload_register('my_autoloader');


class Controller{
    private $model;
    private $view;

    function __construct()
    {
        $this->model = new Model($_SESSION['pl_id']);
        $this->view = new View();
    }

    public function printUserInfoBlock(){
        $userInfo = $this->model->user;

        $this->view->userInfo->printUserInfo($userInfo->serializeDataToArray());

    }

    public function printGameBox(){
        $gameInfo = $this->model->gameCatalog;
        while ($game = $gameInfo->getPublicGame()){
            $this->view->gameCatalog->printGamebox($game->serializeDataToArray());
        }
    }
}
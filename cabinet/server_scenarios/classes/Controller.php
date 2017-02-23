<?php
class Controller{
    private static $model = null;
    private static $view = null;

    function __construct()
    {
        self::$model = new Model(Authorization::getAuthorizedPlayerId());
        self::$view = new View();
    }

    public static function printUserInfoBlock(){
        $userInfo = self::$model->user;
        self::$view->userInfo->printUserInfo($userInfo->serializeDataToArray());

    }

    public static function printGameBox(){
        $gameInfo = self::$model->gameCatalog;
        while ($game = $gameInfo->getPublicGame()){
            self::$view->gameCatalog->printGamebox($game->serializeDataToArray());
        }
    }

    public static function getUserDetails(string $prop){
        return self::$model->user->$prop;
    }

}
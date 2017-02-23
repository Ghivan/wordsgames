<?php

class Model{
    public $user;
    public $gameCatalog;

    function __construct($playerId)
    {
        $this->user = new ModelUserInfo(DBPlayerGlobalInfo::getGlobalInfo($playerId));
        $this->gameCatalog = new ModelGameCatalog(DBGamesGlobalInfo::getGlobalInfo());
    }
}









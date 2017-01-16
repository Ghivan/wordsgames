<?php
class View{
    public $userInfo;
    public $gameCatalog;
    function __construct()
    {
        $this->userInfo = new UserInfoView();
        $this->gameCatalog = new GameCatalogView();
    }
}


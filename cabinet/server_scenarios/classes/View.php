<?php
class View{
    public $userInfo;
    public $gameCatalog;
    function __construct()
    {
        $this->userInfo = new ViewUserInfo();
        $this->gameCatalog = new ViewGameCatalog();
    }
}


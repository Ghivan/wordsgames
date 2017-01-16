<?php
class Model{
    private $db;
    public $user;
    public $gameCatalog;

    function __construct($userId)
    {
        $this->db = new Database();

        $userData = $this->db->execQuery(
            "SELECT id, login, avatar, email, exp, level FROM `players` WHERE `id` = :id",
            array(
                ':id' => $userId
            ));

        $this->user = new UserInfoModel($userData[0]);

        $gameData = $this->db->selectAll(
            array(
                'games'
            ));

        $this->gameCatalog = new GameCatalogModel($gameData);
    }
}









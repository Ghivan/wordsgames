<?php
class UserInfoModel
{
    private $login;
    private $avatar;
    private $email;
    private $exp;
    private $lvl;
    private $id;

    function __construct(array $userData)
    {
        $this -> id = $userData['id'];
        $this -> login = $userData['login'];
        $this -> avatar = $userData['avatar'];
        $this -> email = $userData['email'];
        $this -> exp = intval($userData['exp']);
        $this -> lvl = intval($userData['level']);
    }

    public function __get($name)
    {
        if (isset($this->$name)){
            return $this->$name;
        }

        return '';
    }

    function getMinExp(){
        return floor(1000 * (pow(1.1, $this -> lvl - 1) -1));
    }

    public  function getMaxExp(){
        return floor(1000 * (pow(1.1, $this -> lvl) -1));
    }

    public function serializeDataToArray(){
        return array(
            'avatar' => $this->avatar,
            'login' => $this->login,
            'level' => $this->lvl,
            'curExp' => $this->exp,
            'prevLvlExp' => $this->getMinExp(),
            'nextLvlExp' => $this->getMaxExp()
        );
    }
}
<?php
class UserInfoView
{
    public function printUserInfo(array $userData){
        $avatar = $this->formAvatarBlock($userData['avatar']);
        $userNameBlock = $this->formUserName($userData['login']);
        $userLevelBlock = $this->formUserLevelBlockInfo($userData['level']);
        $progressBlock = $this->formProgressBolock($userData['curExp'], $userData['prevLvlExp'], $userData['nextLvlExp']);

        echo $avatar . $userNameBlock . $userLevelBlock . $progressBlock;
    }

    private function formAvatarBlock($pathToImage)
    {
        if (!file_exists($_SERVER['DOCUMENT_ROOT'] . $pathToImage)){
            $pathToImage = '/files/images/players/no_avatar.png';
        }

        $block = '<img src="' .
            $pathToImage .
            '" alt="Ваш аватар" class="img-responsive img-circle center-block" id="UserAvatar">';

        return $block;
    }

    private function formUserName($name)
    {
        $block = '<div class="h2 text-center">' .
            $name .
            '</div>';

        return $block;
    }

    private function formUserLevelBlockInfo($level)
    {
        $label = '<span class="label label-default">Уровень ' .
            $level .
            '</span>';

        $block = '<div class="h4 text-center">' .
            $label .
            '</div>';
        return $block;
    }

    private function formProgressBolock($currentExp, $previousLvlExp, $nextLvlExp)
    {
        $label = '<span>' .
            $currentExp . '/' . $nextLvlExp .
            '</span>';
        $progressBar = '<div class="progress-bar" role="progressbar" aria-valuenow =' .
            $currentExp .
            ' aria-valuemin=' .
            $previousLvlExp .
            ' aria-valuemax=' .
            $nextLvlExp .
            ' style="width: ' .
            floor($currentExp/$nextLvlExp * 100) .
            '%">' .
            '</div>';

        $block = '<div class="progress">' .
            $label .
            $progressBar .
            '</div>';
        return $block;
    }

}
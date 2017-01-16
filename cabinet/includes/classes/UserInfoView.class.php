<?php
class UserInfoView
{
    public function printUserInfo($avatar, $user, $userLevel, $currentExp, $prevLvlExp, $nextLvlExp){
        $avatar = $this->formAvatarBlock($avatar);
        $userNameBlock = $this->formUserName($user);
        $userLevelBlock = $this->formUserLevelBlockInfo($userLevel);
        $progressBlock = $this->formProgressBolock($currentExp, $prevLvlExp, $nextLvlExp);

        echo $avatar . $userNameBlock . $userLevelBlock . $progressBlock;
    }

    private function formAvatarBlock($pathToImage)
    {
        $block = '<img src="' .
            $pathToImage .
            '" alt="Ваш аватар" class="img-responsive img-circle center-block">';

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
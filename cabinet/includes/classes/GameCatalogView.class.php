<?php
class GameCatalogView{
    public function printGamebox(array $gameData){
        $panel = $this->formPanel($gameData['id'], $gameData['rules'], $gameData['name'], $gameData['path'], $gameData['author']);
        $gameBox = '<div class="row">' .
            $panel .
            '</div>';
        echo $gameBox;
    }

    private function formPanel($gameId, $gameRules, $gameName, $gamePath, $gameAuthor){
        $heading = $this->formPanelHeading($gameName, $gameAuthor);
        $body = $this->formPanelBody($gameId, $gameRules);
        $footer = $this->formPanelFooter($gameId, $gamePath);
        $panel = '<div class="panel panel-info">' .
            $heading .
            $body .
            $footer .
            '</div>';
        return $panel;
    }

    private function formPanelHeading($gameName, $gameAuthor){
        $panelHeading = '<div class="panel-heading">' .
            $gameName .
            ' <br><small>Разработчик: '.
            $gameAuthor.
            '</small>'.
            '</div>';

        return $panelHeading;
    }

    private function formPanelBody($gameId,$gameRules){
        $tabRules = '<div class="tab-pane active in fade" id="game-'.
            $gameId .
            '-rules">' .
            $gameRules .
            '</div>';

        $tabRecords = '<div class="tab-pane" id="game-' .
            $gameId .
            '-records">Рекорды</div>';

        $tabProgress = '<div class="tab-pane" id="game-' .
            $gameId .
            '-progress">Мой прогресс</div>';

        $panelBody = '<div class="panel-body tab-content">'.$tabRules.$tabRecords.$tabProgress.'</div>';

        return $panelBody;
    }

    private function formPanelFooter($gameId, $gamePath){
        $panelToggle = $this->formPanelToggleList($gameId);
        $gameStartBtn = $this->formStartGameButton($gamePath);
        $footer = '<div class="panel-footer btn-gameinfo-block">' .
            $panelToggle .
            $gameStartBtn .
            '</div>';

        return $footer;
    }

    private  function formPanelToggleList($gameId){
        $buttonRules = '<li role="presentation" class="active">' .
            '<a href="#game-' .
            $gameId .
            '-rules" data-toggle="tab"> Правила</a>' .
            '</li>';

        $buttonRecords = '<li role="presentation">' .
            '<a href="#game-' .
            $gameId .
            '-records" class="game-records" data-toggle="tab" data-game-id="' .
            $gameId .
            '">Рекорды</a>' .
            '</li>';

        $buttonProgress = '<li role="presentation">' .
            '<a href="#game-' .
            $gameId .
            '-progress" class="game-progress" data-toggle="tab" data-game-id="' .
            $gameId .
            '">Мой прогресс</a>' .
            '</li>';

        $list = '<ul class="nav nav-pills">' .
            $buttonRules .
            $buttonRecords .
            $buttonProgress .
            '</ul>';

        return $list;
    }

    private function formStartGameButton($gamePath){
        $btn = '<a href="' .
            $gamePath .
            '" class="btn btn-success btn-start">Играть!</a>';

        return $btn;
    }
}

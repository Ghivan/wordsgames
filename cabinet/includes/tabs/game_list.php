<div class="container-fluid tab-pane active in fade" id="game-list">
    <div class="row">
        <div class="h1 center-block text-center">
            Доступные игры
        </div>
    </div>

    <div class="row game-search">
        <div class="form-horizontal col-md-5 col-md-offset-7">

            <div class="input-group">
                <span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>
                <input type="password" id="gm-search" name="gm-search" class="form-control" placeholder="Поиск по играм..." required>
            </div>

        </div>
    </div>

    <?php
    $controller->printGameBox();
    ?>
</div>
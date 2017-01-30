<?php
header('Content-Type: application/json');
if (!move_uploaded_file($_FILES['userAvatar']['tmp_name'], $_SERVER['DOCUMENT_ROOT']."/files/images/players/кот.png")){
    echo json_encode(
        array(
            'state' => false,
            'message' => 'Ошибка'
        )
    );
} else {
    echo json_encode(
        array(
            'src' => "/files/images/players/кот.png",
            'state' => true
        )
    );
};

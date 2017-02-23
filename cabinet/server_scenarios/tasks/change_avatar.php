<?php
if (!defined('PLAYER_ID') || empty($_FILES['userAvatar'])) exit();

echo json_encode(AvatarChanger::downloadNewAvatar(PLAYER_ID, $_FILES['userAvatar']));



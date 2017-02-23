<?php

class AvatarChanger
{
    const AVATAR_MAX_SIZE = 500;
    const DEFAULT_AVATAR = '/_app_files/players_avatars/no_avatar.png';
    const ALLOWED_TYPES = [ 'image/png', 'image/jpeg'];

    public static function downloadNewAvatar($playerId, $newAvatar){
        $message ='';
        $state = true;
        $detectedType = mime_content_type($newAvatar['tmp_name']);

        if (!in_array($detectedType,self::ALLOWED_TYPES)){
            $message = 'Неверное расширение файла: требуется только jpg или png.';
            $state = false;
        }

        if ($newAvatar['size'] > self::AVATAR_MAX_SIZE*1024){
            $message = 'Файл больше ' . self::AVATAR_MAX_SIZE . ' KB';
            $state = false;
        }

        if (!$state){
            return array(
                'state' => $state,
                'message' => $message
            );
        }

        $ext = pathinfo($newAvatar['name'], PATHINFO_EXTENSION);
        $path = '/_app_files/players_avatars/'. $playerId . '.' . $ext;
        $oldAvatar = DBPlayerGlobalInfo::getGlobalInfo($playerId)['avatar'];

        if ($oldAvatar != self::DEFAULT_AVATAR && file_exists($_SERVER['DOCUMENT_ROOT'] . $oldAvatar)){
            unlink($_SERVER['DOCUMENT_ROOT'] . $oldAvatar);
        }

        if (!move_uploaded_file($newAvatar['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . $path)){
            $state =  false;
            $message = 'Ошибка при загрузке файла на сервер';
            DBPlayerSettingsChanger::updateAvatar($playerId, self::DEFAULT_AVATAR);
            return array(
                'state' => $state,
                'message' => $message
            );
        } else {
            $state = true;
            $message = 'Загрузка файла завершена';
            DBPlayerSettingsChanger::updateAvatar($playerId, $path);
            return array(
                'state' => $state,
                'message' => $message,
                'src' => $path
            );
        }
    }
}
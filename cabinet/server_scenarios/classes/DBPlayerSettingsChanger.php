<?php

class DBPlayerSettingsChanger extends DBPlayerGlobalInfo
{
    private static $queries = array(
        'updateAvatar' => 'UPDATE `players` SET `avatar` = :newPath WHERE `id` = :playerId',
        'updatePassword' => 'UPDATE `players` SET `password` = :newHash WHERE `id` = :playerId',
        'getHash' => 'SELECT `password` FROM `players` WHERE `id` = :playerId',
        'updateEmail' => 'UPDATE `players` SET `email`=:email WHERE  `id`=:playerId',
        'updateLogin' => 'UPDATE `players` SET `login`=:login WHERE  `id`=:playerId'
    );


    public static function updateLogin($playerId, $newLogin){
        if (!InputValidator::validateLogin($newLogin)) return false;

        if (parent::checkUserExistence($newLogin, null)) return false;

        try {
            $stmt = parent::getConnection()->prepare(self::$queries['updateLogin']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':login', $newLogin);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка обновления аватара. Игрок: ' . $playerId . ', новый логин: ' . $newLogin . ')';
                throw new Exception($message);
            }

            return true;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }

    }

    public static function updateEmail($playerId, $newEmail){
        if (!InputValidator::validateEmail($newEmail)) return false;

        if (parent::checkUserExistence(null, $newEmail)) return false;

        try {
            $stmt = parent::getConnection()->prepare(self::$queries['updateEmail']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':email', $newEmail);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка обновления аватара. Игрок: ' . $playerId . ', почта: ' . $newEmail . ')';
                throw new Exception($message);
            }

            return true;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }

    }

    public static function updateAvatar($playerId, $newPath){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['updateAvatar']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':newPath', $newPath);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка обновления аватара. Игрок: ' . $playerId . ', аватар: ' . $newPath . ')';
                throw new Exception($message);
            }
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }
        return true;
    }

    public static function changePassword($playerId, $oldPassword, $newPassword){
        if (!self::verifyPassword($playerId, $oldPassword)){
            return array(
                'state' => false,
                'message' => 'Старый пароль введен не верно'
            );
        }

        $newHash = password_hash($newPassword, PASSWORD_DEFAULT);

        if (self::updateDBHash($playerId, $newHash)){
            return array(
                'state' => true,
                'message' => 'Пароль был изменен'
            );
        } else {
            return array(
                'state' => false,
                'message' => 'Ошибка обновления в базе данных. Пароль не был изменен.'
            );
        }

    }

    private static function verifyPassword($playerId, $password){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['getHash']);
            $stmt->bindParam(':playerId', $playerId);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ')';
                throw new Exception($message);
            }
            $existingHash = $stmt->fetch(PDO::FETCH_ASSOC)['password'];
            return password_verify($password, $existingHash);
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }
    }


    private static function updateDBHash($playerId, $newHash){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['updatePassword']);
            $stmt->bindParam(':playerId', $playerId);
            $stmt->bindParam(':newHash', $newHash);
            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (игрок(id): ' . $playerId . ', новый хэш: ' . $newHash . ')';
                throw new Exception($message);
            }
            return true;
        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return false;
        }
    }
}
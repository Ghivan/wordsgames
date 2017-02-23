<?php

class DBUserRegistrator extends DBPlayerGlobalInfo
{
    private static $queries = array(
        'addNewUser' => 'INSERT INTO `players`(`login`, `password`, `email`) VALUES(:login,:password, :email)'
    );

    public static function register ($login, $password, $email = ''){
        $state = true;
        $message = '';

        if (!InputValidator::validateLogin($login)){
            $state = false;
            $message.= InputValidator::LOGIN_REQUIREMENTS;
        }

        if (!InputValidator::validatePassword($password)){
            $state = false;
            $message.= ' ' . InputValidator::PASSWORD_REQUIREMENTS;
        }

        if (!InputValidator::validateEmail($email)){
            $email = null;
        }

        if (!$state) {
            return array(
                'state' => $state,
                'message' => $message
            );
        }

        if (parent::checkUserExistence($login, $email)){
            $state = false;
            $message= 'Пользователь с таким именем или электронной почтой уже зарегистрирован';
            return array(
                'state' => $state,
                'message' => $message
            );
        }

        $hash =  password_hash($password, PASSWORD_DEFAULT);
        $playerId = self::addNewPlayerToDB($login, $hash, $email);
        if ($playerId !== null){
            $state = true;
            $message = 'Вы успешно зарегистрированы!';
            Authorization::logIn($playerId);
            return array(
                'state' => $state,
                'message' => $message
            );
        } else {
            $state = false;
            $message= 'Ошибка при регистрации в базе данных приложения!';
            return array(
                'state' => $state,
                'message' => $message
            );
        }

    }

    private static function addNewPlayerToDB($login, $hash, $email){
        if (!defined('LOGIN_SCRIPT')) return null;
        $email = empty($email) ? '' : $email;
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['addNewUser']);
            $stmt->bindParam(':login', $login);
            $stmt->bindParam(':password', $hash);
            $stmt->bindParam(':email', $email);

            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (Логин игрока: ' . $login . ', хэш: ' . $hash. ', email: ' . $email . ')';
                throw new Exception($message);
            }

            $playerId = parent::getConnection()->lastInsertId();

        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }

        return $playerId;
    }
}
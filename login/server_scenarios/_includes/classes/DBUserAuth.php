<?php
class DBUserAuth extends DB
{
    private static $queries = array(
        'getUserId' => 'SELECT `id`,`password` FROM `players` WHERE `login` = :login',
        'updateHash' => 'UPDATE `players` SET `password` = :password WHERE `login` = :login'
    );

    public static function authorize($login, $password){
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

        if (!$state) {
            return array(
                'state' => $state,
                'message' => $message
            );
        }


        $playerId = self::getUserID($login, $password);
        if ($playerId !== null){
            $state = true;
            Authorization::logIn($playerId);
            return array(
                'state' => $state,
                'message' => 'Вы авторизированы!'
            );
        } else {
            $state = false;
            return array(
                'state' => $state,
                'message' => 'Логин или пароль введены неправильно!'
            );
        }


    }

    private static function getUserID($login, $password){
        try {
            $stmt = parent::getConnection()->prepare(self::$queries['getUserId']);
            $stmt->bindParam(':login', $login);

            if (!$stmt->execute()){
                ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                $message = 'Ошибка запроса к базе данных (Логин игрока: ' . $login . ')';
                throw new Exception($message);
            }

        } catch (Throwable $e){
            ErrorLogger::logException($e);
            return null;
        }

        $userDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (empty($userDetails)){
            return null;
        }
        if (password_verify($password, $userDetails['password'])){
            if (password_needs_rehash($userDetails['password'], PASSWORD_DEFAULT)){
                self::updateHash($login, $password);
            }
            return $userDetails['id'];
        } else {
            return null;
        }
    }

    private function updateHash($login, $password){
                try{
                    $newHash = password_hash($password, PASSWORD_DEFAULT);
                    $stmt = parent::getConnection()->prepare(self::$queries['updateHash']);
                    $stmt->bindParam(':login', $login);
                    $stmt->bindParam(':password', $newHash);
                    if (!$stmt->execute()){
                        ErrorLogger::logFailedDBRequest($stmt->errorInfo(), $stmt->queryString,__LINE__, __FILE__);
                        $message = 'Ошибка запроса к базе данных (Логин игрока: ' . $login . ')';
                        throw new Exception($message);
                    }
                } catch (Throwable $e)  {
                    ErrorLogger::logException($e);
                }
            }

}
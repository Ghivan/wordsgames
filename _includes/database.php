<?php
class Database{

    protected $dbc;

    function __construct()
    {
        $this->dbc = new PDO("mysql:host=".HOST.";dbname=".DB_NAME.";charset=UTF8", DB_USER, DB_PASSWORD);
    }

    public function execQuery(string $query, array $params = null)
    {
        $stmt = $this->dbc->prepare($query);

        if (!$stmt->execute($params)){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function selectAll(array $tables)
    {
        $query = $this->dbc->prepare("SELECT * FROM ".implode(', ', $tables));

        if (!$query->execute()){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $query->errorInfo()[2]
            );
        }

        return $query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function changeDataQuery(string $query, array $params = null){
        $stmt = $this->dbc->prepare($query);

        if (!$stmt->execute($params)){
            throw new Exception(
                'Ошибка запроса к базе данных. Строка '
                . __LINE__
                . '. SQL Error '
                . $stmt->errorInfo()[2]
            );
        }
        return $stmt->rowCount();
    }

    public function getLastId()
    {
        return $this->dbc->lastInsertId();
    }

}


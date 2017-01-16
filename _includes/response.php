<?php
class Response
{
    private $state;
    private $message;

    function __construct(bool $state, string $message = null)
    {
        $this -> state = $state;
        $this -> message = $message;
    }

    public function toJson()
    {
        return json_encode(
            array(
                'state' => $this->state,
                'message' => $this->message
            )
        );
    }

}
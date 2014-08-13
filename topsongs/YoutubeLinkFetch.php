<?php
class YouTubeLinkFetch{
    public $data, $link;
    public function __construct($data){
        $this->data = base64_decode($data);
    }
    public function sendQuery($api){
        $res = json_decode(file_get_contents($api. urlencode($this->data)), true);
        $this->link = $res["feed"]["entry"][0]["link"][0]["href"];
    }
    public function getLink(){
        return $this->link;
    }
}
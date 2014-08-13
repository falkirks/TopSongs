<?php
class Song{
    public $name, $artist, $link, $img;

    function __construct($name, $artist, $img){
        $this->name = $name;
        $this->artist = $artist;
        $this->img = $img;
    }
    public function toString($t){
        $t = str_replace("IMG", $this->img, $t);
        $t = str_replace("NAME", $this->name, $t);
        $t = str_replace("ARTIST", $this->artist, $t);
        $t = str_replace("ID", urlencode($this->name . " " . $this->artist), $t);
        return $t;
    }
}
<?php
class SongParser{
    private $s;
    public function __construct(){
        $this->s = [];
    }
    public function downloadList($url){
        $res = json_decode(file_get_contents($url), true)["feed"]["entry"];
        foreach($res as $song){
            $this->s[] = new Song($song["im:name"]["label"], $song["im:artist"]["label"], $song["im:image"][2]["label"]);
        }
    }
    public function performSearch($url){
        $res = json_decode(file_get_contents($url), true)["results"];
        foreach($res as $song){
            $this->s[] = new Song($song["trackName"], $song["artistName"], $song["artworkUrl100"]);
        }
    }
    public function generateLinks($url){
        foreach($this->s as $song){
            $res = json_decode(file_get_contents($url . urlencode($song->name . " - " . $song->artist)), true);
            $song->setLink($res["feed"]["entry"][0]["link"][0]["href"]);
        }
    }
    public function dumpSongs($t){
        $ret = "";
        foreach($this->s as $song){
            $ret .= $song->toString($t) . "\n";
        }
        return $ret;
    }
}
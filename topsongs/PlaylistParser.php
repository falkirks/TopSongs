<?php
class PlayListParser{
    private $s;
    public function fetchPlaylist($playlist){
        $playlist = explode("%%%", $playlist);
        foreach($playlist as $song){
            $res = json_decode(file_get_contents("http://itunes.apple.com/search?media=music&entity=song&limit=50&term=$song"), true)["results"][0];
            $this->s[] = new Song($res["trackName"], $res["artistName"], $res["artworkUrl60"]);
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
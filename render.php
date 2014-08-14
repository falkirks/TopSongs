<?php
require("./topsongs/SongParser.php");
require("./topsongs/Song.php");
require("./topsongs/YouTubeLinkFetch.php");
require("./topsongs/PlaylistParser.php");
if(isset($_POST['playlist'])){
    $p = new PlayListParser;
    $p->fetchPlaylist($_POST['playlist']);
    die($p->dumpSongs('
                    <tr waiting="ID">
                    <td class="text-left small"><img class="album-art" src="IMG">
                    </td>
                    <td class="text-left">
                    <b>NAME - ARTIST</b>
                    </td>
                </tr>'));
}
elseif(isset($_GET["song"])){
    $f = new YouTubeLinkFetch($_GET["song"]);
    $f->sendQuery("http://gdata.youtube.com/feeds/api/videos?alt=json&max-results=1&q=");
    die($f->getLink());
}
else{
    $p = new SongParser;
    if(isset($_GET["q"])) $p->performSearch("http://itunes.apple.com/search?media=music&entity=song&limit=50&term=" . urlencode($_GET["q"]));
    else $p->downloadList("http://itunes.apple.com/rss/topsongs/limit=50/explicit=true/json");
    //$p->generateLinks("http://gdata.youtube.com/feeds/api/videos?alt=json&max-results=1&q=");
    die($p->dumpSongs('
                    <tr waiting="ID">
                    <td class="text-left small"><img class="album-art" src="IMG">
                    </td>
                    <td class="text-left">
                    <b>NAME - ARTIST</b>
                    </td>
                </tr>'));
}


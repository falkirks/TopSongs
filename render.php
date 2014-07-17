<?php
require("./topsongs/SongParser.php");
require("./topsongs/Song.php");
$p = new SongParser();
if(isset($_GET["q"])) $p->performSearch("http://itunes.apple.com/search?media=music&entity=song&limit=100&term=" . urlencode($_GET["q"]));
else $p->downloadList("http://itunes.apple.com/rss/topsongs/limit=50/explicit=true/json");
$p->generateLinks("http://gdata.youtube.com/feeds/api/videos?alt=json&max-results=1&q=");
echo $p->dumpSongs('
                <tr href="HREF">
                <td class="text-left small"><img src="IMG">
                </td>
                <td class="text-left">
                <b>NAME - ARTIST</b>
                </td>
            </tr>');
?>

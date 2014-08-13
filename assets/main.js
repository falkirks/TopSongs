var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};
var currid;
var player = false;
var paused = true;
var spinner = new Spinner(opts).spin(document.getElementById('spin'));
options = {
    namespace: 'ylink'
};
var basil = new window.Basil(options);
options = {
    namespace: 'playlist'
};
var playlist = new window.Basil(options);

$.get( "/render.php", function( data ) {
    $( ".table-hover" ).html( data );
    $("#spin").hide();
    $(document).on('click', 'tr', function(event){
        if(basil.get($(this).attr("waiting")) == null){
            var id = this;
            $.get( "/render.php?song=" + $(this).attr("waiting"), function( data ) {
                basil.set($(id).attr("waiting"), data);
                runPlayer($(id).attr("waiting"));
                renderControls(id);
            });
        }
        else{
            runPlayer($(this).attr("waiting"));
            renderControls(this);
        }
    });
    $( "#search-box" ).submit(function( event ) {
        if($("#search-text").val() !== ""){
            $("#spin").show();
            $.get( "/render.php?q=" + encodeURIComponent($( "#search-text").val()), function( data ) {
                $( ".table-hover" ).html( data );
                $("#spin").hide();
            });
            $( "#search-text").val("");
        }
        event.preventDefault();
    });
    $(document).on('click', '#play-control-icon', function(){
        if(player){
            if(player.paused()){
                player.play();
                $(this).removeClass("glyphicon-play");
                $(this).addClass("glyphicon-pause");
            }
            else{
                player.pause();
                $(this).removeClass("glyphicon-pause");
                $(this).addClass("glyphicon-play");
            }
        }
    });
    $(document).on('click', '#main-link', function(){
        $("#spin").show();
        $.get( "/render.php", function( data ) {
            $( ".table-hover" ).html( data );
            $("#spin").hide();
        });
    });
    $(document).on('click', '#search-link', function(){
        $("#search-box").fadeToggle();
    });
    $(document).on('click', '#playlists-link', function(event){
        alertify.prompt("What playlist do you want to start playing?", function (e, str) {
            if (e) {
                p = playlist.get(str);
                if(p == null){
                    alertify.log("Playlist doesn't exist.");
                }
                else{
                    $("#spin").show();
                    $.post( "/render.php", { playlist: p.join('%%%')}, function( data ) {
                        $( ".table-hover" ).html( data );
                        $("#spin").hide();
                    });
                }
            }
        }, "main");
    });
    $(document).on('click', '#playlist-icon', function(event){
        alertify.prompt("What playlist do you want to add/remove this song from?", function (e, str) {
            if (e) {
                p = playlist.get(str);
                if(p == null) p = [];
                id = inArray(currid, p);
                if(id === false){
                    p.push(currid);
                    playlist.set(str, p);
                    alertify.log("Added.");
                }
                else{
                    p.splice(id, 1);
                    if(p.length == 0) playlist.remove(str);
                    else playlist.set(str, p);
                    alertify.log("Removed.");
                }
            }
        }, "main");
    });

});
function runPlayer(id){
    if(player){
        player.dispose();
        $('<video id="player" src="" width="0" height="0" preload="auto"></video>').appendTo( "body" );
    }
    $("#spin").show();
    currid = id;
    videojs('player', { "techOrder": ["youtube"], "src": basil.get(id) }).ready(function() {
        player = this;
        player.play();
        $("#spin").hide();
        $("#play-control-icon").removeClass("glyphicon-play");
        $("#play-control-icon").addClass("glyphicon-pause");
    });
}
function renderControls(id){
    $(".blur").attr("src", $(id).find("img").attr("src")); //Render blurred cover
    if(!$("#controls").is(":visible")) $("#controls").fadeIn(); //Fade in if not visible

}
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return i;
    }
    return false;
}

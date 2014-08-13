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
var player = false;
var paused = true;
var spinner = new Spinner(opts).spin(document.getElementById('spin'));
options = {
    namespace: 'topsongs'
};
var basil = new window.Basil(options);
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
    $(document).on('click', '#play-control-icon', function(event){
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
});
function runPlayer(id){
    if(player){
        player.dispose();
        $('<video id="player" src="" width="0" height="0" preload="auto" loop="loop"></video>').appendTo( "body" );
    }
    $("#spin").show();
    videojs('player', { "techOrder": ["youtube"], "src": basil.get(id) }).ready(function() {
        player = this;
        player.play();
        $("#spin").hide();
    });
}
function renderControls(id){
    $(".blur").attr("src", $(id).find("img").attr("src")); //Render blurred cover
    if(!$("#controls").is(":visible")) $("#controls").fadeIn(); //Fade in if not visible
}


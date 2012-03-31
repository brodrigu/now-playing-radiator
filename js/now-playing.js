NowPlaying = function(api, user, interval) {
    this.api = api;
    this.user = user;
    
    /* AutoUpdate frequency - Last.fm API rate limits at 1/sec */
    this.interval = interval || 10;
};
NowPlaying.prototype = {
    
    display: function(track)
    {        
        $('#artist').text(track.artist);
        $('#track').text(track.name);
        $('#user').text(track.user);
    },
    
    update: function()
    {
        this.api.getNowPlayingTrack(
            this.user,
            jQuery.proxy(this.handleResponse, this), 
            function(error) { console && console.log(error); }
        );
    },
    
    autoUpdate: function()
    {
        // Do an immediate update, don't wait an interval period
        this.update();
        
        // Try and avoid repainting the screen when the track hasn't changed
        setInterval(jQuery.proxy(this.update, this), this.interval * 1000);
    },
    
    handleResponse: function(response)
    {
        console.log(response);
        if (response) {
            this.display({
                // The API response can vary depending on the user, so be defensive
                artist: response.artist,
                name: response.track,
                user: response.user
            });
        }
        else {
            this.display({artist: ' ', name: '', user: ''});
        }
    }
};
/* 
 * A simple wraper to basic Facebook Graph API functionality
 *
 * eliant on jquery.
 *
 * @todo add a error callback, catch and handle facebook errors
 *
 */
FacebookAPI = function(access_token) {
    this.access_token = access_token;
};
FacebookAPI .prototype = {
    root: 'https://graph.facebook.com/',
    
    get: function (method, params, success, error)
    {
        jQuery.ajax({
            url: this.root + method,
            dataType: "jsonp",
            data: {
                'access_token': this.access_token,
            },
            // Forces JSONP errors to fire, needs re-evaluation if long polling is used
            timeout: 2000
        })
        .success(function(response) { 
            (response.error ? error : success)(response);
        })
        .error(function() {
            // JSONP limitations mean we'll only get timeout errors
            console.log({error: 0, message: 'HTTP Error'});
        });
    },
    
    getNowPlayingTrack: function(user, success, error)
    {
        var self = this;
        this.get(user + '/music.listens', {user: user}, function(response) {

            try{ 
                if (!response.data.length) {
                    success(false);
                }

                var track = {
                    id:  response.data[0].data.song.id,
                    artist: '',
                    track: response.data[0].data.song.title,
                    album: response.data[0].data.album ? response.data[0].data.album.title : '',
                    user: response.data[0].from.name,
                    time: response.data[0].publish_time,
                    img: ''
                }

                self.getTrackArtist(track, success, error);
            } catch (err) {};

        }, error);
    },

    // This is stupid, facebook should give you teh artist name...
    getTrackArtist: function (track, success, error)
    {
        this.get(track.id, {}, function(response) {
            console.log(response);
            if (!response.data) {
                success(false);
            }

            try {
                track.artist = response.data.musician[0].name;
            } catch (err) {}

            try {
                track.album = response.data.album[0].url.title;
            } catch (err) {}

            try {
                track.img = response.data.image[0].url;
            } catch (err) {}

            success(track);

        }, error);
    }
};
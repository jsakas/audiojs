/* 

AudioJS / ReactJS Demo 

*/

var audio = new WebAudio();
var tracks =[
    {"id":100001,"artist":"Unknown Artist","title":"Track 1","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+1&w=500&h=500&txttrack=0","file":"audio/sample_1.mp3"},
    {"id":100002,"artist":"Unknown Artist","title":"Track 2","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+2&w=500&h=500&txttrack=0","file":"audio/sample_2.mp3"},
    {"id":100003,"artist":"Unknown Artist","title":"Track 3","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+3&w=500&h=500&txttrack=0","file":"audio/sample_3.mp3"},
    {"id":100004,"artist":"Unknown Artist","title":"Track 4","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+4&w=500&h=500&txttrack=0","file":"audio/sample_4.mp3"},
    {"id":100005,"artist":"Unknown Artist","title":"Track 5","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+5&w=500&h=500&txttrack=0","file":"audio/sample_5.mp3"},
    {"id":100006,"artist":"Unknown Artist","title":"Track 6","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+6&w=500&h=500&txttrack=0","file":"audio/sample_6.mp3"},
    {"id":100007,"artist":"Unknown Artist","title":"Track 7","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+7&w=500&h=500&txttrack=0","file":"audio/sample_7.mp3"}
]
var defaultArtwork = 'https://placeholdit.imgix.net/~text?txtsize=100&txt=Default&w=500&h=500&txttrack=0';

var AlbumArt = React.createClass({
    render: function() {
        return (
            <div className="album-art">
                <img src={this.props.url} />
            </div>
        );
    }
});


var ProgressBar = React.createClass({
    render: function() {
        return (
            <progress value="0" max="100" id="audio-progress" className="audio-progress"></progress>
        );
    },
    componentDidMount: function() {
        var el = document.getElementById('audio-progress');
        this.props.init(el);
    }
});


var GlobalControls = React.createClass({
    render: function() {
        var play = this.props.play;
        var stop = this.props.stop;
        var prev = this.props.prev;
        var next = this.props.next;
        return (
            <div className="global-controls">
                <span id="play-all" className="glyphicon glyphicon-play" onClick={play}></span>
                <span id="stop-all" className="glyphicon glyphicon-stop" onClick={stop}></span>
                <span id="play-previous" className="glyphicon glyphicon-backward" onClick={prev}></span>
                <span id="play-next" className="glyphicon glyphicon-forward" onClick={next}></span>
            </div>
        );
    }
});


var QueueList = React.createClass({
    render: function() {
        var queue_position = this.props.queue_position;
        var currently_playing_id = this.props.currently_playing_id;
        var is_playing = this.props.is_playing;
        var remove = this.props.remove;
        var play = this.props.play;
        var queueNodes = this.props.queue.map(function(item, index) {
            var currently_playing = ((index === queue_position && currently_playing_id === item.metadata.id && is_playing) ? true : false)
            return (
                <QueueItem 
                    key={index}
                    index={index}
                    item={item}
                    play={play}
                    remove={remove}
                    currently_playing={currently_playing}
                    queue_position={queue_position}
                />
            );
        });

        return (
            <div>
                <h4>Queue</h4>
                <ul className="queue-container">
                    {queueNodes}
                </ul>
            </div>
        );
    }
});


var QueueItem = React.createClass({
    render: function() {
        var trackClass = 'queue-item';
        trackClass = (this.props.currently_playing ? trackClass += ' playing' : trackClass);
        return (
            <li className={trackClass} data-position={this.props.index} onClick={this.play}>{this.props.item.metadata.title}
                <span className="glyphicon glyphicon-remove" onClick={this.remove}></span>
            </li>
        );
    },
    play: function() {
        this.props.play(this.props.index);
    },
    remove: function(e) {
        e.stopPropagation();
        this.props.remove(this.props.index);
    }
});


var CurrentPlayableTracks = React.createClass({
     render: function() {
        var play = this.props.play;
        var add = this.props.add;
        var currently_playing_id = this.props.currently_playing_id;
        var is_playing = this.props.is_playing;
        var trackNodes = this.props.tracks.map(function(track) {
            var currently_playing = ((is_playing && track.id === currently_playing_id) ? true : false)
            return (
                <Track 
                    key={track.id}
                    id={track.id}
                    artist={track.artist}
                    title={track.title} 
                    track={track}
                    play={play}
                    add={add}
                    currently_playing={currently_playing}
                />
            );
        });

        return (
            <div>
                {trackNodes}
            </div>
        );

     }
});


var Track = React.createClass({
    render: function() {
        var trackClass = 'track';
        trackClass = (this.props.currently_playing ? trackClass += ' playing' : trackClass);
        return (
            <div className={trackClass} data-audio-source="{this.props.url}">
                <span className="glyphicon glyphicon-play grid-play" onClick={this.play}></span>
                <span className="glyphicon glyphicon-plus" onClick={this.add}></span>
                <span>{this.props.artist} - {this.props.title}</span>
            </div>
        )
    },
    play: function(e) {
        this.props.play(this.props.track);
    },
    add: function(e) {
        this.props.add(this.props.track);
    }
});


var AudioPlayer = React.createClass({
    getInitialState: function() {
        return {
            tracks: tracks,
            audio: audio,
            queue: audio.queue,
            currently_playing_id: 0,
            queue_position: 0,
            artwork: defaultArtwork
        }
    },
    componentWillMount: function() {

    },
    componentDidMount: function() {
        document.addEventListener('audiojs:ended', this.playNext);
        var body = document.getElementById('audio-player');
        body.classList.add('loaded');
    },
    render: function() {
        return (
            <div className="row main-body">
                <div className="col-md-3 currently-playing">
                    <AlbumArt 
                        url={this.state.artwork}
                    />
                    <ProgressBar 
                        init={this.initProgressBar} 
                    />
                    <GlobalControls 
                        play={this.playQueue} 
                        stop={this.stop} 
                        prev={this.playPrevious} 
                        next={this.playNext} 
                    />
                    <QueueList 
                        queue={this.state.queue}
                        queue_position={this.state.queue_position}
                        play={this.playIndex}
                        remove={this.remove}
                        currently_playing_id={this.state.currently_playing_id}
                        is_playing={this.state.audio.isPlaying()}
                    />
                </div>
                <div className="col-md-9 playable-tracks">
                    <CurrentPlayableTracks 
                        tracks={this.state.tracks} 
                        play={this.playTrack} 
                        add={this.add} 
                        currently_playing_id={this.state.currently_playing_id}
                        is_playing={this.state.audio.isPlaying()}
                    />
                </div>
            </div>
        );
    },
    currentlyPlaying: function() {
        try {
            var currentTrack = audio.getCurrentTrack();
            return currentTrack.metadata.id;
        } catch (e) {
            return 0;
        }
    },
    currentArtwork: function() {
        try {
            var currentTrack = audio.getCurrentTrack();
            return currentTrack.metadata.artwork;
        } catch (e) {
            return defaultArtwork;
        }
    },
    playQueue: function() {
        audio.start();
        this.customSetState();
    },
    playTrack: function(track) {
        audio.startInstant(track);
        this.customSetState();
    },
    stop: function() {
        audio.stop();
        var state = {
            currently_playing_id: 0
        }
        this.customSetState(state);
    },
    add: function(track) {
        audio.addQueue(track);
        this.customSetState();
    },
    remove: function(position) {
        var state = {}
        if (position == audio.getQueuePosition()) {
            audio.stop();
            audio.setQueuePosition(0);
            state = {
                currently_playing_id: 0,
                artwork: defaultArtwork
            }
        }
        audio.removeFromQueue(position);
        this.customSetState(state);
    },
    playPrevious: function() {
        audio.playPrevious();
        this.customSetState();
    },
    playNext: function() {
        audio.playNext();
        this.customSetState();
    },
    playIndex: function(index) {
        audio.playIndex(index);
        this.customSetState();
    },
    initProgressBar: function(el) {
        audio.initProgressBar(el);
    },
    customSetState: function(overrides = {}) {
        var state = {
            audio: audio,
            queue: audio.getQueue(),
            currently_playing_id: this.currentlyPlaying(),
            queue_position: audio.getQueuePosition(),
            artwork: this.currentArtwork(),
        }
        for (var attrname in overrides) { state[attrname] = overrides[attrname]; }
        this.setState(state);
    },

});

ReactDOM.render(
    <AudioPlayer />,
    document.getElementById('audio-player')
);

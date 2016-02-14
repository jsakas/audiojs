/* 

AudioJS / ReactJS Demo 

*/

var audio = new WebAudio();



var tracks =[
	{"id":100001,"artist":"Unknown Artist","title":"Track 1","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+1&w=500&h=500&txttrack=0","url":"audio/sample_1.mp3"},
	{"id":100002,"artist":"Unknown Artist","title":"Track 2","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+2&w=500&h=500&txttrack=0","url":"audio/sample_2.mp3"},
	{"id":100003,"artist":"Unknown Artist","title":"Track 3","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+3&w=500&h=500&txttrack=0","url":"audio/sample_3.mp3"},
	{"id":100004,"artist":"Unknown Artist","title":"Track 4","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+4&w=500&h=500&txttrack=0","url":"audio/sample_4.mp3"},
	{"id":100005,"artist":"Unknown Artist","title":"Track 5","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+5&w=500&h=500&txttrack=0","url":"audio/sample_5.mp3"},
	{"id":100006,"artist":"Unknown Artist","title":"Track 6","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+6&w=500&h=500&txttrack=0","url":"audio/sample_6.mp3"},
	{"id":100007,"artist":"Unknown Artist","title":"Track 7","artwork":"https://placeholdit.imgix.net/~text?txtsize=100&txt=Track+7&w=500&h=500&txttrack=0","url":"audio/sample_7.mp3"}
]


var AlbumArt = React.createClass({
	render: function() {
		return (
		    <div className="album-art">
	            <img src="http://placehold.it/500x500" />
	        </div>
	    );
	}
});


var ProgressBar = React.createClass({
	render: function() {
		return (
			<progress value="0" max="100" id="audio-progress" className="audio-progress"></progress>
		);
	}
});


var GlobalControls = React.createClass({
	render: function() {
		return (
		    <div className="global-controls">
                <span id="play-all" className="glyphicon glyphicon-play"></span>
                <span id="stop-all" className="glyphicon glyphicon-stop"></span>
                <span id="play-previous" className="glyphicon glyphicon-backward"></span>
                <span id="play-next" className="glyphicon glyphicon-forward"></span>
            </div>
		);
	}
});


var QueueInfo = React.createClass({
	render: function() {
		return (
			<div>
				<h4>Up Next:</h4>
	        	<FullQueue />
			</div>
		);
	}
});


var FullQueue = React.createClass({
	render: function() {
		return (
			<ul>
				<li>TBD...</li>
			</ul>
		);
	}
});


var CurrentPlayableTracks = React.createClass({
     render: function() {

        var trackNodes = this.props.tracks.map(function(track) {
          	return (
             	<Track 
             		key={track.id}
             		artist={track.artist}
             		title={track.title} 
             		url={track.url} />
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
	play: function(e) {
		audio.addQueue({
			url: this.props.url
		});
		audio.start();
		audio.logQueue();
		//console.log(track.props.title);
	},
	render: function() {
		return (
			<div className="track" data-audio-source="{this.props.url}">
                <span className="glyphicon glyphicon-play" onClick={this.play}></span>
                <span className="glyphicon glyphicon-plus"></span>
                <span>{this.props.artist} - {this.props.title}</span>
	        </div>
		)
	}
});


var AudioPlayer = React.createClass({
	getInitialState: function() {

		return {
			tracks: tracks,
			audio: audio,
		}
	},
  	render: function() {
	    return (
			<div className="row">
	            <div className="col-md-3 currently-playing">
	            	<AlbumArt />
	                <ProgressBar />
	                <GlobalControls />
	                <QueueInfo />
	            </div>
	            <div className="col-md-9 playable-tracks">
	                <CurrentPlayableTracks tracks={this.state.tracks} />
	            </div>
	        </div>
      	);
    }
});

ReactDOM.render(
    <AudioPlayer />,
    document.getElementById('audio-player')
);



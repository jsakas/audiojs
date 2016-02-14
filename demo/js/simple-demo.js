/* 

AudioJS Demo 

*/

var audio = new WebAudio();


audio.addQueue({
	'file': 'audio/sample_1.mp3',
	'title': 'Track 1',
	'element': document.getElementById('track-1'),
	'play_button': document.getElementById('track-1-play'),
	'queue_button': document.getElementById('track-1-queue')

});

audio.addQueue({
	'file': 'audio/sample_2.mp3',
	'title': 'Track 2',
	'element': document.getElementById('track-2'),
	'play_button': document.getElementById('track-2-play'),
	'queue_button': document.getElementById('track-2-queue')
});

audio.addQueue({
	'file': 'audio/sample_3.mp3',
	'title': 'Track 3',
	'element': document.getElementById('track-3'),
	'play_button': document.getElementById('track-3-play'),
	'queue_button': document.getElementById('track-3-queue')
});


// create play all button
playAll = document.getElementById('play-all');
playAll.addEventListener('click', function() {
	audio.start();
})


// create stop buttom
stopAll = document.getElementById('stop-all');
stopAll.addEventListener('click', function() {
	audio.stop();
})


// create next button
next = document.getElementById('play-next');
next.addEventListener('click', function() {
	audio.playNext();
})


// create previous button
previous = document.getElementById('play-previous');
previous.addEventListener('click', function() {
	audio.playPrevious();
})


// connect the progress bar 
progressBar = document.getElementById('audio-progress');
audio.initProgressBar(progressBar);


// connect the queue
// need to do something with this
playlist = document.getElementById('audio-playlist');


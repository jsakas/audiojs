/* 

AudioJS Demo 

*/

var audio = new WebAudio();


// add a non audio element to queue
audio.addQueue('audio/sample_7.mp3');


// add audio elements to queue
tags =  document.getElementsByTagName('audio');
for (var tag = 0; tag < tags.length; tag++) {
	audio.addQueue(tags[tag]);
}

// add a play button to each audio element
play_buttons = document.getElementsByClassName('play-button');
for (var b = 0; b < play_buttons.length; b++) {
	play_buttons[b].addEventListener('click', function(e, element) {
		audio.startInstant(document.getElementById(this.dataset.audiojsPlay));
	})
}


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


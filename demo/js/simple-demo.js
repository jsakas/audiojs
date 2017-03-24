/* 

AudioJS Demo 

*/

var audio = new WebAudio();
var visualizer = new WebAudioViz(audio, document.getElementById('visualizer')).start();

audio.addQueue(
{
    'file': 'audio/sample_1.mp3',
    'title': 'Track 1',
    'element': document.getElementById('track-1'),
    'play_button': document.getElementById('track-1-play'),
    'queue_button': document.getElementById('track-1-queue')

});

audio.addQueue(
{
    'file': 'audio/sample_2.mp3',
    'title': 'Track 2',
    'element': document.getElementById('track-2'),
    'play_button': document.getElementById('track-2-play'),
    'queue_button': document.getElementById('track-2-queue')
});

audio.addQueue(
{
    'file': 'audio/sample_3.mp3',
    'title': 'Track 3',
    'element': document.getElementById('track-3'),
    'play_button': document.getElementById('track-3-play'),
    'queue_button': document.getElementById('track-3-queue')
});

audio.addQueue(
{
    'file': 'audio/sample_4.mp3',
    'title': 'Track 4',
    'element': document.getElementById('track-4'),
    'play_button': document.getElementById('track-4-play'),
    'queue_button': document.getElementById('track-4-queue')
});

audio.addQueue(
{
    'file': 'audio/sample_5.mp3',
    'title': 'Track 5',
    'element': document.getElementById('track-5'),
    'play_button': document.getElementById('track-5-play'),
    'queue_button': document.getElementById('track-5-queue')
});

audio.addQueue(
{
    'file': 'audio/sample_6.mp3',
    'title': 'Track 6',
    'element': document.getElementById('track-6'),
    'play_button': document.getElementById('track-6-play'),
    'queue_button': document.getElementById('track-6-queue')
});

audio.addQueue(
{
    'file': 'audio/sample_7.mp3',
    'title': 'Track 7',
    'element': document.getElementById('track-7'),
    'play_button': document.getElementById('track-7-play'),
    'queue_button': document.getElementById('track-7-queue')
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


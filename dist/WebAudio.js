'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebAudio = function () {
    function WebAudio() {
        _classCallCheck(this, WebAudio);

        this.analyzer = null;
        this.freqDomain = new Array(1024).fill(0);
        this.timeDomain = new Array(1024).fill(0);
        this.progressBar = null;
        this.playing = false;
        this.time = null;
        this.sampleRate = null;
        this.context;
        this.queue = [];
        this.queuePosition = 0;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    _createClass(WebAudio, [{
        key: 'connect',
        value: function connect() {
            var source = this.audioContext.createBufferSource();
            return source;
        }

        // connect the media element to the destination

    }, {
        key: 'connectMediaElement',
        value: function connectMediaElement(source, mediaElement) {

            var analyzer = this.audioContext.createanalyzer();
            analyzer.smoothingTimeConstant = .9;
            analyzer.fftSize = 2048;

            var gainNode = this.audioContext.createGain();
            gainNode.gain.value = .8;

            var freqDomain = new Uint8Array(analyzer.frequencyBinCount);

            this.analyzer = analyzer;
            this.freqDomain = freqDomain;

            source.connect(analyzer);
            analyzer.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
        }

        // debugging function, logs the queue 

    }, {
        key: 'logQueue',
        value: function logQueue() {
            console.log('queue:' + this.queue);
            console.log('queue position: ' + this.queuePosition);
            console.log('queue length: ' + this.queue.length);
        }
    }, {
        key: 'insertQueue',
        value: function insertQueue(audioElement) {
            this.queue.splice(this.queuePosition, 0, audioElement);
        }
    }, {
        key: 'playPosition',
        value: function playPosition(position) {
            this.stop();
            this.queuePosition = position;
            this.start();
        }
    }, {
        key: 'startInstant',
        value: function startInstant(obj) {
            this.stop();
            this.addQueue(obj);
            this.queuePosition = this.queue.length - 1;
            this.start();
        }
    }, {
        key: 'start',
        value: function start() {
            try {
                // get the current track from the queue
                var currentTrack = this.queue[this.queuePosition];

                // create source from createMediaELementSource
                var source = this.audioContext.createMediaElementSource(currentTrack);

                // connect the source to the destination
                this.connectMediaElement(source, currentTrack);
            } catch (e) {
                console.log('An error occured in WebAudio.start()');
                console.log(e.message);
            } finally {
                if (this.getQueue().length > 0) {
                    currentTrack.currentTime = 0;
                    currentTrack.play();
                    this.playing = true;
                }
            }
        }
    }, {
        key: 'initProgressBar',
        value: function initProgressBar(element) {
            this.progressBar = element;
            this.updateProgressBar(this.progressBar);
        }
    }, {
        key: 'updateProgressBar',
        value: function updateProgressBar() {
            var _this = this;

            try {
                var queue = this.getQueue();
                var currentTime = queue[this.queuePosition].currentTime;
                var duration = queue[this.queuePosition].duration;
            } catch (e) {
                var currentTime = 0;
                var duration = 1;
            } finally {
                var progress = currentTime / duration * 100;
                this.progressBar.setAttribute('value', progress);
                requestAnimationFrame(function () {
                    return _this.updateProgressBar();
                });
            }
        }
    }, {
        key: 'getTime',
        value: function getTime() {
            return audioContext.currentTime;
        }
    }, {
        key: 'getByteFrequencyData',
        value: function getByteFrequencyData() {
            try {
                this.analyzer.getByteFrequencyData(this.freqDomain);
                return this.freqDomain;
            } catch (e) {
                return;
            }
        }
    }, {
        key: 'getByteTimeDomainData',
        value: function getByteTimeDomainData() {
            try {
                this.analyzer.getByteTimeDomainData(this.timeDomain);
                return this.timeDomain;
            } catch (e) {
                return;
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.queue[this.queuePosition].pause();
            this.playing = false;
        }
    }, {
        key: 'stop',
        value: function stop() {
            try {
                this.queue[this.queuePosition].pause();
                this.queue[this.queuePosition].currentTime = 0;
                var e = new Event('audiojs:stopped');
                document.dispatchEvent(e);
            } catch (e) {
                return; // not currently playing
            } finally {
                this.playing = false;
            }
        }
    }, {
        key: 'addQueue',
        value: function addQueue(obj) {
            var _this2 = this;

            var audioElement = document.createElement('audio');
            audioElement.metadata = obj;
            audioElement.setAttribute('crossOrigin', 'anonymous');
            audioElement.setAttribute('src', obj['file']);
            audioElement.setAttribute('preload', 'auto');
            audioElement.load();

            // add queue position to audioElement
            audioElement['queue_position'] = this.queue.length;
            if (obj['play_button']) {
                obj['play_button'].addEventListener('click', function (e) {
                    return _this2.playPosition(audioElement['queue_position']);
                });
            }

            if (obj['element']) {
                audioElement.addEventListener('play', function () {
                    console.log('Audio element has started playback');
                    obj['element'].classList.add('playing');
                });

                audioElement.addEventListener('pause', function () {
                    console.log('Audio element has paused playback');
                    obj['element'].classList.remove('playing');
                });

                audioElement.addEventListener('ended', function () {
                    console.log('Audio element has ended playback');
                    obj['element'].classList.remove('playing');
                });
            }

            audioElement.addEventListener('ended', function () {
                var e = new Event('audiojs:ended');
                document.dispatchEvent(e);
            });

            this.queue.push(audioElement);
        }
    }, {
        key: 'getQueue',
        value: function getQueue() {
            return this.queue;
        }
    }, {
        key: 'getQueuePosition',
        value: function getQueuePosition() {
            return this.queuePosition;
        }
    }, {
        key: 'setQueuePosition',
        value: function setQueuePosition(position) {
            this.queuePosition = position;
        }
    }, {
        key: 'getCurrentTrack',
        value: function getCurrentTrack() {
            return this.queue[this.queuePosition];
        }
    }, {
        key: 'getContext',
        value: function getContext() {
            return this.audioContext;
        }
    }, {
        key: 'removeFromQueue',
        value: function removeFromQueue(position) {
            try {
                // stop audio if removing the currently playing track
                if (position == this.getQueuePosition()) {
                    this.stop();
                }
                // readjust queue position if removing node before currently playing
                if (position < this.getQueuePosition()) {
                    this.setQueuePosition(this.getQueuePosition() - 1);
                }
                this.queue.splice(position, 1);
            } catch (e) {
                // do nothing
            }
        }
    }, {
        key: 'playNext',
        value: function playNext() {
            if (this.queuePosition < this.queue.length - 1) {
                this.stop();
                this.queuePosition += 1;
                this.queue[this.queuePosition].currentTime = 0;
                this.playIndex(this.queue[this.queuePosition]);
                this.start();
            } else {
                this.stop();
            }
        }
    }, {
        key: 'playPrevious',
        value: function playPrevious() {
            var hasPrevious = this.queuePosition > 0 ? true : false;

            if (hasPrevious) {
                // play the previous track
                this.stop();
                this.queuePosition -= 1;
                this.queue[this.queuePosition].currentTime = 0;
                this.connect(this.queue[this.queuePosition]);
                this.start();
            } else {
                // restart the current track
                this.start();
            }
        }
    }, {
        key: 'playIndex',
        value: function playIndex(index) {
            var canPlay = this.queue.length < index + 1 || index > -1 ? true : false;

            if (canPlay) {
                this.stop();
                this.queue[this.queuePosition].currentTime = 0;
                this.setQueuePosition(index);
                this.start();
            }
        }
    }, {
        key: 'isPlaying',
        value: function isPlaying() {
            return this.playing;
        }
    }]);

    return WebAudio;
}();

exports.default = WebAudio;
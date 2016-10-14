var WebAudio = function() {

    var WebAudio = this;

    var currentTime = 0;
    var currentTrack;
    var audioContext;
    var analyser;
    var source;
    var freqDomain;
    var timeDomain;
    var progressBar;


    this.loaded = false;
    this.playing = false;
    this.time = null;
    this.sampleRate = null;
    this.context;
    this.queue = [];
    this.queuePosition = 0;


    // initialize audio context
    this.init = function() {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
    }

    // load / connect a track
    this.load = function() {

        console.log('WebAudio.load() called');
        this.connect();
    }

    // connect to destination
    this.connect = function() {
        
        console.log('WebAudio.connect() called');
        
        source = audioContext.createBufferSource();

        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = .9;
        analyser.fftSize = 2048;

        gainNode = audioContext.createGain();
        gainNode.gain.value = .8;

        freqDomain = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);

        WebAudio.loaded = true;
        loaded = true;

        return source;

    }

    // connect the media element to the destination
    this.connectMediaElement = function(mediaElement) {

        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = .9;
        analyser.fftSize = 2048;

        gainNode = audioContext.createGain();
        gainNode.gain.value = .8;

        freqDomain = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        mediaElement.connect(audioContext.destination);
    }

    // debugging function, logs the queue 
    this.logQueue = function() {
        console.log('queue:' + this.queue);
        console.log('queuePosition: ' + this.queuePosition);
        console.log('queue.length: ' + this.queue.length);
    }

    this.insertQueue = function(audioElement) {
        this.queue.splice(this.queuePosition, 0, audioElement);
    }

    this.playPosition = function(position) {
        this.stop();
        WebAudio.queuePosition = position;
        this.start();
    }

    /**
    * Adds a track to the end of the queue, sets the queue position to the end an starts playback
    */
    this.startInstant = function(obj) {
        this.addQueue(obj);
        this.queuePosition = this.queue.length - 1;
        this.stop();
        this.start();
    }

    this.start = function() {
        try {

            // get the current track from the queue
            currentTrack = this.queue[this.queuePosition];

            // create source from createMediaELementSource
            source = audioContext.createMediaElementSource(currentTrack);

            // connect the source to the destination
            this.connectMediaElement(source, currentTrack);

        } catch (e) {
            console.log('An error occured in WebAudio.start()')
            console.log(e);
        } finally {
            // currentTrack.parentNode.classList.add('playing');
            currentTrack.currentTime = 0;
            currentTrack.play();
            this.playing = true;
        }
    }


    this.initProgressBar = function(element) {
        WebAudio.progressBar = element;

        function update() {
            try {
                currentTime = WebAudio.queue[WebAudio.queuePosition].currentTime;
                duration = WebAudio.queue[WebAudio.queuePosition].duration;
            } catch(e) {
                currentTime = 0;
                duration = 1;
            }
            progress = (currentTime / duration) * 100;
            WebAudio.progressBar.setAttribute('value', progress);
            requestAnimationFrame(update);
        }

        update();

    }


    this.time = function() {
        return audioContext.currentTime;
    }


    this.getByteFrequencyData = function() {
        if (!this.playing) return;
        analyser.getByteFrequencyData(freqDomain);
        return freqDomain;
    }


    this.getByteTimeDomainData = function() {
        if (!playing) return;
        analyser.getByteTimeDomainData(timeDomain);
        return timeDomain;
    }

    this.pause = function() {
        WebAudio.queue[WebAudio.queuePosition].pause();
    }

    this.stop = function() {
        try { 
            currentTrack.pause();
        } catch (e) {
            // not currently playing
        }
    }

    this.addQueue = function(obj) {

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('crossOrigin', 'anonymous');
        audioElement.setAttribute('src', obj['file']);
        audioElement.setAttribute('preload', 'auto');
        audioElement.load();

        // add queue position to audioElement
        audioElement['queue_position'] = this.queue.length;

        if (obj['play_button']) {
            obj['play_button'].addEventListener('click', function() {
                WebAudio.playPosition(audioElement['queue_position']);
            })
        }

        if (obj['element']) {
            audioElement.addEventListener('play', function(){
                console.log('Audio element has started playback');
                obj['element'].classList.add('playing');
            });

            audioElement.addEventListener('pause', function() {
                console.log('Audio element has paused playback');
                obj['element'].classList.remove('playing');
            });

            audioElement.addEventListener('ended', function() {
                console.log('Audio element has ended playback');
                obj['element'].classList.remove('playing');
                WebAudio.playNext();
            });
        }

        this.queue.push(audioElement);

    }

    this.getQueue = function() {
        return this.queue;
    }

    this.playNext = function() {
        WebAudio.queuePosition < WebAudio.queue.length - 1 ? playNext() : false;

        function playNext() {
            WebAudio.stop();
            WebAudio.queuePosition += 1;
            WebAudio.queue[WebAudio.queuePosition].currentTime = 0;
            WebAudio.load(WebAudio.queue[WebAudio.queuePosition]);
            WebAudio.start();
        }
    }

    this.playPrevious = function() {
        WebAudio.queuePosition > 0 ? playPrevious() : restart();

        function playPrevious() {
            WebAudio.stop();
            WebAudio.queuePosition -= 1;
            WebAudio.queue[WebAudio.queuePosition].currentTime = 0;
            WebAudio.load(WebAudio.queue[WebAudio.queuePosition]);
            WebAudio.start();
        }

        function restart() {
            WebAudio.start();
        }
    }

    this.isPlaying = function() {
        return this.playing;
    }

    this.init();

};

var WebAudio = function() {

    var WebAudio = this;

    var loaded = false;
    var playing = false;
    var currentTime = 0;
    var storedBuffer = null;

    this.loaded = false;
    this.playing = false;
    this.time = null;
    this.sampleRate = null;

    var audioContext;
    var analyser;
    var source;
    var freqDomain;
    var timeDomain;

    // init audio context and load the track
    this.init = function(url) {
        // create context
        ac = window.AudioContext || window.webkitAudioContext;
        audioContext = new ac();
        this.getBuffer(url, this.connect);

    }

    this.getBuffer = function(url, callback) {

        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        
        request.onload = function() {
            
            audioContext.decodeAudioData(request.response, function(buffer) {
                storedBuffer = buffer;
                WebAudio.sampleRate = buffer.sampleRate;
                callback(buffer);
            });
            
        };

        request.send();

    }


    this.connect = function(buffer) {

        // create nodes
        source = audioContext.createBufferSource();
        source.buffer = buffer;
        
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

    }

    this.time = function() {
        return audioContext.currentTime;
    }

    this.getByteFrequencyData = function() {
        if (!playing) return;
        analyser.getByteFrequencyData(freqDomain);
        return freqDomain;
    }

    this.getByteTimeDomainData = function() {
        if (!playing) return;
        analyser.getByteTimeDomainData(timeDomain);
        return timeDomain;      
    }


    this.start = function() {
        if (playing) return;
        try {
            source.start(0, currentTime);
            playing = true;
            console.log('playing. currentTime: ' + currentTime);
        } catch (InvalidStateError) {
            console.log('creating buffer...');
            this.connect(storedBuffer);
            this.start();
            
        }
    }

    this.pause = function() {
        if (!playing) return;
        source.stop();
        currentTime = audioContext.currentTime;
        playing = false;
        console.log('pausing. currentTime: ' + currentTime);
    }

    this.stop = function() {
        if (!playing) return;
        source.stop();
        currentTime = 0;
        playing = false;
    }

    this.isLoaded = function() {
        return loaded;
    }

    this.isPlaying = function() {
        return playing;
    }


};

class WebAudio
{

    constructor()
    {
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
        this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
    }

    connect()
    {
        var source = this.audioContext.createBufferSource();
        return source;
    }

    // connect the media element to the destination
    connectMediaElement(source, mediaElement)
    {

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
    logQueue()
    {
        console.log('queue:' + this.queue);
        console.log('queue position: ' + this.queuePosition);
        console.log('queue length: ' + this.queue.length);
    }

    insertQueue(audioElement)
    {
        this.queue.splice(this.queuePosition, 0, audioElement);
    }

    playPosition(position)
    {
        this.stop();
        this.queuePosition = position;
        this.start();
    }

    startInstant(obj)
    {
        this.stop();
        this.addQueue(obj);
        this.queuePosition = this.queue.length - 1;
        this.start();
    }

    start()
    {
        try
        {
            // get the current track from the queue
            var currentTrack = this.queue[this.queuePosition];

            // create source from createMediaELementSource
            var source = this.audioContext.createMediaElementSource(currentTrack);

            // connect the source to the destination
            this.connectMediaElement(source, currentTrack);
        }
        catch (e)
        {
            console.log('An error occured in WebAudio.start()')
            console.log(e.message);
        }
        finally
        {
            if (this.getQueue().length > 0)
            {
                currentTrack.currentTime = 0;
                currentTrack.play();
                this.playing = true;
            }
        }
    }


    initProgressBar(element)
    {
        this.progressBar = element;
        this.updateProgressBar(this.progressBar);
    }

    updateProgressBar()
    {
        try
        {
            var queue = this.getQueue();
            var currentTime = queue[this.queuePosition].currentTime;
            var duration = queue[this.queuePosition].duration;
        }
        catch (e)
        {
            var currentTime = 0;
            var duration = 1;
        }
        finally
        {
            var progress = (currentTime / duration) * 100;
            this.progressBar.setAttribute('value', progress);
            requestAnimationFrame(() => this.updateProgressBar());
        }

    }


    getTime()
    {
        return audioContext.currentTime;
    }


    getByteFrequencyData()
    {
        try {
            this.analyzer.getByteFrequencyData(this.freqDomain);
            return this.freqDomain;
        } catch (e) {
            return;
        }
    }


    getByteTimeDomainData()
    {
        try {
            this.analyzer.getByteTimeDomainData(this.timeDomain);
            return this.timeDomain;
        } catch (e) {
            return;
        }
    }

    pause()
    {
        this.queue[this.queuePosition].pause();
        this.playing = false;
    }

    stop()
    {
        try
        {
            this.queue[this.queuePosition].pause();
            this.queue[this.queuePosition].currentTime = 0;
            var e = new Event('audiojs:stopped');
            document.dispatchEvent(e);
        }
        catch (e)
        {
            return; // not currently playing
        }
        finally
        {
            this.playing = false;
        }
    }

    addQueue(obj)
    {

        var audioElement = document.createElement('audio');
        audioElement.metadata = obj;
        audioElement.setAttribute('crossOrigin', 'anonymous');
        audioElement.setAttribute('src', obj['file']);
        audioElement.setAttribute('preload', 'auto');
        audioElement.load();

        // add queue position to audioElement
        audioElement['queue_position'] = this.queue.length;
        if (obj['play_button'])
        {
            obj['play_button'].addEventListener('click', (e) =>
                this.playPosition(audioElement['queue_position'])
            );
        }

        if (obj['element'])
        {
            audioElement.addEventListener('play', function()
            {
                console.log('Audio element has started playback');
                obj['element'].classList.add('playing');
            });

            audioElement.addEventListener('pause', function()
            {
                console.log('Audio element has paused playback');
                obj['element'].classList.remove('playing');
            });

            audioElement.addEventListener('ended', function()
            {
                console.log('Audio element has ended playback');
                obj['element'].classList.remove('playing');
            });
        }

        audioElement.addEventListener('ended', function()
        {
            var e = new Event('audiojs:ended');
            document.dispatchEvent(e);
        });

        this.queue.push(audioElement);
    }

    getQueue()
    {
        return this.queue;
    }

    getQueuePosition()
    {
        return this.queuePosition;
    }

    setQueuePosition(position)
    {
        this.queuePosition = position;
    }

    getCurrentTrack()
    {
        return this.queue[this.queuePosition];
    }

    getContext()
    {
        return this.audioContext;
    }

    removeFromQueue(position)
    {
        try
        {
            // stop audio if removing the currently playing track
            if (position == this.getQueuePosition())
            {
                this.stop();
            }
            // readjust queue position if removing node before currently playing
            if (position < this.getQueuePosition())
            {
                this.setQueuePosition(this.getQueuePosition() - 1);
            }
            this.queue.splice(position, 1);
        }
        catch (e)
        {
            // do nothing
        }
    }

    playNext()
    {
        if (this.queuePosition < (this.queue.length - 1))
        {
            this.stop();
            this.queuePosition += 1;
            this.queue[this.queuePosition].currentTime = 0;
            this.playIndex(this.queue[this.queuePosition]);
            this.start();
        }
        else
        {
            this.stop();
        }
    }

    playPrevious()
    {
        var hasPrevious = (this.queuePosition > 0 ? true : false);

        if (hasPrevious)
        {
            // play the previous track
            this.stop();
            this.queuePosition -= 1;
            this.queue[this.queuePosition].currentTime = 0;
            this.connect(this.queue[this.queuePosition]);
            this.start();
        }
        else
        {
            // restart the current track
            this.start();
        }
    }

    playIndex(index)
    {
        var canPlay = (this.queue.length < (index + 1) || index > -1) ? true : false;

        if (canPlay)
        {
            this.stop();
            this.queue[this.queuePosition].currentTime = 0;
            this.setQueuePosition(index);
            this.start();
        }
    }

    isPlaying()
    {
        return this.playing;
    }
}

export default WebAudio

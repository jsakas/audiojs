var WebAudioViz = function() {

    var audioContext;
    var vizCanvas;
    var vizContext;
    var freqData;

    var height = 40;

    this.init = function(context, canvas) {
        audioContext = context;
        vizCanvas = canvas;
        vizContext = vizCanvas.getContext('2d');

    }

    this.start = function() {
        console.log('Starting visualizer');
        window.requestAnimationFrame(go);
    }

    this.stop = function() {
        window.cancelAnimationFrame(go);
    }

    function go() {

        if (audioContext.isPlaying()) {

            freqData = audioContext.getByteFrequencyData();

            if (freqData != undefined) {                
                try {
                    draw(freqData);
                } catch (e) {
                    console.log(e.message);
                }

            }

        } else if (freqData != undefined && !(audioContext.isPlaying())) {
            // start the nice fade out of the lines
            // subtract one from each value and render
            freqData.forEach(function(part, index, arr) {
                arr[index] > 0 ? arr[index] -= 1 : 0;
            });
            draw(freqData);

        }

        window.requestAnimationFrame(go);

    }

    function draw(freqData) {

        var width = vizCanvas.parentNode.clientWidth;
        var height = vizCanvas.parentNode.offsetHeight;

        vizCanvas.setAttribute('width', width);
        vizCanvas.setAttribute('height', height);
        vizContext.clearRect(0, 0, vizCanvas.width, vizCanvas.height);

        drawPosition = 0;
        //barWidth = vizCanvas.width / (freqData.length * 3);
        barWidth = 1;

        // draw spectrum analysis
        vizContext.beginPath();
        for (var i = 0; i < freqData.length; i++) {

            // freqData maxes out around 127, so get the percent, then 
            vizContext.moveTo(drawPosition, vizCanvas.height - (vizCanvas.height * (freqData[i] / 400)));
            vizContext.lineTo(drawPosition, vizCanvas.height);
            vizContext.strokeStyle = 'rgba(62,184,189,1)';
            vizContext.lineWidth = barWidth;

            drawPosition += barWidth + 2;
        }
        vizContext.stroke();

    }

}

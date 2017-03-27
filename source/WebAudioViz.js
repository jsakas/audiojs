class WebAudioViz
{
    constructor(context, canvas, draw=false)
    {
        this.audioContext = context;
        this.vizCanvas = canvas;
        this.vizContext = this.vizCanvas.getContext('2d');
        if (draw) {
            this.draw = draw;
        }
    }

    start()
    {
        console.log('Starting visualizer...');
        this.go()
    }

    go()
    {
        var freqData = this.audioContext.getByteFrequencyData();

        if (this.audioContext.isPlaying())
        {
            if (freqData != undefined)
            {
                try
                {
                    this.draw(freqData);
                }
                catch (e)
                {
                    console.log(e.message);
                }

            }

        }
        else if (freqData != undefined && !(this.audioContext.isPlaying()))
        {
            // start the nice fade out of the lines
            // subtract one from each value and render
            freqData.forEach(function(part, index, arr)
            {
                arr[index] > 0 ? arr[index] -= 1 : 0;
            });
            this.draw(freqData);

        }

        window.requestAnimationFrame(() => this.go());

    }

    draw(freqData)
    {
        var width = this.vizCanvas.parentNode.clientWidth;
        var height = this.vizCanvas.parentNode.offsetHeight;

        this.vizCanvas.setAttribute('width', width);
        this.vizCanvas.setAttribute('height', height);
        this.vizContext.clearRect(0, 0, this.vizCanvas.width, this.vizCanvas.height);

        var drawPosition = 0;
        var barWidth = 1;

        // draw spectrum analysis
        this.vizContext.beginPath();
        for (var i = 0; i < freqData.length; i++)
        {

            // freqData maxes out around 127, so get the percent, then 
            this.vizContext.moveTo(drawPosition, this.vizCanvas.height - (this.vizCanvas.height * (freqData[i] / 400)));
            this.vizContext.lineTo(drawPosition, this.vizCanvas.height);
            this.vizContext.strokeStyle = 'rgba(62,184,189,1)';
            this.vizContext.lineWidth = barWidth;

            drawPosition += barWidth + 2;
        }
        this.vizContext.stroke();

    }

}

export default WebAudioViz

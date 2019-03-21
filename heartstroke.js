class HeartStroke {
    constructor(options) {

        this.element = options.element ? options.element : console.log("No svg element provided");
        this.duration = options.duration || 2500;
        this.callback = options.callback;
        this.start = 0;

        this.pathes = this.element.querySelectorAll("path, circle, rect, polygon, altGlyph, ellipse, poluline, text, textPath, tref, tspan");

        this.pathTotalLength = [...this.pathes].map(el => {
            const pathLength = el.getTotalLength();
            el.style.strokeDasharray = `${pathLength}, ${pathLength}`;
            el.style.strokeDashoffset = pathLength;

            return pathLength;
        });


    }

    animate() {

        const now = performance.now();
        const progress = (now - this.startTime) / this.duration;

        [...this.pathes].forEach((el, i) => {
            const value = (easings.easeInOutQuint(progress) * (this.pathTotalLength[i] - this.start)) + this.pathTotalLength[i];

            el.style.strokeDashoffset = -value;
        });
        
        this.raf = requestAnimationFrame(this.animate.bind(this));

        if(now - this.startTime > this.duration) {
            this.pause();
            this.callback(this.element);
        }


    }

    play() {
        this.startTime = performance.now();

        this.animate();
    }

    pause() {
        cancelAnimationFrame(this.raf);
    }
}

(() => {
  let cvs = document.getElementById("canvas"),
    ctx = cvs.getContext("2d"),
    H = cvs.height = window.innerHeight,
    W = cvs.width = window.innerWidth,
    RAF = window.requestAnimationFrame,
    dots = [],
    dotCount = 200;

  cvs.onmousemove = (e) => {
    dots.length > dotCount && dots.splice(dotCount);
    dots.push(new Dot(e.offsetX, e.offsetY, 0, 0))
  };

  class Dot {
    constructor(x = Math.random() * W,
                y = Math.random() * H,
                s = (Math.random() * 30 + 20) / 60,
                a = Math.random() * 2 * Math.PI) {
      // dot
      this.x = x;
      this.y = y;
      this.s = s;
      this.a = a;
      this.r = .7;
      this.color = "#fff";

      // line
      this.maxD = 100;
      this.maxW = 0.7;
      this.maxA = 1;
    }

    render() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }

    move() {
      this.x += this.s * Math.cos(this.a);
      this.y += this.s * Math.sin(this.a);
      // rebound
      this.a = (this.x <= 0 || this.x >= W)
        ? Math.PI - this.a
        : (this.y <= 0 || this.y >= H)
          ? Math.PI * 2 - this.a
          : this.a;
    }

    connect(dot) {
      let dd = Math.sqrt(Math.pow(this.x - dot.x, 2) + Math.pow(this.y - dot.y, 2));
      if (dd <= this.maxD) {
        let rate = (this.maxD - dd) / this.maxD;
        ctx.beginPath();
        ctx.lineWidth = this.maxW * rate;
        ctx.strokeStyle = "rgba(255, 255, 255, " + this.maxA * rate + ")";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(dot.x, dot.y);
        ctx.stroke();
      }
    }
  }

  let animate = () => {
    ctx.clearRect(0, 0, W, H);
    for (let dot of dots) {
      dot.render();
      dot.move();
    }

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        dots[i].connect(dots[j]);
      }
    }

    return RAF(animate)
  };

  (() => {
    for (let i = 0; i < dotCount; i++) {
      dots.push(new Dot())
    }

    animate()
  })()

})();
(() => {
  const AC = new window.AudioContext(),
    analyser = AC.createAnalyser(),
    gainNode = AC.createGain(),
    dest = AC.destination,
    rd = Math.random,
    audio = new Audio(),
    RAF = window.requestAnimationFrame,
    src = "Heroeswithin_roshan.mp3";

  gainNode.connect(dest);

  let cvs = document.getElementById("canvas"),
    ctx = cvs.getContext("2d"),
    W = cvs.width = 800,
    H = cvs.height = 512,
    Spectrums = [],
    Dots = [],
    counts = 128;

  let grd = ctx.createLinearGradient(0, 50, 0, 220);
  grd.addColorStop(0, "#f00");
  grd.addColorStop(0.5, "#ff0");
  grd.addColorStop(1, "#0f0");

  cvs.onmousewheel = (e) => {
    if (e.deltaY > 0) {
      gainNode.gain.value > 0 && (gainNode.gain.value -= 0.05)
    }
    else {
      gainNode.gain.value < 1 && (gainNode.gain.value += 0.05)
    }
  };


  class Spectrum {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.dh = 0;
      this.dl = 3;
      this.grd = grd;
    }

    draw() {
      this.dh = this.h > this.dh ? this.h : this.dh;
      ctx.fillStyle = this.grd;
      ctx.fillRect(this.x, this.y - this.h, this.w, this.h);
      ctx.fillRect(this.x, this.y - this.dh - this.dl * 2, this.w, this.dl);
    }

    update(h) {
      this.h = h;
      this.dh -= 0.5
    }
  }

  class Dot {
    constructor(x, y, c, r) {
      this.x = x;
      this.y = y;
      this.c = c;
      this.r = r;
      this.grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 10);
      this.grd.addColorStop(0, this.c);
      this.grd.addColorStop(1, '#fff');
    }

    draw () {
      ctx.beginPath();
      ctx.fillStyle = this.grd;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill()
    }

    update(r) {
      this.r = r;
    }

  }


  let animate = () => {
    let len = analyser.frequencyBinCount,
      arr = new Uint8Array(len);
    analyser.getByteFrequencyData(arr);

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < counts; i++) {
      let st = Spectrums[i],
        dot = Dots[i],
        tone = arr[~~(i * arr.length / counts)];
      st.draw();
      st.update(tone);
      dot.draw();
      dot.update(tone / 256 * 10)
    }
    RAF(animate)
  };


  (() => {
    audio.src = src;
    audio.loop = "loop";
    audio.load();
    audio.play();

    let bufferSrc = AC.createMediaElementSource(audio);
    bufferSrc.connect(analyser);
    analyser.connect(gainNode);

    let aw = W / counts,
      w = aw - 3;
    for (let i = 0; i < counts; i++) {
      Spectrums.push(new Spectrum(i * aw, H / 2, w, 0));
      Dots.push(new Dot(
        rd() * W,
        rd() * (H / 2 - 10) + H / 2 + 10,
        'rgb(' + ~~(rd() * 256) + ',' + ~~(rd() * 256) + ',' + ~~(rd() * 256) + ')',
        0))
    }
    animate()
  })();

})();
(() => {
  const cvs = document.getElementById('canvas'),
    ctx = cvs.getContext('2d'),
    RAF = window.requestAnimationFrame,
    SRY_TPL = "assets/sorry/template.mp4",
    WJZ_TPL = "assets/wangjz/template.mp4",
    video = document.createElement('video'),
    outputMaxWidth = 570;

  let W, H, _line,
    SRY_LINES = [
      {start: 0.97, end: 1.50, line: "好啊"},
      {start: 3.11, end: 4.39, line: "就算你是一流工程师"},
      {start: 5.18, end: 7.26, line: "就算你出报告再完美"},
      {start: 7.26, end: 9.91, line: "我叫你改报告你就改报告"},
      {start: 10.00, end: 11.26, line: "毕竟我是客户"},
      {start: 11.63, end: 12.70, line: "客户了不起啊"},
      {start: 13.61, end: 16.01, line: "sorry 客户就是了不起"},
      {start: 18.08, end: 19.60, line: "以后天天叫他改报告"},
      {start: 19.60, end: 21.60, line: "天天改 天天改"}
    ],
    WJZ_LINES = [];

  video.muted = true;


  video.addEventListener("timeupdate", () => {
    let _t = video.currentTime,
      _lo = SRY_LINES.find((i) => { return i.start < _t && i.end > _t});
    _line = _lo && _lo.line
  });

  document.getElementById('render').addEventListener('click', () => {
    init();
  });

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(video, 0, 0);
    _line && ctx.fillText(_line, 285, 290);
    return RAF(animate)
  };


  let init = () => {
    const gif = new GIF({
      workers: 1,
      quality: 10,
      workerScript: './lib/gif.worker.js'
    });
    video.src = SRY_TPL;
    video.onloadeddata = () => {
      W = cvs.width = video.videoWidth;
      H = cvs.height = video.videoHeight;
      let duration = video.duration,
        framesCount = duration * 1000 / 50,
        rate = W > outputMaxWidth ? outputMaxWidth / W : 1;
      gif.setOptions({
        width: W * rate,
        height: H * rate
      });

      ctx.scale(rate, rate);

      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      video.play();
      for (let i of new Array(framesCount)) {
        gif.addFrame(ctx, {delay: 50})
      }
      gif.render();
    };
    gif.on('finished', (blob) => {
      window.open(URL.createObjectURL(blob));
    })
  };

  animate();

  init();

})();

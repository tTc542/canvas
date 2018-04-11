(() => {
  const cvs = document.getElementById('canvas'),
    ctx = cvs.getContext('2d'),
    RAF = window.requestAnimationFrame,
    SRY_TPL = "assets/sorry/template.mp4",
    WJZ_TPL = "assets/wangjz/template.mp4",
    video = document.createElement('video'),
    gif = new GIF({
      workers: 2,
      quality: 10
    });

  gif.setOptions({
    width: 570,
    height: 320
  });

  // video.loop = "loop";
  video.muted = true;

  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";

  let SRY_CONF = [
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
    WJZ_CONF = [];

  let _line = undefined;

  video.addEventListener("timeupdate", () => {
    let _t = video.currentTime,
      _lo = SRY_CONF.find((i) => { return i.start < _t && i.end > _t});
    _line = _lo && _lo.line
  });

  document.getElementById('render').addEventListener('click', () => {
    init()
  });

  const animate = () => {

    ctx.drawImage(video, 0, 0);

    if (_line) {
      ctx.fillText(_line, 285, 290);
      // ctx.strokeText(_line, 285, 290);
    }
    gif.addFrame(ctx);

    return RAF(animate)
  };

  gif.render();

  gif.on('finished', (blob) => {
    console.log(1, blob);
    window.open(URL.createObjectURL(blob));
  });



  let init = () => {
    video.src = SRY_TPL;
    video.onloadeddata = () => {
      cvs.width = video.videoWidth;
      cvs.height = video.videoHeight;
      video.play();
      animate()
    };
  };

  init()

})();

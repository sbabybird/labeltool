function RectLabel(x, y) {
  var ox = x;
  var oy = y;
  var nx = x;
  var ny = y;
  var isFeedback = true;

  this.endFeedback = function(x, y) {
    isFeedback = false;
    ox -= x;
    oy -= y;
    nx -= x;
    ny -= y;
  };

  this.newPoint = function(x, y) {
    nx = x;
    ny = y;
  };

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(nx, oy);
    ctx.lineTo(nx, ny);
    ctx.lineTo(ox, ny);
    ctx.lineTo(ox, oy);
    ctx.stroke();
    ctx.restore();
  };
};

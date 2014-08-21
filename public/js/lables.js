function RulerLabel() {
  var p1 = {x:0, y:0};
  var p2 = {x:0, y:0};
  var isFeedback = true;
  var isVertical = true;

  this.clone = function() {
    var r = new RulerLabel();
    r.setVertical(isVertical);
    r.setP1(p1);
    r.setP2(p2);
    return r;
  };

  this.endFeedback = function(x, y) {
    isFeedback = false;
    p1.x -= x;
    p1.y -= y;
    p2.x -= x;
    p2.y -= y;
  };

  this.setVertical = function(b) {
    isVertical = b;
  };

  this.setP1 = function(p) {
    p1 = p;
  };

  this.setP2 = function(p) {
    p2 = p;
  };

  this.getP1 = function() {
    return p1;
  }

  this.getP2 = function() {
    return p2;
  };

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(p1.x-2, p1.y-2, 4, 4);
    ctx.strokeRect(p2.x-2, p2.y-2, 4, 4);
    ctx.beginPath();
    ctx.setLineDash([0, 0]);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([5]);
    if (isVertical) {
      ctx.moveTo(0, p1.y);
      ctx.lineTo(render.width, p1.y);
      ctx.moveTo(0, p2.y);
      ctx.lineTo(render.width, p2.y);
    }
    else {
      ctx.moveTo(p1.x, 0);
      ctx.lineTo(p1.x, render.height);
      ctx.moveTo(p2.x, 0);
      ctx.lineTo(p2.x, render.height);
    }
    ctx.stroke();
    ctx.setLineDash([0, 0]);
    var distance = isVertical ? Math.abs(p2.y-p1.y):Math.abs(p2.x-p1.x);
    var text = '' + distance;
    ctx.textAlign = 'center';
    ctx.textBaseline='middle';
    ctx.strokeStyle = 'white';
    ctx.strokeText(text, (p1.x+p2.x)/2, (p1.y+p2.y)/2);
    ctx.fillStyle = 'red';
    ctx.fillText(text, (p1.x+p2.x)/2, (p1.y+p2.y)/2);

    ctx.restore();
  };
};

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

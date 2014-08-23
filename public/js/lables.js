function ColorLabel() {
  var p1 = {x:0, y:0};
  var p2 = {x:0, y:0};
  var isFeedback = true;
  var isLeft = true;
  var colorText = '#ffffff';

  this.clone = function() {
    var c = new ColorLabel();
    c.setP1(p1);
    c.setP2(p2);
    c.setLeft(isLeft);
    c.setColorText(colorText);
    return c;
  };

  this.endFeedback = function(x, y) {
    isFeedback = false;
    p1.x -= x;
    p1.y -= y;
    p2.x -= x;
    p2.y -= y;
  };

  this.setLeft = function(b) {
    isLeft = b;
  };

  this.setColorText = function(t) {
    colorText = t;
  };

  this.setP1 = function(p) {
    p1.x = p.x;
    p1.y = p.y;
  };

  this.setP2 = function(p) {
    p2.x = p.x;
    p2.y = p.y;
  };

  this.drawPickPoint = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(p1.x-2, p1.y-2, 4, 4);
    ctx.restore();
  };

  this.drawLine = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#ff0000';
    ctx.moveTo(p1.x+3, p1.y-3);
    ctx.lineTo(p1.x+9, p1.y-9);
    ctx.lineTo(p1.x+25, p1.y-9);
    ctx.stroke();
    ctx.restore();
  };

  this.drawColor = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.fillStyle = colorText;
    ctx.beginPath();
    ctx.rect(p1.x+25, p1.y-9-6, 11, 11);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  this.drawText = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline='middle';
    ctx.strokeStyle = 'white';
    ctx.strokeText(colorText, p1.x+25+15, p1.y-9-3);
    ctx.fillStyle = 'red';
    ctx.fillText(colorText, p1.x+25+15, p1.y-9-3);
    ctx.restore();
  };

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    this.drawPickPoint(render);
    this.drawLine(render);
    this.drawColor(render);
    this.drawText(render);
    ctx.restore();
  };
};

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
    p1.x = p.x;
    p1.y = p.y;
  };

  this.setP2 = function(p) {
    p2.x = p.x;
    p2.y = p.y;
  };

  this.getP1 = function() {
    return {x:p1.x, y:p1.y};
  }

  this.getP2 = function() {
    return {x:p2.x, y:p2.y};
  };

  this.drawFeedback = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.setLineDash([5]);
    ctx.beginPath();
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
    ctx.restore();
  };

  this.drawLine = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.save();
    ctx.translate(p1.x, p1.y);
    if (isVertical) {
      ctx.rotate(Math.PI);
    }
    else {
      ctx.rotate(Math.PI/2);
    }
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(4, 0);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(p2.x, p2.y);
    if (isVertical) {
      ctx.rotate(Math.PI);
    }
    else {
      ctx.rotate(Math.PI/2);
    }
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(4, 0);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  };

  this.drawText = function(render) {
    var ctx = render.ctx;
    ctx.save();
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

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    else {
      this.drawFeedback(render);
    }
    this.drawLine(render);
    this.drawText(render);
    ctx.restore();
  };
};

function RectLabel() {
  var p1 = {x:0, y:0};
  var p2 = {x:0, y:0};
  var isFeedback = true;

  this.clone = function() {
    var r = new RectLabel();
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

  this.setP1 = function(p) {
    p1 = p
  };

  this.setP2 = function(p) {
    p2 = p;
  };

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y);
    ctx.restore();
  };
};

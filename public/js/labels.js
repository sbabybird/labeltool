function ColorLabel() {
  var p1 = {x:0, y:0};
  var p2 = {x:0, y:0};
  var isFeedback = true;
  var quadrant = 1;
  var colorText = '#ffffff';

  this.clone = function() {
    var c = new ColorLabel();
    c.setP1(p1);
    c.setP2(p2);
    c.setQuadrant(quadrant);
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

  this.setQuadrant = function(q) {
    quadrant = q;
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

  this.getP1 = function() {
    return {x:p1.x, y:p1.y};
  };

  this.getP2 = function() {
    return {x:p2.x, y:p2.y};
  };

  this.get3Point = function() {
    var ps = {};
    switch (quadrant) {
      case 1:
        ps.pa = {x:p1.x+3, y:p1.y-3};
        ps.pb = {x:p1.x+9, y:p1.y-9};
        ps.pc = {x:p1.x+25, y:p1.y-9};
        break;
      case 2:
        ps.pa = {x:p1.x+3, y:p1.y+3};
        ps.pb = {x:p1.x+9, y:p1.y+9};
        ps.pc = {x:p1.x+25, y:p1.y+9};
        break;
      case 3:
        ps.pa = {x:p1.x-3, y:p1.y+3};
        ps.pb = {x:p1.x-9, y:p1.y+9};
        ps.pc = {x:p1.x-25, y:p1.y+9};
        break;
      case 4:
        ps.pa = {x:p1.x-3, y:p1.y-3};
        ps.pb = {x:p1.x-9, y:p1.y-9};
        ps.pc = {x:p1.x-25, y:p1.y-9};
        break;
      default:break;
    }
    return ps;
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
    var ps = this.get3Point();
    ctx.moveTo(ps.pa.x, ps.pa.y);
    ctx.lineTo(ps.pb.x, ps.pb.y);
    ctx.lineTo(ps.pc.x, ps.pc.y);
    ctx.stroke();
    ctx.restore();
  };

  this.drawColor = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.fillStyle = colorText;
    ctx.beginPath();
    if (quadrant == 3 || quadrant == 4) {
      ctx.rect(p2.x-6, p2.y-6, 11, 11);
    }
    else {
      ctx.rect(p2.x, p2.y-6, 11, 11);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  this.drawText = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (quadrant == 3 || quadrant ==4 ) {
      ctx.textAlign = 'right';
      ctx.textBaseline='middle';
      ctx.strokeStyle = 'white';
      ctx.strokeText(colorText, p2.x-10, p2.y-3);
      ctx.fillStyle = 'red';
      ctx.fillText(colorText, p2.x-10, p2.y-3);
    }
    else {
      ctx.textAlign = 'left';
      ctx.textBaseline='middle';
      ctx.strokeStyle = 'white';
      ctx.strokeText(colorText, p2.x+15, p2.y-3);
      ctx.fillStyle = 'red';
      ctx.fillText(colorText, p2.x+15, p2.y-3);
    }
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
  var isPress = false;

  this.clone = function() {
    var r = new RulerLabel();
    r.setVertical(isVertical);
    r.setPress(isPress);
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

  this.setPress = function(b) {
    isPress = b;
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

  this.drawCross = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(p1.x-10, p1.y);
    ctx.lineTo(p1.x+10, p1.y);
    ctx.moveTo(p1.x, p1.y-10);
    ctx.lineTo(p1.x, p1.y+10);
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
    var text = '' + distance>0 ? distance:'';
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
      if (!isPress) {
        this.drawCross(render);
      }
      else {
        this.drawFeedback(render);
      }
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
  var labelText = '';

  this.clone = function() {
    var r = new RectLabel();
    r.setP1(p1);
    r.setP2(p2);
    r.setLabelText(labelText);
    return r;
  };

  this.endFeedback = function(x, y) {
    isFeedback = false;
    p1.x -= x;
    p1.y -= y;
    p2.x -= x;
    p2.y -= y;
  };

  this.setLabelText = function(t) {
    labelText = t;
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
  };

  this.getP2 = function() {
    return {x:p2.x, y:p2.y};
  };

  this.drawCross = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(p1.x-10, p1.y);
    ctx.lineTo(p1.x+10, p1.y);
    ctx.moveTo(p1.x, p1.y-10);
    ctx.lineTo(p1.x, p1.y+10);
    ctx.stroke();
    ctx.restore();
  };

  this.drawRect = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.setLineDash([5]);
    ctx.strokeRect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y);
    ctx.restore();
  };

  this.drawText = function(render) {
    var ctx = render.ctx;
    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline='middle';
    ctx.strokeStyle = 'white';
    ctx.strokeText(labelText, p1.x+3, p1.y-9);
    ctx.fillStyle = 'red';
    ctx.fillText(labelText, p1.x+3, p1.y-9);
    ctx.restore();
  };

  this.draw = function(render) {
    var ctx = render.ctx;
    ctx.save();
    if (!isFeedback) {
      ctx.translate(render.xoffset, render.yoffset);
    }
    this.drawCross(render);
    this.drawRect(render);
    this.drawText(render);
    ctx.restore();
  };
};


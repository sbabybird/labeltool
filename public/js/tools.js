function ToolColor(canvas) {
  var isPress = false;
  var color = new ColorLabel();

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    color.setP1({x:e.clientX, y:e.clientY});
    isPress = true;
  };

  this.onMouseUp = function(e) {
    isPress = false;
    var tmp = color.clone();
    tmp.endFeedback(canvas.getRender().xoffset, canvas.getRender().yoffset);
    canvas.getLabelLayer().add(tmp);
    canvas.draw();
  };

  this.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  this.rgbToHex = function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  };

  this.onMouseMove = function(e) {
    color.setP1({x:e.clientX, y:e.clientY});
    var iw = canvas.getImgLayer().getWidth();
    var ih = canvas.getImgLayer().getHeight();
    var ps = canvas.client2img({x:e.clientX, y:e.clientY});
    if (ps.x>=0 && ps.x<iw-90) {
      if (ps.y>=90 && ps.y<ih) {
        color.setQuadrant(1);
        color.setP2({x:e.clientX+25, y:e.clientY-9});
      }
      else {
        color.setQuadrant(2);
        color.setP2({x:e.clientX+25, y:e.clientY+9});
      }
    }
    else {
      if (ps.y>=90 && ps.y<ih) {
        color.setQuadrant(4);
        color.setP2({x:e.clientX-25, y:e.clientY-9});
      }
      else {
        color.setQuadrant(3);
        color.setP2({x:e.clientX-25, y:e.clientY+9});
      }
    }
    canvas.draw();
    var pixel = canvas.getRender().ctx.getImageData(e.clientX, e.clientY, 1, 1);
    color.setColorText(this.rgbToHex(pixel.data[0], pixel.data[1], pixel.data[2]));
    color.draw(canvas.getRender());
  };

};

function ToolRuler(canvas) {
  var isPress = false;
  var ruler = new RulerLabel();

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    var p = canvas.snapPoint({x:e.clientX, y:e.clientY});
    ruler.setP1({x:p.x, y:p.y});
    isPress = true;
    ruler.setPress(true);
  };

  this.onMouseUp = function(e) {
    isPress = false;
    ruler.setPress(false);
    tmp = ruler.clone();
    tmp.endFeedback(canvas.getRender().xoffset, canvas.getRender().yoffset);
    canvas.getLabelLayer().add(tmp);
    canvas.draw();
  };

  this.onMouseMove = function(e) {
    var p = canvas.snapPoint({x:e.clientX, y:e.clientY});
    if (isPress) {
      var isVertical = (Math.abs(p.x-ruler.getP1().x) > Math.abs(p.y-ruler.getP1().y)) ? false:true; 
      if (isVertical) {
        ruler.setP2({x:ruler.getP1().x, y:p.y});
      }
      else {
        ruler.setP2({x:p.x, y:ruler.getP1().y});
      }
      ruler.setVertical(isVertical);
    }
    else {
      ruler.setP1({x:p.x, y:p.y});
      ruler.setP2({x:p.x, y:p.y});
    }
    canvas.draw();
    ruler.draw(canvas.getRender());
  };

};

function ToolCoord(canvas) {
  var isPress = false;
  var rect = new RectLabel();

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    var p = canvas.snapPoint({x:e.clientX, y:e.clientY});
    rect.setP1({x:p.x, y:p.y});
    isPress = true;
  };

  this.onMouseUp = function(e) {
    isPress = false;
    var tmp = rect.clone();
    tmp.endFeedback(canvas.getRender().xoffset, canvas.getRender().yoffset);
    canvas.getLabelLayer().add(tmp);
    canvas.draw();
  };

  this.getLabelText = function(p1, p2) {
    var text = '';
    var ps = canvas.client2img(p1);
    if (p1.x == p2.x && p1.y == p2.y) {
      text = ''+ps.x+','+ps.y;
    }
    else {
      text = ''+ps.x+','+ps.y+','+(p2.x-p1.x)+','+(p2.y-p1.y);
    }
    return text;
  };

  this.onMouseMove = function(e) {
    var p = canvas.snapPoint({x:e.clientX, y:e.clientY});
    if (isPress) {
      if (p.x>rect.getP1().x && p.y>rect.getP1().y) {
        rect.setP2({x:p.x, y:p.y});
      }
      else {
        rect.setP2(rect.getP1());
      }
    }
    else {
      rect.setP1({x:p.x, y:p.y});
      rect.setP2({x:p.x, y:p.y});
    }
    canvas.draw();
    rect.setLabelText(this.getLabelText(rect.getP1(), rect.getP2()));
    rect.draw(canvas.getRender());
  };

  this.onKeyDown = function(e) {
  };

  this.onKeyUp = function(e) {
  };

};

function ToolPan(canvas) {
  var isPress = false;
  var ox = 0;
  var oy = 0;

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    ox = e.clientX;
    oy = e.clientY;
    isPress = true;
  };

  this.onMouseUp = function(e) {
    isPress = false;
  };

  this.onMouseMove = function(e) {
    if (isPress) {
      var x = e.clientX;
      var y = e.clientY;
      canvas.getRender().xoffset += (x-ox);
      canvas.getRender().yoffset += (y-oy);
      canvas.draw();
      ox = x;
      oy = y;
    }
  };

  this.onKeyDown = function(e) {
  };

  this.onKeyUp = function(e) {
  };

};


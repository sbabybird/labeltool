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

  this.onMouseMove = function(e) {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    color.setP1({x:e.clientX, y:e.clientY});
    canvas.draw();
    var pixel = canvas.getRender().ctx.getImageData(e.clientX, e.clientY, 1, 1);
    color.setColorText(rgbToHex(pixel.data[0], pixel.data[1], pixel.data[2]));
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
    ruler.setP1({x:e.clientX, y:e.clientY});
    isPress = true;
  };

  this.onMouseUp = function(e) {
    isPress = false;
    tmp = ruler.clone();
    tmp.endFeedback(canvas.getRender().xoffset, canvas.getRender().yoffset);
    canvas.getLabelLayer().add(tmp);
    canvas.draw();
  };

  this.onMouseMove = function(e) {
    if (isPress) {
      var isVertical = (Math.abs(e.clientX-ruler.getP1().x) > Math.abs(e.clientY-ruler.getP1().y)) ? false:true; 
      if (isVertical) {
        ruler.setP2({x:ruler.getP1().x, y:e.clientY});
      }
      else {
        ruler.setP2({x:e.clientX, y:ruler.getP1().y});
      }
      ruler.setVertical(isVertical);
    }
    else {
      ruler.setP1({x:e.clientX, y:e.clientY});
      ruler.setP2({x:e.clientX, y:e.clientY});
    }
    canvas.draw();
    ruler.draw(canvas.getRender());
  };

};

function ToolDrawRect(canvas) {
  var isPress = false;
  var rect = new RectLabel();

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    rect.setP1({x:e.clientX, y:e.clientY});
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
    var ow = canvas.getImgLayer().getWidth();
    var oh = canvas.getImgLayer().getHeight();
    var px = p1.x+Math.floor((ow-canvas.getRender().width)/2)-canvas.getRender().xoffset;
    var py = p1.y+Math.floor((oh-canvas.getRender().height)/2)-canvas.getRender().yoffset;
    if (p2.x && p1.y == p2.y) {
      text = ''+px+','+py;
    }
    else {
      text = ''+px+','+py+','+(p2.x-p1.x)+','+(p2.y-p1.y);
    }
    return text;
  };

  this.onMouseMove = function(e) {
    if (isPress) {
      if (e.clientX>rect.getP1().x && e.clientY>rect.getP1().y) {
        rect.setP2({x:e.clientX, y:e.clientY});
      }
      else {
        rect.setP2(rect.getP1());
      }
    }
    else {
      rect.setP1({x:e.clientX, y:e.clientY});
      rect.setP2({x:e.clientX, y:e.clientY});
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


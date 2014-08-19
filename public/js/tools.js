function ToolDrawRect(canvas) {
  var isPress = false;
  var ox = 0;
  var oy = 0;
  var tmpRect;

  this.start = function() {
  };

  this.end = function() {
  };

  this.onMouseDown = function(e) {
    tmpRect = new RectLabel(e.clientX, e.clientY);
    isPress = true;
  };

  this.onMouseUp = function(e) {
    isPress = false;
    tmpRect.endFeedback(canvas.getRender().xoffset, canvas.getRender().yoffset);
    canvas.getLabelLayer().add(tmpRect);
    canvas.draw();
  };

  this.onMouseMove = function(e) {
    if (isPress) {
      canvas.draw();
      tmpRect.newPoint(e.clientX, e.clientY);
      tmpRect.draw(canvas.getRender());
    }
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
};


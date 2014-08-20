function BgLayer(render) {
  this.draw = function() {
    render.ctx.fillStyle = '#efefef';
    render.ctx.fillRect(0, 0, render.width, render.height);
  };
};

function ImgLayer(render, url) {
  var img = new Image();
  var px = 0;
  var py = 0;
  img.src = url;
  img.onload = function() {
    px = (render.width-img.width)/2;
    py = (render.height-img.height)/2;
    render.ctx.drawImage(img, px, py);
  };

  this.draw = function() {
    render.ctx.save();
    render.ctx.translate(render.xoffset, render.yoffset);
    render.ctx.drawImage(img, px, py);
    render.ctx.restore();
  };
};

function LabelLayer(render) {
  var labelObjects = new Array();

  this.add = function(label) {
    labelObjects.push(label);
  };

  this.draw = function() {
    for (var i = 0; i<labelObjects.length; i++) {
      labelObjects[i].draw(render);
    }
  };
};

function Canvas(id) {
  var toolPool = {};
  var curToolName = '';
  var bgLayer;
  var imgLayer;
  var labelLayer;

  var c = $(id).get(0);
  c.width = $(window).width();
  c.height = $(window).height();

  var ctx = c.getContext('2d');

  var render = {};
  render.ctx = ctx;
  render.width = canvas.width;
  render.height = canvas.height;
  render.xoffset = 0;
  render.yoffset = 0;

  this.setTool = function(name, tool) {
    toolPool[name] = tool;
  };

  this.setCurTool = function(name) {
    if (toolPool[curToolName]) {
      toolPool[curToolName].end();
    }
    curToolName = name;
    if (toolPool[curToolName]) {
      toolPool[curToolName].start();
    }
  };

  this.setBgLayer = function(layer) {
    bgLayer = layer;
  };

  this.setImgLayer = function(layer) {
    imgLayer = layer;
  };

  this.setLabelLayer = function(layer) {
    labelLayer = layer;
  };

  this.getLabelLayer = function() {
    return labelLayer;
  };

  this.draw = function() {
    if (bgLayer) bgLayer.draw();
    if (imgLayer) imgLayer.draw();
    if (labelLayer) labelLayer.draw();
  };

  $(c).mousedown(function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseDown(e);
  });

  $(c).mouseup(function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseUp(e);
  });

  $(c).mousemove(function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseMove(e);
  });

  this.getRender = function() {
    return render;
  };

};


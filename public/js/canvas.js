function BgLayer(render) {
  var info = 'Drag and drop files here';
  this.draw = function() {
    render.ctx.save();
    render.ctx.fillStyle = '#eeeeee';
    render.ctx.fillRect(0, 0, render.width, render.height);
    render.ctx.strokeStyle = '#dddddd';
    for (var i = 0; i<render.width; i+=10) {
      render.ctx.beginPath();
      render.ctx.moveTo(i+0.5, 0+0.5);
      render.ctx.lineTo(i+0.5, render.height+0.5);
      render.ctx.stroke();
    }
    for (var j = 0; j<render.height; j+=10) {
      render.ctx.beginPath();
      render.ctx.moveTo(0+0.5, j+0.5);
      render.ctx.lineTo(render.width+0.5, j+0.5);
      render.ctx.stroke();
    }
    render.ctx.fillStyle = '#0f0f0f';
    render.ctx.font = '30px Arial';
    render.ctx.textAlign = 'center';
    render.ctx.textBaseline = 'middle';
    render.ctx.fillText(info, render.width/2, render.height/2);
    render.ctx.restore();
  };
};

function ImgLayer(render, url, imgLoaded) {
  var img = new Image();
  var px = 0;
  var py = 0;
  img.src = url;
  img.onload = function() {
    px = (render.width-img.width)/2;
    py = (render.height-img.height)/2;
    render.ctx.drawImage(img, px, py);
    imgLoaded();
  };

  this.draw = function() {
    render.ctx.save();
    render.ctx.translate(render.xoffset, render.yoffset);
    render.ctx.drawImage(img, px, py);
    render.ctx.restore();
  };

  this.getWidth = function() {
    return img.width;
  };

  this.getHeight = function() {
    return img.height;
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

  this.clean = function() {
    labelObjects.length = 0;
  };
};

function Canvas(c) {
  var toolPool = {};
  var curToolName = '';
  var bgLayer;
  var imgLayer;
  var labelLayer;

  var render = {};
  render.ctx = canvas.getContext('2d');
  render.width = canvas.width;
  render.height = canvas.height;
  render.xoffset = 0;
  render.yoffset = 0;

  this.reset = function() {
    render.xoffset = 0;
    render.yoffset = 0;
    labelLayer.clean();
  };

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

  this.getImgLayer = function() {
    return imgLayer;
  };

  this.getLabelLayer = function() {
    return labelLayer;
  };

  this.draw = function() {
    if (bgLayer) bgLayer.draw();
    if (imgLayer) imgLayer.draw();
    if (labelLayer) labelLayer.draw();
  };

  this.onMouseDown = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseDown(e);
  };

  this.onMouseUp = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseUp(e);
  };

  this.onMouseMove = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onMouseMove(e);
  };

  this.onKeyDown = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onKeyDown(e);
  };

  this.onKeyUp = function(e) {
    if (toolPool[curToolName]) toolPool[curToolName].onKeyUp(e);
  };

  this.getRender = function() {
    return render;
  };

  this.toDataURL = function() {
    // 由于初始化img图层时将其偏移了px和py
    // 然后最后输出时，重置画布大小，并将偏移值取反，即可
    // 输出图片之后，再恢复偏移
    var ow = canvas.width;
    var oh = canvas.height;
    var ox = render.xoffset;
    var oy = render.yoffset;
    render.width = canvas.width = imgLayer.getWidth();
    render.height = canvas.height = imgLayer.getHeight();
    render.xoffset = (canvas.width - ow)/2;
    render.yoffset = (canvas.height -oh)/2;
    this.draw();
    var data = canvas.toDataURL();
    render.width = canvas.width = ow;
    render.height = canvas.height = oh;
    render.xoffset = ox;
    render.yoffset = oy;
    this.draw();
    return data;
  };

  this.client2img = function(p) {
    var ow = imgLayer.getWidth();
    var oh = imgLayer.getHeight();
    var px = p.x+Math.floor((ow-render.width)/2)-render.xoffset;
    var py = p.y+Math.floor((oh-render.height)/2)-render.yoffset;
    return {x:px, y:py};
  };

  this.img2client = function(p) {
    var ow = imgLayer.getWidth();
    var oh = imgLayer.getHeight();
    var px = p.x-Math.floor((ow-render.width)/2)+render.xoffset;
    var py = p.y-Math.floor((oh-render.height)/2)+render.yoffset;
    return {x:px, y:py};
  };

  this.setCursor = function(name) {
    c.style.cursor = name;
  };

  this.snapPoint = function(p) {
    var ps = this.client2img(p);
    var ow = imgLayer.getWidth();
    var oh = imgLayer.getHeight();
    if ((ps.x>=0 && ps.x<10) || (ps.x<0 && ps.x>-10)) ps.x = 0;
    if ((ps.y>=0 && ps.y<10) || (ps.y<0 && ps.y>-10)) ps.y = 0;
    if ((ps.x<=ow && ps.x>ow-10) || (ps.x>ow && ps.x<ow+10)) ps.x = ow;
    if ((ps.y<=oh && ps.y>oh-10) || (ps.y>oh && ps.y<oh+10)) ps.y = oh;
    p = this.img2client(ps);
    return p;
  };
};


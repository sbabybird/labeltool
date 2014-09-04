function BgLayer(render) {
  var info = 'Drag and drop files here';
  this.draw = function() {
    render.ctx.save();
    render.ctx.fillStyle = '#eeeeee';
    render.ctx.fillRect(0, 0, render.width, render.height);
    render.ctx.strokeStyle = '#dddddd';
    for (var i = 0; i<render.width; i+=10) {
      render.ctx.beginPath();
      render.ctx.moveTo(i, 0);
      render.ctx.lineTo(i, render.height);
      render.ctx.stroke();
    }
    for (var j = 0; j<render.height; j+=10) {
      render.ctx.beginPath();
      render.ctx.moveTo(0, j);
      render.ctx.lineTo(render.width, j);
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
  img.src = url;
  img.onload = function() {
    render.xoffset = Math.floor((render.width-img.width)/2);
    render.yoffset = Math.floor((render.height-img.height)/2);
    render.ctx.drawImage(img, 0, 0);
    imgLoaded();
  };

  this.draw = function() {
    render.ctx.save();
    render.ctx.translate(render.xoffset, render.yoffset);
    render.ctx.drawImage(img, 0, 0);
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

  this.clean = function() {
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
    render.ctx.save();
    /*
    render.ctx.translate(render.wdith/2, render.height/2);
    render.ctx.scale(2, 2);
    render.ctx.translate((render.wdith/2)*-1, (render.height/2)*-1);
    */
    render.ctx.translate(0.5, 0.5);
    if (bgLayer) bgLayer.draw();
    render.ctx.translate(-0.5, -0.5);
    if (imgLayer) imgLayer.draw();
    render.ctx.translate(0.5, 0.5);
    if (labelLayer) labelLayer.draw();
    render.ctx.restore();
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
    // 由于初始化时为了使图片剧中，整体将render进行偏移了x和y
    // 然后最后输出时，重置画布大小，并将偏移值归零
    // 为了输出整幅图片，所以等于重置了漫游工具的值
    // 输出图片之后，再恢复现场
    var ow = canvas.width;
    var oh = canvas.height;
    var ox = render.xoffset;
    var oy = render.yoffset;
    render.width = canvas.width = imgLayer.getWidth();
    render.height = canvas.height = imgLayer.getHeight();
    render.xoffset = 0;
    render.yoffset = 0;
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
    return {x:p.x-render.xoffset, y:p.y-render.yoffset};
  };

  this.img2client = function(p) {
    return {x:p.x+render.xoffset, y:p.y+render.yoffset};
  };

  this.setCursor = function(name) {
    c.style.cursor = name;
  };

  this.snapPoint = function(p) {
    var ps = this.client2img(p);
    var ow = imgLayer.getWidth()-1;
    var oh = imgLayer.getHeight()-1;
    if ((ps.x>=0 && ps.x<10) || (ps.x<0 && ps.x>-10)) ps.x = 0;
    if ((ps.y>=0 && ps.y<10) || (ps.y<0 && ps.y>-10)) ps.y = 0;
    if ((ps.x<=ow && ps.x>ow-10) || (ps.x>ow && ps.x<ow+10)) ps.x = ow;
    if ((ps.y<=oh && ps.y>oh-10) || (ps.y>oh && ps.y<oh+10)) ps.y = oh;
    p = this.img2client(ps);
    return p;
  };
};


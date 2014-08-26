$(function() {
  var canvas = $('#canvas').get(0);
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  var c = new Canvas(canvas);

  $(canvas).mousedown(c.onMouseDown);
  $(canvas).mouseup(c.onMouseUp);
  $(canvas).mousemove(c.onMouseMove);

  c.setBgLayer(new BgLayer(c.getRender()));
  c.setImgLayer(new ImgLayer(c.getRender(), 'image/demo.jpg'));
  c.setLabelLayer(new LabelLayer(c.getRender()));

  c.setTool('coord', new ToolCoord(c));
  c.setTool('pan', new ToolPan(c));
  c.setTool('ruler', new ToolRuler(c));
  c.setTool('color', new ToolColor(c));

  $('#toolbar .openfile').click(function() {
    openImg();
  });

  $('#toolbar .pan').click(function() {
    c.setCurTool('pan');
  });

  $('#toolbar .rulerlabel').click(function() {
    c.setCurTool('ruler');
  });

  $('#toolbar .colorlabel').click(function() {
    c.setCurTool('color');
  });

  $('#toolbar .coordlabel').click(function() {
    c.setCurTool('coord');
  });

  $('#toolbar .textlabel').click(function() {
    c.setCurTool('text');
  });

  $('#toolbar .savefile').click(function() {
    saveImg(c);
  });

  c.draw();
});

function openImg() {
  ;
}

function saveImg(src) {
  var url = src.toDataURL();
  var a = $("<a href='"+url+"' target='_blank'>Save</a>").get(0);
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  a.dispatchEvent(e);
};


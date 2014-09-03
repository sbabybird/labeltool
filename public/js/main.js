$(function() {
  var canvas = $('#canvas').get(0);
  canvas.width = $(window).width();
  canvas.height = $(window).height();

  var c = new Canvas(canvas);

  $(canvas).mousedown(c.onMouseDown);
  $(canvas).mouseup(c.onMouseUp);
  $(canvas).mousemove(c.onMouseMove);

  c.setBgLayer(new BgLayer(c.getRender()));
  c.setImgLayer(new ImgLayer(c.getRender(), 'image/demo.jpg', function(){
    c.draw();
  }));
  c.setLabelLayer(new LabelLayer(c.getRender()));

  c.setTool('coord', new ToolCoord(c));
  c.setTool('pan', new ToolPan(c));
  c.setTool('ruler', new ToolRuler(c));
  c.setTool('color', new ToolColor(c));

  $('#toolbar .openfile').click(function() {
    openImg(c);
  });

  $('#toolbar .pan').click(function() {
    c.setCurTool('pan');
    c.setCursor('pointer');
  });

  $('#toolbar .rulerlabel').click(function() {
    c.setCurTool('ruler');
    c.setCursor('none');
  });

  $('#toolbar .colorlabel').click(function() {
    c.setCurTool('color');
    c.setCursor('none');
  });

  $('#toolbar .coordlabel').click(function() {
    c.setCurTool('coord');
    c.setCursor('none');
  });

  $('#toolbar .textlabel').click(function() {
    c.setCurTool('text');
    c.setCursor('text');
  });

  $('#toolbar .savefile').click(function() {
    saveImg(c);
  });

  $('#selectfile').change(function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      c.setBgLayer(new BgLayer(c.getRender()));
      c.setImgLayer(new ImgLayer(c.getRender(), reader.result, function() {
        c.clean();
        c.draw();
      }));
      c.setLabelLayer(new LabelLayer(c.getRender()));
    };
    reader.readAsDataURL(file);
  });

  addDNDListeners(c); //add drag and drop event listeners

  c.draw();
});

function openImg(c) {
  var selectfile = $('#selectfile').get(0);
  var file = selectfile.files[0];
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  selectfile.dispatchEvent(e);
}

function saveImg(src) {
  var url = src.toDataURL();
  var a = $("<a href='"+url+"' target='_blank'>Save</a>").get(0);
  var e = document.createEvent('MouseEvents');
  e.initEvent('click', true, true);
  a.dispatchEvent(e);
};

function addDNDListeners(c) {
  var cd = $('#canvas_div').get(0);
  cd.addEventListener('dragenter', function(e) {
    e.stopPropagation();
    e.preventDefault();
  }, false);

  cd.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
  }, false);

  cd.addEventListener('drop', function(e) {
    var files = e.dataTransfer.files;
    e.stopPropagation();
    e.preventDefault();
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function() {
      c.setBgLayer(new BgLayer(c.getRender()));
      c.setImgLayer(new ImgLayer(c.getRender(), reader.result, function() {
        c.clean();
        c.draw();
      }));
      c.setLabelLayer(new LabelLayer(c.getRender()));
    };
    reader.readAsDataURL(file);
  }, false);
}


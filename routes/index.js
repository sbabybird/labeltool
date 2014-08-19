module.exports = function(app) {
  app.get('/test', function(req, res) {
    res.send('ok');
  });
};
/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/

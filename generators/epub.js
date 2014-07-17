var Peepub = require('pe-epub');

var getPages = function(data){
  return [{
    title: 'Epub',
    body: data.body
  }];
};

module.exports = {
  generate: function(data, fn){
    var epub = new Peepub({
      title: data.title,
      cover: data.cover,
      pages: getPages(data)
    });
    epub.create('./tmp/').then(function(res){
      fn(null, {
        path: res
      });
    });
  }
};
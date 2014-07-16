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
      cover: 'http://placekitten.com/600/800',
      pages: getPages(data)
    });
    epub.create('/tmp/').then(fn);
  }
};
var phantom = require('phantom');
var jade = require('jade');
var fs = require('fs');
var path = require('path');

var getHtml = function(data, fn){
  jade.renderFile('./templates/pdf.jade', data, fn);
};

var writeFile = function(data, name, fn){
  fs.writeFile('./tmp/' + name, data, fn);
};

module.exports = {
  generate: function(data, name, fn){
    getHtml(data, function(err, data){
      writeFile(data, name + '.html', function(){
        phantom.create(function (ph) {
          ph.createPage(function (page) {
            page.open('file:///' + __dirname + '/../tmp/' + name + '.html', function (status) {
              page.set('paperSize', {
                format: 'Letter'
              }, function(){});
              page.render('./tmp/' + name + '.pdf', function(){
                console.log('file written to disk');
                ph.exit();
                fn(null, {
                  path: './tmp/' + name + '.pdf'
                });
              });
            });
          });
        });
      });
    });
  }
};
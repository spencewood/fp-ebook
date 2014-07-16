var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');

var region = 'us-west-2';
var bucket = 'fastpencildemo';
var s3Url = 'https://s3-' + region + '.amazonaws.com/' + bucket + '/';

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  region: region
});

module.exports = {
  uploadFile: function(filePath, fn){
    fs.readFile(filePath, function (err, data) {
      if (err) { throw err; }

      var base64data = new Buffer(data, 'binary');
      var filename = path.basename(filePath);

      var s3 = new AWS.S3();
      s3.putObject({
        Bucket: bucket,
        Key: filename,
        Body: base64data,
        ACL: 'public-read'
      }, function(err, res){
        fn(err, {
          location: s3Url + filename
        });
      });
    });
  }
};
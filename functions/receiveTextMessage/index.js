exports.handle = function(e, ctx, cb) {
  console.log('EVENT', e);
  cb(null, e);
}

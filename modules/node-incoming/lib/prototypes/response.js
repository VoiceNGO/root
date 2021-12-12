function writeError(err) {
  console.error(err);
  process.exit();
}

function writeResponse(resp) {
  console.log(resp);
}

module.exports.init = function() {
  this.on('error', writeError);
  this.on('response', writeResponse);
};

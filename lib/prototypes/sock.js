var fs  = require('fs');
var net = require('net');

/**
 * Test to see if a sock file already exists
 *
 * @param  {String}  sockFile Sock file
 * @return {Promise} Resolves if the socket is listening, or rejects with whatever code is returned
 */
function isSockOpen(sockFile) {
  return new Promise(function(resolve, reject) {
    var client = net
      .connect({path: sockFile}, function() {
        client.end();
        resolve();
      })
      .on('error', function(err) {
        reject(err.code);
      });
  });
}

/**
 * Removes the existing sockFile
 *
 * @param  {String} sockFile Sock file
 * @return {Promise} A promise that resolves when the file is removed
 */
function cleanSock(sockFile) {
  return new Promise(function(resolve, reject) {
    fs.unlink(sockFile, function(err) {
      err ? reject(err) : resolve();
    });
  });
}

/**
 * Sets up a net listner on the given socket, passing data onto the app via `.call(data)`
 *
 * @param  {String}   sockFile sock file
 * @param  {Incoming} incoming Incoming instance
 */
function listenSock(sockFile, incoming) {
  var server = net.createServer(function(client) {
    var data = '';

    // consume each line as a JSON object
    function consumeData() {
      var ix;
      while (ix = data.indexOf('\n')) {
        var json = JSON.parse(data.substr(0, ix).trim());
        if (json) {
          incoming.call(json)
            .then(function(resp) {
              client.write(resp);
            })
            .catch(function(err) {
              client.write('ERROR: ' + err.toString());
            });
        }
        data = data.substr(ix + 1);
      }
    }

    client.on('data', function(buffer) {
      data += buffer.toString();
      consumeData();
    });
  });

  // clean up the sock file
  incoming.on('exit', function() {
    server.close();
  });

  server.listen(sockFile, function() { console.log('Listening on socket: ' + sockFile); });
}

/**
 * Removes all of the existing `program` listeners that may have been added by the app and adds a custom listener that
 * transfers the parsed args to the primary instance of the app
 *
 * @param {String}   sockFile Sock file
 * @param {Incoming} incoming Incoming instance
 */
function addSockTransferListener(sockFile, incoming) {
  process.nextTick(function() {
    incoming.removeAllListeners('app-call');

    incoming.on('app-call', function(data) {
      var client = net.connect({path: '/tmp/echo.sock'}, function() {
        client.write(JSON.stringify(data));
      });

      client.on('data', function(data) {
        console.log(data.toString());
        client.end();
      });
    });
  });
}

/**
 * Tells the app to use a given socket.  If the socket is not in use this instance of the app is "promoted" to master
 *   and it starts listening on that socket.  If the socket is already active this app is considered a "child" and any
 *   commands are transferred to the master instance via the socket.
 *
 * @param  {String} sockFile Sock file
 * @chainable
 */
module.exports.sock = function(sockFile) {
  isSockOpen(sockFile)

    // socket is open
    .then(function() {
      addSockTransferListener(sockFile, this);
    })

    // socket not open
    .catch(function(err) {
      if (!~'ENOENT ECONNREFUSED'.indexOf(err)) {
        throw new Error('Not sure what to do with socket return code ' + err);
      }

      ((err === 'ECONNREFUSED') ?
        cleanSock(sockFile)
        : Promise.resolve()
      )
        .then(function() {
          listenSock(sockFile, this);
        }.bind(this));
    });

    return this;
};

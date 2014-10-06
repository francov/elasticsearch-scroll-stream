/**
 * Elasticsearch Stream
 *
 * Create a ReadableStream from an elasticsearch scroll query.
 * Assumptions: client library is of type (elasticsearch)[https://www.npmjs.org/package/elasticsearch]
 */
var Readable = require("stream").Readable,
    util = require("util");


/**
 * LibElasticasearchScrollStream
 *
 * @param `client` - elasticsearch instance
 * @param `query_opts` - query object to be passed to elastical.
 *        It contains the query
 * @param `stream_opts` - object to be passed to ReadableStream
 */
var LibElasticasearchScrollStream = function(client, query_opts, stream_opts) {

  this._client = client;
  this._options = query_opts;
  this._options.scroll = query_opts.scroll || '10m';
  this._reading = false;
  this._counter = 0;
  Readable.call(this, stream_opts);
};

util.inherits(LibElasticasearchScrollStream, Readable);


LibElasticasearchScrollStream.prototype._read = function() {
  if (this._reading) {
    return false;
  }

  this._reading = true;
  var self = this;
  this._client.search(this._options, function getMoreUntilDone(err, response) {
    if (err) {
      return self.emit("error", err);
    }

    response.hits.hits.forEach(function(hit) {
      self.push(JSON.stringify(hit.fields));
      self._counter++;
    });

    if (response.hits.total !== self._counter) {
      self._client.search({
        scroll: self._options.scroll,
        scroll_id: response._scroll_id
      }, getMoreUntilDone);
    } else {
      return setImmediate(function() {
        self._reading = false;
        self._counter = 0;
        self.push(null);
      });
    }

  });
};

module.exports = LibElasticasearchScrollStream;


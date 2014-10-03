var Readable = require("stream").Readable,
    util = require("util")

var el = null;

var ElasticsearchScrollStream = function(elasticsearch, stream_opt, query_opt) {
  Readable.call(this, stream_opt);
  el = elasticsearch;
  this._options = query_opt;
  this._getNextSet = function(scroll_id, callback) {
    return el.search({
      scroll: query_opt.scroll || "10m",
      scroll_id: scroll_id
    }, callback);
  };
  return this._reading = false;
};

util.inherits(ElasticsearchScrollStream, Readable);


ElasticsearchScrollStream.prototype._read = function() {
  if (this._reading) {
    return false;
  }

  this._reading = true;
  var self = this;
  el.search(this._options, function(err, results, _res) {
    if (err) {
      return self.emit("error", err);
    }
    var scroll_id = _res._scroll_id;
    var scrollCb = function(err, results, _res) {
      if (err) {
        return self.emit("error", err);
      }
      results.hits.forEach(function(hit) {
        self.push(JSON.stringify(hit.fields));
      });
      scroll_id = _res._scroll_id;
      if (_res["hits"].hits.length > 0) {
        return self._getNextSet(scroll_id, scrollCb);
      } else {
        return setImmediate(function() {
          self._reading = false;
          self.push(null);
        });
      }
    };

    self._getNextSet(scroll_id, scrollCb);
  });
};

module.exports = ElasticsearchScrollStream;


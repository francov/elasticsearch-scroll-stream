/**
 * Elasticsearch Scroll Stream
 *
 * Create a ReadableStream from an elasticsearch scroll query.
 */
var LibElasticalAdaptee = require("./lib/elastical-stream"),
    LibElasticsearchAdaptee = require("./lib/elasticsearch-stream");


/**
 * ElasticsearchScrollStream
 * @param `client` - elastical instance
 * @param `query_opts` - query object to be passed to elastical.
 *        See [Elasticsearch API reference](http://www.elasticsearch.org/guide/en/elasticsearch/reference/1.x/search-request-body.html)
 * @param `stream_opts` - object to be passed to ReadableStream
 */
var ElasticsearchScrollStream = function(client, query_opts, stream_opts) {
  if (arguments.length == 1) throw new Error("ElasticsearchScrollStream: missing parameters");
  if (!client) throw new Error("ElasticsearchScrollStream: client is ", client);

  stream_opts = (!!stream_opts) ? stream_opts : {};

  if (!!client.nodes) {
    return new LibElasticsearchAdaptee(client, query_opts, stream_opts);
  } else {
    return new LibElasticalAdaptee(client, query_opts, stream_opts);
  }
};

module.exports = ElasticsearchScrollStream;


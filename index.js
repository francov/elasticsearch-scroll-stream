/**
 * Elasticsearch Scroll Stream
 *
 * Create a ReadableStream from an elasticsearch scroll query.
 */
const LibElasticsearchAdaptee = require('./lib/elasticsearch-stream')

const allowed_extrafields = ['_id', '_score', '_type', '_index', '_parent', '_routing', 'inner_hits']

/**
 * ElasticsearchScrollStream
 * @param `client` - elasticsearch instance
 * @param `query_opts` - query object to be passed to elasticsearch
 *        See [Elasticsearch API reference](http://www.elasticsearch.org/guide/en/elasticsearch/reference/1.x/search-request-body.html)
 * @param `optional_fields` - array of optional properties to include in the results.
 *        Allowed values: '_id', '_score', '_type', '_index', '_parent', '_routing', 'inner_hits'
 * @param `stream_opts` - object to be passed to ReadableStream
 */
class ElasticsearchScrollStream {
  constructor(client, query_opts = {}, optional_fields = [], stream_opts = {}) {
    if (!client) throw new Error('ElasticsearchScrollStream: client is ', client)
    if (Object.keys(query_opts).length === 0) throw new Error('ElasticsearchScrollStream: missing parameters')

    if (!Array.isArray(optional_fields))
      throw new Error('ElasticsearchScrollStream: optional_fields must be an array', optional_fields)

    optional_fields.forEach(entry => {
      if (allowed_extrafields.indexOf(entry) === -1) {
        throw new Error(`ElasticsearchScrollStream: property '${entry}' not allowed in optional_fields`)
      }
    })

    return new LibElasticsearchAdaptee(client, query_opts, optional_fields, stream_opts)
  }
}

module.exports = ElasticsearchScrollStream

/**
 * Setup and teardown for these tests are external to this source file
 * (i.e.: indexed documents are loaded into elasticsearch via bash script)
 */
var expect = require('chai').expect,
  elastical = require('elastical'),
  elasticsearch = require('elasticsearch');

var ElasticsearchScrollStream = require('../index.js');

describe('elasticsearch_scroll_stream', function() {

  it('Lib Elastical: stream data correctly from elasticsearch', function(done) {
    var counter = 0;
    var current_doc;
    var elastical_client = new elastical.Client();

    var es_stream = new ElasticsearchScrollStream(elastical_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      search_type: 'scan',
      scroll: '10s',
      size: '50',
      fields: ['name'],
      query: {
        bool: {
          must: [
            {
              query_string: {
                default_field: "_all",
                query: 'name:second*'
              }
            }
          ]
        }
      }
    });

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name[0]).to.equal("second chunk name");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });


  it("Lib Elasticsearch: stream correctly when 'fields' property is specified", function(done) {
    this.timeout(10000);
    var counter = 0;
    var current_doc;
    var elasticsearch_client = new elasticsearch.Client();

    var es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      fields: ['name'],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    });

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name[0]).to.equal("third chunk name");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });


  it("Lib Elasticsearch: stream correctly when '_source' property is specified", function(done) {
    this.timeout(10000);
    var counter = 0;
    var current_doc;
    var elasticsearch_client = new elasticsearch.Client();

    var es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      _source: ["name"],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    });

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name).to.equal("third chunk name");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });


  it('Lib Elasticsearch: stream correctly when no fields are specified (full _source)', function(done) {
    this.timeout(10000);
    var counter = 0;
    var current_doc;
    var elasticsearch_client = new elasticsearch.Client();

    var es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    });

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name).to.equal("third chunk name");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });


  it("Lib Elasticsearch: stream correctly when 'fields' property is specified and optional_fields required", function(done) {
    this.timeout(10000);
    var counter = 0;
    var current_doc;
    var elasticsearch_client = new elasticsearch.Client();

    var es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      fields: ['name'],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    }, ['_id']);

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name[0]).to.equal("third chunk name");
      expect(current_doc).to.have.property("_id");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });

  it("Lib Elasticsearch: stream correctly when '_source' property is specified and optional_fields required", function(done) {
    this.timeout(10000);
    var counter = 0;
    var current_doc;
    var elasticsearch_client = new elasticsearch.Client();

    var es_stream = new ElasticsearchScrollStream(elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      _source: ["name"],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    }, ['_id', '_score']);

    es_stream.on('data', function(data) {
      current_doc = JSON.parse(data.toString());
      expect(current_doc.name).to.equal("third chunk name");
      expect(current_doc).to.have.property("_id");
      expect(current_doc).to.have.property("_score");
      counter++;
    });

    es_stream.on('end', function() {
      expect(counter).to.equal(20);
      done();
    });

    es_stream.on('error', function(err) {
      done(err);
    });
  });


  it("Lib Elasticsearch: should throw error when optional_fields is not an array", function(done) {
    var elasticsearch_client = new elasticsearch.Client();

    expect(ElasticsearchScrollStream.bind(this, elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      _source: ["name"],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    }, '_id')).to.throw(/optional_fields must be an array/);
    done();
  });


  it("Lib Elasticsearch: should throw error when optional_fields does not contain an allowed value", function(done) {
    var elasticsearch_client = new elasticsearch.Client();

    expect(ElasticsearchScrollStream.bind(this, elasticsearch_client, {
      index: 'elasticsearch-test-scroll-stream',
      type: 'test-type',
      scroll: '10s',
      size: '50',
      _source: ["name"],
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: "_all",
                  query: 'name:third*'
                }
              }
            ]
          }
        }
      }
    }, ['invalid_value'])).to.throw(/not allowed in optional_fields/);
    done();
  });
});


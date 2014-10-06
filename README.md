
Elasticsearch Scroll Stream
============================

Elasticsearch Scroll query results as a Node.js ReadableStream


Installing
----------

Latest released version:

    npm install elasticsearch-scroll-stream


Usage
-------
This module works with the following Elasticsearch nodejs clients:

 - [elastical](https://www.npmjs.org/package/elastical)
 - [elasticsearch](https://www.npmjs.org/package/elasticsearch) (official Elasticsearch js API)


```js
var elastical = require('elastical');
var ElasticsearchScrollStream = require('elasticsearch-scroll-stream');

var client = new elastical.Client();

// You need to pass the client instance and the query object
// as parameters in the constructor
var es_stream = new ElasticsearchScrollStream(client, {
  index: 'elasticsearch-test-scroll-stream',
  type: 'test-type',
  search_type: 'scan',
  scroll: '10s',
  size: '50',
  fields: ['name'],
  q: 'name:*'
});

// Pipe the results to other writeble streams..
es_stream.pipe(process.stdout);

es_stream.on('end', function() {
  console.log("End");
});

```

See test files for more examples.


Developing
----------

Fork the git repo, clone it, then install the dev dependencies.

    cd elasticsearch-scroll-stream
    npm install

Make your changes, add tests, then run the tests to make sure nothing broke.

    make

NOTE: Tests require an ElasticSearch server running at http://127.0.0.1:9200/.



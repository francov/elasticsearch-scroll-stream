#!/bin/bash

# Uses curl to tear down test data on a local ElasticSearch instance.

BASE="http://localhost:9200"

echo -e "Deleting the test index"

curl -s -XDELETE "$BASE/elasticsearch-test-scroll-stream/"
echo -e ""

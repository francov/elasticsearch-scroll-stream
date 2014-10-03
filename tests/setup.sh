#!/bin/bash
# Uses curl to set up test data on a local ElasticSearch instance.
BASE="http://localhost:9200"
echo -e "Setting up the indicies"
curl -s -XPUT "$BASE/elastical-test-bulk"
echo -e ""
curl -s -XPUT "$BASE/elastical-test-deleteme"
echo -e ""
curl -s -XPUT "$BASE/elastical-test-deleteme2"
echo -e ""

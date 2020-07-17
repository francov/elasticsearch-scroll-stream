import { Client } from "@elastic/elasticsearch";
import { Search } from "@elastic/elasticsearch/api/requestParams";
import { Readable, ReadableOptions } from "stream";

export = ElasticsearchScrollStream;
type optionalField =
  | "_id"
  | "_score"
  | "_type"
  | "_index"
  | "_parent"
  | "_routing"
  | "inner_hits";

declare class ElasticsearchScrollStream extends Readable {
  public constructor(
    client: Client,
    clientOptions?: Search,
    optionalFields?: optionalField[],
    readableOptions?: ReadableOptions
  );
}

declare namespace ElasticsearchScrollStream {}

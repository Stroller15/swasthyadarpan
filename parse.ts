import {
  LlamaParseReader,
  // we'll add more here later
} from "llamaindex";
import 'dotenv/config'

async function main() {
  // save the file linked above as sf_budget.pdf, or change this to match
  const path = "./sample.pdf";

  // set up the llamaparse reader
  const reader = new LlamaParseReader({ resultType: "markdown" });

  // parse the document
  const documents = await reader.loadData(path);

  // print the parsed document
  console.log(documents);
}

main().catch(console.error);
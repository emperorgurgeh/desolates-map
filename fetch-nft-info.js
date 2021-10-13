'use strict';

const fs = require('fs');
const fetch = require('sync-fetch');

if(process.argv.length < 4) throw new Error("pass input and output files as params")

let inputFileName = process.argv[2];
let outputFileName = process.argv[3]

let rawdata = fs.readFileSync(inputFileName);
let parsedData = JSON.parse(rawdata);

function processAttrs(attrsObject) {
  let attrsProcessed = {};

  for (let i = 0; i < attrsObject.length; i++) {
    let traitType = attrsObject[i].trait_type;

    if (traitType === 'coords') {
      let rawCoords = attrsObject[i].value;
      const regexCoords = /x:([0-9.\-]+), y:([0-9.\-]+), z:([0-9.\-]+)/;
      let parsedCoords = rawCoords.match(regexCoords);
      attrsProcessed[traitType] = parsedCoords.slice(1).map(n => Number.parseFloat(n));
    } else {
      attrsProcessed[traitType] = attrsObject[i].value;
    }
  }

  return attrsProcessed;
}

let processedJson = [];

console.log("workin on it... hold tight")

for (const [key, mint] of Object.entries(parsedData.items)) {
  let arLink = mint.link;
  let content = fetch(arLink).json();

  processedJson.push({
    name: content.name,
    link: arLink,
    image: content.image,
    attributes: processAttrs(content.attributes)
  });
}

fs.writeFileSync(outputFileName, JSON.stringify(processedJson));

console.log("done! wagmi!!!! 🚀")
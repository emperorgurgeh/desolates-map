Project's kinda simple
* No build infrastructure
* List of minted NFTs is stored in /public/data/first-mission.json

## Generate JSON metadata for new drops

To generate more JSON files for the upcoming NFT drops, run:
```node fetch-nft-info.js <input_file> <output_file>```
Where:
* input file must be a metaplex cache data from the NFT mint
* output file should eventually go into /public/data and later on imported in the code from main.json

## Deploy
The project's set up to deploy with firebase hosting (it's free and awesome).

The config files are set up but you'll need to config firebase with your own project. [These instructions](https://firebase.google.com/docs/hosting/quickstart) are pretty solid.
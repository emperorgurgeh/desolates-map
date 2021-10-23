Project's kinda simple
* No build infrastructure
* List of minted NFTs is stored in /public/data/...

## Generate JSON metadata for new drops

To generate more JSON files for the upcoming NFT drops, run:
```node fetch-nft-info.js <input_file> <output_file>```

Where:
* input file must be a metaplex cache data from the NFT mint
* output file should eventually go into /public/data and later on imported in the code from main.json

## Set up

First create a project in Firebase and enable hosting.

Then just install the firebase CLI and log in, [following these instructions](https://firebase.google.com/docs/cli#setup_update_cli).

## Develop

To view the code live in your browser...

```firebase serve```

(Optional) If you're customizing tailwind, then run the following command to automatically recompile changes

```npx tailwindcss -o public/css/vendor/tailwind.css --watch```

## Deploy

First ensure tailwind is compiled, with:

```npx tailwindcss -o public/css/vendor/tailwind.css ```

Then, deploy the 'public' folder wherever you please. The project's set up to deploy with firebase hosting (it's free and awesome). If you want to use that just run:

```firebase deploy```
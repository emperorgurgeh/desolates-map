The desolates map is built using the following technologies:

-   The map itself uses p5js, a visual rendering library
-   The project is wrapped on a nextjs container
-   Tailwind is used for CSS styling
-   Solana Blockchain is the source of planet and NFT ownership data
-   Firestore holds user profile information

## Setup

First install dependencies by running:

```
cd next-desolates-map
yarn
```

Then, [set up a Firebase project](https://console.firebase.google.com) and from the console enable Firestore and create web application credentials.

After that, copy .env.template into a .env.local file and fill in the values with those you would have gotten from the Firebase console.

## Local development

To develop and use a local server, run (from within the next-desolates-map folder):

```
yarn dev
```

## Prepare for release

To build a compiled version:

```
yarn build
```

## Deploy

Host your site in some cloud hosting for NextJS projects like Vercel or AWS Amplify. If you use vercel, simply push to your github repo or run

```
vercel --prod
```

And then make sure to enter the same environment variables in your hosting provider as the ones you entered into the .env file.

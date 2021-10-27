import type { NextApiRequest, NextApiResponse } from "next";

import { Connection, Metadata } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const ownerAddress = req.query.ownerAddress as string;

    const rpcHost = process.env.NEXT_PUBLIC_SOLANA_NETWORK!;
    const connection = new Connection(rpcHost);

    let tokens: any = await connection.getParsedProgramAccounts(
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        {
            filters: [
                {
                    dataSize: 165,
                },
                {
                    memcmp: {
                        offset: 32,
                        bytes: ownerAddress,
                    },
                },
            ],
        }
    );

    tokens = parseNFTsFromTokens(tokens);

    if (tokens.length === 0) {
        res.status(200).json(JSON.stringify([], undefined, 4));
    } else {
        let nfts: any = [];

        for (let i = 0; i < tokens.length; i++) {
            const metadata = await fetchMetadataForMintHash(
                connection,
                tokens[i].account.data.parsed.info.mint,
                ownerAddress
            );

            if (metadata !== null) {
                nfts.push(metadata);
            }
        }

        res.status(200).json(JSON.stringify(nfts, undefined, 4));
    }
}

function parseNFTsFromTokens(tokens: Array<any>) {
    let ret: Array<any> = [];
    tokens.forEach((token) => {
        if (
            token.account.data.parsed.info.tokenAmount.decimals === 0 &&
            token.account.data.parsed.info.tokenAmount.amount == "1"
        ) {
            ret.push(token);
        }
    });

    return ret;
}

async function fetchMetadataForMintHash(
    connection: Connection,
    mintHash: string,
    ownerAddress: string
) {
    const pda = await Metadata.getPDA(mintHash);

    const accountInfo: any = await connection.getParsedAccountInfo(pda);

    const metadata: any = new Metadata(ownerAddress, accountInfo.value);

    const dataRes = await fetch(metadata.data.data.uri);

    if (dataRes.status === 200) {
        return await dataRes.json();
    } else {
        return null;
    }
}

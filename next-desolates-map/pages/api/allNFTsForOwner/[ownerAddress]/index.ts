import type { NextApiRequest, NextApiResponse } from "next";

import { Connection, Metadata, MetadataDataData } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";
import { solanaTokenProgram } from "../../../../utils/consts";
import { createErrorMessage } from "../../../../utils";

const DEFAULT_PER_PAGE = 10;
const DEFAULT_PAGE = 1;

// This endpoint implements pagination by passing a 'page' number, an optional 'perPage', and an optional 'includeTotal` parameter
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const ownerAddress = req.query.ownerAddress as string;

    let includeTotal = false;
    if (req.query.includeTotal) {
        includeTotal = !!parseInt(req.query.includeTotal as string);
    }

    let perPage = DEFAULT_PER_PAGE;
    if (req.query.perPage) {
        perPage = parseInt(req.query.perPage as string);
    }

    let page = DEFAULT_PAGE;
    if (req.query.page) {
        page = parseInt(req.query.page as string);
    }

    if (page <= 0) {
        res.status(404).json(
            createErrorMessage(
                "The requested page " +
                    page +
                    " must be greater than or equal to 1"
            )
        );
        return;
    }

    let totalCount = 0;

    const rpcHost = process.env.NEXT_PUBLIC_SOLANA_NETWORK!;
    const connection = new Connection(rpcHost);

    let tokens: any = await connection.getParsedProgramAccounts(
        new PublicKey(solanaTokenProgram),
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

    tokens = await parseNFTsFromTokens(tokens);
    totalCount = tokens.length;

    // If page does not exist
    if (page > Math.ceil(totalCount / perPage)) {
        res.status(404).json(
            createErrorMessage(
                "The requested page " +
                    page +
                    ` is greater than the number of pages available (${Math.ceil(
                        totalCount / perPage
                    )})`
            )
        );
        return;
    }

    // Slice tokens in order to only fetch the current 'page' of NFTS;
    tokens = tokens.slice((page - 1) * perPage).slice(0, perPage);

    if (tokens.length === 0) {
        res.status(200).json(
            JSON.stringify(
                { totalCount: includeTotal ? totalCount : undefined, nfts: [] },
                undefined,
                4
            )
        );
    } else {
        let nfts: Array<any> = [];

        for (let i = 0; i < tokens.length; i++) {
            const metadata = await fetchMetadataForMintHash(
                connection,
                tokens[i].account.data.parsed.info.mint,
                ownerAddress
            );

            if (metadata !== null) {
                nfts.push(metadata);
            } else {
                console.log(
                    "FAILED TO GET METADATA FOR MINT",
                    tokens[i].account.data.parsed.info.mint
                );
            }
        }

        res.status(200).json(
            JSON.stringify(
                {
                    totalCount: includeTotal ? totalCount : undefined,
                    nfts,
                },
                undefined,
                4
            )
        );
    }
}

// This function parses out SPL Tokens which are not NFTs (decimals 0, amount 1)
async function parseNFTsFromTokens(tokens: Array<any>) {
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
    try {
        const pda = await Metadata.getPDA(mintHash);

        const accountInfo: any = await connection.getParsedAccountInfo(pda);

        const metadata: any = new Metadata(ownerAddress, accountInfo.value);

        const dataRes = await fetch(metadata.data.data.uri);

        if (dataRes.status === 200) {
            return await dataRes.json();
        } else {
            return null;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

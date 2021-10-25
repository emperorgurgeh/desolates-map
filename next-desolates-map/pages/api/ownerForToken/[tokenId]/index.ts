// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { Connection } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";

import {
    createErrorMessage,
    fetchHashTable,
    parseTokenID,
} from "../../../../utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const tokenId = parseInt(req.query.tokenId as string);
    const rpcHost = process.env.NEXT_PUBLIC_SOLANA_NETWORK!;
    const connection = new Connection(rpcHost);

    console.log("Fetching mint hashes");
    const allMintsCandyMachine = await fetchHashTable(
        process.env.NEXT_PUBLIC_CANDY_MACHINE_ID!,
        true
    );
    console.log("Finished fetching mint hashes");

    let hasMintedToken = false;
    let tokenOwner = null;

    for (let i = 0; i < allMintsCandyMachine.length; i++) {
        if (parseTokenID(allMintsCandyMachine[i].data.data.name) === tokenId) {
            hasMintedToken = true;

            const largestAccounts = await connection.getTokenLargestAccounts(
                new PublicKey(allMintsCandyMachine[i].data.mint)
            );

            if (largestAccounts) {
                const accountInfo: any = await connection.getParsedAccountInfo(
                    largestAccounts.value[0].address
                );

                tokenOwner = accountInfo.value.data?.parsed?.info?.owner;
                break;
            }
        }
    }

    if (!hasMintedToken) {
        res.status(404).json(
            createErrorMessage(
                "Token with id " + tokenId + " has not been minted"
            )
        );
        return;
    } else {
        if (!tokenOwner) {
            res.status(404).json(
                createErrorMessage(
                    "Failed to get owner of token with id " + tokenId
                )
            );
            return;
        } else {
            res.status(200).json(
                JSON.stringify({ ownerAddress: tokenOwner }, undefined, 4)
            );
            return;
        }
    }
}

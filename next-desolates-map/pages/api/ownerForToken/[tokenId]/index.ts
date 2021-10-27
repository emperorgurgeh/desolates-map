import type { NextApiRequest, NextApiResponse } from "next";

import { Connection } from "@metaplex/js";
import { PublicKey } from "@solana/web3.js";

import {
    createErrorMessage,
    fetchHashTable,
    parseTokenID,
} from "../../../../utils";
import {
    candyMachineIds,
    tokenIdToMintHashMap,
} from "../../../../utils/consts";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const tokenId = parseInt(req.query.tokenId as string);

    const rpcHost = process.env.NEXT_PUBLIC_SOLANA_NETWORK!;
    const connection = new Connection(rpcHost);

    let mintHash = tokenIdToMintHashMap.get(tokenId);
    console.log(mintHash);

    let tokenOwner = null;

    if (mintHash !== undefined) {
        tokenOwner = await fetchOwnerForMintHash(connection, mintHash);
    } else {
        let tokenMinted = false;

        console.log("Fetching all mint transactions for Candy Machine");
        const allMintsCandyMachine = await fetchHashTable(
            candyMachineIds.get(4)!,
            true
        );

        for (let i = 0; i < allMintsCandyMachine.length; i++) {
            if (
                parseTokenID(allMintsCandyMachine[i].data.data.name) === tokenId
            ) {
                tokenMinted = true;
                tokenOwner = await fetchOwnerForMintHash(
                    connection,
                    allMintsCandyMachine[i].data.mint
                );
                break;
            }
        }

        if (!tokenMinted) {
            res.status(200).json(
                JSON.stringify(
                    { error: true, ownerAddress: null },
                    undefined,
                    4
                )
            );
            return;
        }
    }

    if (tokenOwner) {
        res.status(200).json(
            JSON.stringify({ ownerAddress: tokenOwner }, undefined, 4)
        );
        return;
    } else {
        res.status(500).json(
            createErrorMessage(
                "Failed to get owner of token with id " + tokenId
            )
        );
        return;
    }
}

async function fetchOwnerForMintHash(connection: Connection, mintHash: string) {
    const largestAccounts = await connection.getTokenLargestAccounts(
        new PublicKey(mintHash)
    );

    if (largestAccounts) {
        const accountInfo: any = await connection.getParsedAccountInfo(
            largestAccounts.value[0].address
        );

        return accountInfo.value.data?.parsed?.info?.owner;
    }
}

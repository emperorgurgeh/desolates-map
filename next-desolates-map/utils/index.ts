import { MetadataProgram, Metadata, Connection } from "@metaplex/js";

export async function fetchHashTable(
    hash: string,
    metadataEnabled?: boolean
): Promise<any[]> {
    const MAX_NAME_LENGTH = 32;
    const MAX_URI_LENGTH = 200;
    const MAX_SYMBOL_LENGTH = 10;
    const MAX_CREATOR_LEN = 32 + 1 + 1;

    const rpcHost = process.env.NEXT_PUBLIC_SOLANA_NETWORK!;
    const connection = new Connection(rpcHost);

    const metadataAccounts = await MetadataProgram.getProgramAccounts(
        connection,
        {
            filters: [
                {
                    memcmp: {
                        offset:
                            1 +
                            32 +
                            32 +
                            4 +
                            MAX_NAME_LENGTH +
                            4 +
                            MAX_URI_LENGTH +
                            4 +
                            MAX_SYMBOL_LENGTH +
                            2 +
                            1 +
                            4 +
                            0 * MAX_CREATOR_LEN,
                        bytes: hash,
                    },
                },
            ],
        }
    );

    const mintHashes: any = [];

    for (let index = 0; index < metadataAccounts.length; index++) {
        const account = metadataAccounts[index];
        const accountInfo: any = await connection.getParsedAccountInfo(
            account.pubkey
        );

        const metadata: any = new Metadata(hash.toString(), accountInfo.value);

        if (metadataEnabled) mintHashes.push(metadata);
        else mintHashes.push(metadata.data.mint);
    }

    return mintHashes;
}

export function parseTokenID(tokenName: string) {
    let val = tokenName.match(/\d+/g);
    if (val == null) {
        throw new Error("error parsing token ID");
    } else {
        return parseInt(val.slice(-1)[0]);
    }
}

export function createErrorMessage(message: string) {
    return JSON.stringify({ error: true, message }, undefined, 4);
}

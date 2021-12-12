const baseURL = "https://api.desolate.space/api";

const API = {
    getPlanets: () => `${baseURL}/planets`,
    getPlanetNFTs: (planetId: number, perPage: number, page: number) =>
        `${baseURL}/planets/${planetId}/nfts?perPage=${perPage}&page=${page}&includeTotal=1&filterOutDesolates=1`,
    getPlanetOwner: (planetId: number) =>
        `${baseURL}/planets/${planetId}/owner`,
    getImage: (url: string, width: number, height: number) =>
        `${baseURL}/img/?w=${width}&h=${height}&url=${url}`,
};

export default API;

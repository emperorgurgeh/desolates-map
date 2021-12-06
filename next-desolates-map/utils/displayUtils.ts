export const shortenAddress = (address: string, chars = 4): string => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export function preventEventPropagation(e: any) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

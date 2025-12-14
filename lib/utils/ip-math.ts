export const longToIp = (long: number): string =>
    [(long >>> 24) & 0xFF, (long >>> 16) & 0xFF, (long >>> 8) & 0xFF, long & 0xFF].join('.');

export const ipToLong = (octets: number[]): number =>
    ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;

export const cidrToMask = (cidr: number): string => {
    let mask = [];
    let remaining = cidr;
    for (let i = 0; i < 4; i++) {
        let n = Math.min(remaining, 8);
        mask.push(256 - Math.pow(2, 8 - n));
        remaining -= n;
    }
    return mask.join('.');
};

export const isPrivateIp = (octets: number[]): boolean => {
    const [o1, o2] = octets;
    if (o1 === 10) return true;
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;
    if (o1 === 192 && o2 === 168) return true;
    return false;
};

// VLSM Alignment Validator
export const alignIpToBlock = (currentIp: number, mask: number): number => {
    const blockSize = Math.pow(2, 32 - mask);
    if (currentIp % blockSize !== 0) {
        return Math.ceil(currentIp / blockSize) * blockSize;
    }
    return currentIp;
};

export const getIpBinary = (ipString: string): string[][] => {
    const ip = ipString.split('/')[0];
    const octets = ip.split('.').map(Number);
    return octets.map(oct => oct.toString(2).padStart(8, '0').split(''));
};

export type SubnetInfo = {
    networkAddress: string;
    firstUsable: string;
    lastUsable: string;
    broadcastAddress: string;
    mask: string;
    hosts: number;
};

export const calculateSubnetInfo = (ipStr: string, cidr: number): SubnetInfo => {
    const octets = ipStr.split('.').map(Number);
    const ipLong = ipToLong(octets);
    const maskLong = 0xFFFFFFFF << (32 - cidr);
    const networkLong = (ipLong & maskLong) >>> 0;
    const broadcastLong = (networkLong | ~maskLong) >>> 0;

    return {
        networkAddress: longToIp(networkLong),
        firstUsable: longToIp(networkLong + 1),
        lastUsable: longToIp(broadcastLong - 1),
        broadcastAddress: longToIp(broadcastLong),
        mask: cidrToMask(cidr),
        hosts: Math.pow(2, 32 - cidr) - 2
    };
};

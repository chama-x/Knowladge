import { useState } from 'react';

export function useBinaryLogic() {
    const [byte, setByte] = useState(0);

    const isBitOn = (bitIndex: number) => (byte & (1 << (7 - bitIndex))) !== 0;

    const toggleBit = (bitIndex: number) => {
        const bitVal = 1 << (7 - bitIndex);
        if (isBitOn(bitIndex)) {
            setByte(byte - bitVal);
        } else {
            setByte(byte + bitVal);
        }
    };

    const reset = () => setByte(0);

    return { byte, setByte, isBitOn, toggleBit, reset };
}

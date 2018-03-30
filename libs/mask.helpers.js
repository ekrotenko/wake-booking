class MaskHelpers {
    static maskToArray(intMask) {
        let mask = (intMask).toString(2);

        while (mask.length < 7) {
            mask = 0 + mask;
        }

        return mask.split('');
    }
}

module.exports = MaskHelpers;
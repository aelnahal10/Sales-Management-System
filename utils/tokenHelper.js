function expiresInToMilliseconds(expiresIn) {
    const match = expiresIn.match(/^(\d+)([smhdw])$/);
    const num = parseInt(match[1]);
    const type = match[2];
    switch (type) {
        case 's': return num * 1000;          // seconds
        case 'm': return num * 60 * 1000;     // minutes
        case 'h': return num * 60 * 60 * 1000; // hours
        case 'd': return num * 24 * 60 * 60 * 1000; // days
        case 'w': return num * 7 * 24 * 60 * 60 * 1000; // weeks
        default: return null;
    }
}

module.exports = {
    expiresInToMilliseconds
};

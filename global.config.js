function getLocalConfig(tenant) {
    switch (tenant) {
    case '14q': return {
        global: {
            repositoryId: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
        },
    };
    case '197': return {
        global: {
            repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
        },
    };
    // Default: PROD and Version
    default: return {
        global: {
            repositoryId: '16d943a8-4683-5ffb-b564-f3bf1903a967',
        },
    };
    }
}

module.exports = {
    getLocalConfig,
};

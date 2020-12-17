function getLocalConfig(tenant) {
    switch (tenant) {
    // DEV
    case '14q': return {
        global: {
            host: 'https://able-group-dev.d-velop.cloud',
            repositoryId: '1a2cde3f-2913-3dc2-4a2e-e623459ac23a',
            stage: 'DEV',
        },
        database: {
            ExpressionAttributeNames: {
                '#A': 'LinkID',
                '#B': 'Element_One',
                '#C': 'Element_Two',
                '#D': 'Timestamp',
                '#E': 'Creator',
            },
            ProjectionExpression: '#A, #B, #C, #D, #E',
            TableName: 'd.3_Objectlink_DEV',
        },
    };
    // QAS
    case '197': return {
        global: {
            repositoryId: '64bdf712-b328-5f46-8fd0-b8e67aaf8bec',
            stage: 'QAS',
        },
    };
    // Version
    case '1ha': return {
        global: {
            repositoryId: '16d943a8-4683-5ffb-b564-f3bf1903a967',
            stage: 'VERSION',
        },
    };
    // Default: PROD
    default: return {
        global: {
            repositoryId: '16d943a8-4683-5ffb-b564-f3bf1903a967',
            stage: 'PROD',
        },
    };
    }
}

module.exports = {
    getLocalConfig,
};

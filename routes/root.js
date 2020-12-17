const express = require('express');

module.exports = (basePath) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log(`TenantId:${req.tenantId}`);
        console.log(`SystemBaseUri:${req.systemBaseUri}`);
        res.format({
            'application/hal+json': () => {
                res.send({
                    _links: {
                        dmsobjectextensions: {
                            href: `${basePath}/dmsobjectextensions`,
                        },
                    },
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};

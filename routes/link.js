const express = require('express');
const configLoader = require('../global.config');
const databaseLoader = require('../modules/databaseLoader');

module.exports = (assetBasePath) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const config = configLoader.getLocalConfig(req.get('x-dv-tenant-id'));
        const linkedObjects = await databaseLoader.getLinkedObjects(req.query.docId, config, req);
        console.log(linkedObjects);
        res.format({
            'text/html': () => {
                res.render('link', {
                    title: 'Verlinkungen von Objekten',
                    stylesheet: `${assetBasePath}/global.css`,
                    script: `${assetBasePath}/link.js`,
                    body: '/../views/link.hbs',
                    config: JSON.stringify(config),
                    documentID: req.query.docId,
                    linkedObjects,
                    documentBaseURL: `${config.global.host}/dms/r/${config.global.repositoryId}/o2/`,
                    // metaData: JSON.stringify(getMetaData(req.systemBaseUri, `${appName}`)),
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });

    router.post('/', (req, res) => {
        res.format({
            'application/hal+json': () => {
                res.send({
                    // TODO: Create Link
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });

    router.delete('/', (req, res) => {
        console.log('Trigger delete');
        res.format({
            'application/hal+json': () => {
                res.send({
                    // TODO: Delete Link
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};

const express = require('express');
const mapping = require('@ablegroup/propertymapping');

const configLoader = require('../global.config');
const databaseLoader = require('../modules/databaseLoader');

module.exports = (assetBasePath) => {
    const router = express.Router();
    router.use(express.json());

    router.get('/', async (req, res) => {
        const config = configLoader.getLocalConfig(req.get('x-dv-tenant-id'));
        const linkedObjects = await databaseLoader.getLinkedObjects(req.query.docId, config, req);
        mapping.initDatabase(process.env.ACCESS_KEY_ID, process.env.SECRET_ACCESS_KEY);
        const categories = await mapping.getAllCategories(config.global.stage.toLowerCase());
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
                    categories,
                    // metaData: JSON.stringify(getMetaData(req.systemBaseUri, `${appName}`)),
                });
            },
            default() {
                res.status(406).send('Not Acceptable');
            },
        });
    });

    router.post('/', (req, res) => {
        const reqData = req.body;
        console.log(reqData);
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

    router.delete('/', async (req, res) => {
        const reqData = req.body;
        const config = configLoader.getLocalConfig(req.get('x-dv-tenant-id'));
        try {
            await databaseLoader.deleteLinkedObject(reqData.documentID, reqData.linkedDocumentID, config);
            res.format({
                'application/hal+json': () => {
                    res.sendStatus(200);
                },
                default() {
                    res.status(406).send('Not Acceptable');
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    });
    return router;
};

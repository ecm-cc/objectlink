const express = require('express');

module.exports = (appName, assetBasePath) => {
    const router = express.Router();
    router.get('/', async (req, res) => {
        res.format({
            'application/hal+json': () => {
                res.send({
                    extensions: [
                        {
                            id: 'able-objectlinks.link',
                            activationConditions: [
                            ],
                            captions: [{
                                culture: 'de',
                                caption: 'Objektverlinkungen anzeigen',
                            },
                            {
                                culture: 'en',
                                caption: 'Show object links',
                            }],
                            uriTemplate: `/${appName}/link?docId={dmsobject.property_document_id}`,
                            context: 'DmsObjectDetailsContextAction',
                            iconUri: `${assetBasePath}/icon.png`,
                        },
                    ],
                });
            },
            default: () => {
                res.status(406).send('Not Acceptable');
            },
        });
    });
    return router;
};

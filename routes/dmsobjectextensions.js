const express = require('express');

module.exports = (appName) => {
    const router = express.Router();
    router.get('/', async (req, res) => {
        res.format({
            'application/hal+json': () => {
                res.send({
                    extensions: [
                        {
                            id: 'preview',
                            activationConditions: [
                                {
                                    propertyId: 'dmsobject.mainblob.content_type',
                                    operator: 'or',
                                    values: [
                                        'text/xml',
                                    ],
                                },
                                {
                                    propertyId: 'dmsobject.property_filetype',
                                    operator: 'or',
                                    values: [
                                        'xml',
                                        'XML',
                                    ],
                                },
                            ],
                            uriTemplate: `/${appName}/viewer?docId={dmsobject.property_document_id}`,
                            context: 'DmsObjectDetailsPreview',
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

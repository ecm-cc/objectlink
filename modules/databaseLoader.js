const AWS = require('aws-sdk');
const axios = require('axios');
const getHTTPOptions = require('@ablegroup/httpoptions');

const dynamoDB = new AWS.DynamoDB({
    region: 'eu-central-1',
});

async function getLinkedObjects(documentID, config, req) {
    const dbOptions = config.database;
    dbOptions.ExpressionAttributeValues = {
        ':a': {
            S: documentID,
        },
    };
    dbOptions.FilterExpression = 'Element_One = :a or Element_Two = :a';
    const scanResult = await dynamoDB.scan(dbOptions).promise();
    const userSCIM = await getUserSCIM(req, config);
    delete dbOptions.FilterExpression;
    delete dbOptions.ExpressionAttributeValues;
    return createReadableItems(scanResult, userSCIM, documentID, config, req);
}

async function createReadableItems(scanResult, userSCIM, documentID, config, req) {
    const sortedItems = await Promise.all(scanResult.Items.map(async (item) => {
        if (item.Element_One.S === documentID) {
            return {
                document: item.Element_Two.S,
                caption: await getCaption(item.Element_Two.S, config, req),
                date: getReadableDate(item.Timestamp.N),
                creator: await getCreator(item.Creator.S, userSCIM, config, req),
            };
        }
        return {
            document: item.Element_One.S,
            caption: await getCaption(item.Element_One.S, config, req),
            date: getReadableDate(item.Timestamp.N),
            creator: await getCreator(item.Creator.S, userSCIM),
        };
    }));
    return sortedItems;
}

async function getCaption(documentID, config, req) {
    const options = getHTTPOptions(req);
    options.url = `${config.global.host}/dms/r/${config.global.repositoryId}/o2/${documentID}`;
    const response = await axios(options);
    return response.data.caption;
}

function getReadableDate(timestampString) {
    const timestamp = parseInt(timestampString, 10);
    const date = new Date(timestamp);
    const dateOptions = {
        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Berlin',
    };
    return date.toLocaleString('de-DE', dateOptions);
}

async function getUserSCIM(req, config) {
    const options = getHTTPOptions(req);
    options.url = `${config.global.host}/identityprovider/scim/users`;
    const response = await axios(options);
    return response.data;
}

async function getCreator(userID, userSCIM) {
    const foundUser = userSCIM.resources.find((user) => user.id === userID);
    return `${foundUser.name.givenName} ${foundUser.name.familyName}`;
}

async function deleteLinkedObject(documentID, linkedDocumentID, config) {
    const dbOptions = config.database;
    dbOptions.ExpressionAttributeValues = {
        ':a': {
            S: documentID,
        },
        ':b': {
            S: linkedDocumentID,
        },
    };
    dbOptions.FilterExpression = '(Element_One = :a and Element_Two = :b) or (Element_One = :b and Element_Two = :a)';
    const scanResult = await dynamoDB.scan(dbOptions).promise();
    if (scanResult.Count === 0) {
        throw new Error('Object link not found');
    } else {
        const deleteParams = {
            Key: {
                LinkID: scanResult.Items[0].LinkID,
            },
            TableName: config.database.TableName,
        };
        await dynamoDB.deleteItem(deleteParams).promise();
    }
}

module.exports = {
    getLinkedObjects,
    deleteLinkedObject,
};

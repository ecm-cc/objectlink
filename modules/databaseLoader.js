const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const getHTTPOptions = require('@ablegroup/httpoptions');

const dynamoDB = new AWS.DynamoDB({
    region: 'eu-central-1',
});

async function getLinkedObjects(documentID, config, req) {
    const scanParams = config.database;
    scanParams.ExpressionAttributeValues = {
        ':a': {
            S: documentID,
        },
    };
    scanParams.FilterExpression = 'Element_One = :a or Element_Two = :a';
    const scanResult = await dynamoDB.scan(scanParams).promise();
    const userSCIM = await getUserSCIM(req, config);
    delete scanParams.FilterExpression;
    delete scanParams.ExpressionAttributeValues;
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
    const scanParams = config.database;
    scanParams.ExpressionAttributeValues = {
        ':a': {
            S: documentID,
        },
        ':b': {
            S: linkedDocumentID,
        },
    };
    scanParams.FilterExpression = '(Element_One = :a and Element_Two = :b) or (Element_One = :b and Element_Two = :a)';
    const scanResult = await dynamoDB.scan(scanParams).promise();
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

async function createLinkedObject(firstID, secondID, creator, timestamp, config) {
    const putOptions = {
        Item: {
            LinkID: {
                S: uuidv4(),
            },
            Element_One: {
                S: firstID,
            },
            Element_Two: {
                S: secondID,
            },
            Creator: {
                S: creator,
            },
            Timestamp: {
                N: timestamp,
            },
        },
        TableName: config.database.TableName,
    };
    await dynamoDB.putItem(putOptions).promise();
}

module.exports = {
    getLinkedObjects,
    deleteLinkedObject,
    createLinkedObject,
};

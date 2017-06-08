const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handle = function(e, ctx, cb) {
  const params = {
    Item: {
      messageId: e.messageId,
      from: e.from,
      text: e.text,
    },
    TableName: 'events'
  };

  return docClient.put(params, cb);
}

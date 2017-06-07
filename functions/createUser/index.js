const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handle = function(e, ctx, cb) {
  if (!e.name || !e.number) {
    return cb('Name and number are required.', null);
  }

  const params = {
    Item: {
      name: e.name,
      number: e.number
    },
    TableName: 'users'
  };

  return docClient.put(params, cb);
}

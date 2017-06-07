const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handle = function(e, ctx, cb) {
  const params = {
    Key: {
      name: e.name
    },
    TableName: 'pins'
  };

  return docClient.get(params, cb);
}

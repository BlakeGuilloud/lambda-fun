const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handle = function(e, ctx, cb) {
  function validatePin(err, data) {
    if (data.Item.pin === e.pin) {
      cb(err, data);
    } else {
      cb('Something went wrong', null);
    }
  }

  const params = {
    Key: {
      name: e.name
    },
    TableName: 'pins'
  };

  return docClient.get(params, validatePin);
}

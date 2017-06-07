const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-west-2' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.handle = function(e, ctx, cb) {
  if (!e.name) {
    return cb('Please provide a user name.', null);
  }

  function generateRandomString() {
    return 'xxxx'.replace(/x/g, () => {
      return (Math.random() * 36 | 0).toString(36);
    });
  }

  const params = {
    Item: {
      name: e.name,
      pin: generateRandomString()
    },
    TableName: 'pins',
    ReturnValues: 'ALL_OLD',
  };

  function sendTextMessage(err, response, pin) {
    const to = JSON.parse(response.Payload).Item.number;
    const text = `Your PIN is: ${pin}`;

    const payload = {
      FunctionName: 'game_sendTextMessage',
      Payload: JSON.stringify({ to, text })
    };

    return lambda.invoke(payload, cb);
  }

  return docClient.put(params, (err, data) => {
    if (err) return cb(err, data);

    const payload = {
      FunctionName: 'game_getUserByName',
      Payload: JSON.stringify(e)
    };

    return lambda.invoke(payload, (error, response) => sendTextMessage(error, response, data.Attributes.pin))
  });
}

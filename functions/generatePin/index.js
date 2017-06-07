const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-west-2' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

function generateRandomString() {
  return 'xxxx'.replace(/x/g, () => {
    return (Math.random() * 36 | 0).toString(36);
  });
}

exports.handle = function(e, ctx, cb) {
  if (!e.name) {
    return cb('Please provide a user name.', null);
  }

  function sendTextMessage(err, response, number) {
    const to = number;
    const text = `Your PIN is: ${JSON.parse(response.Payload).Item.pin}`;

    const payload = {
      FunctionName: 'game_sendTextMessage',
      Payload: JSON.stringify({ to, text })
    };

    return lambda.invoke(payload, cb);
  }

  function getPinByName(err, data) {
    if (err) return cb(err, data);

    const payload = {
      FunctionName: 'game_getPinByName',
      Payload: JSON.stringify({ name: e.name })
    };

    return lambda.invoke(payload,
      (error, response) =>
        sendTextMessage(error, response, JSON.parse(data.Payload).Item.number));
  }

  function getUserByName(err, data) {
    if (err) return cb(err, data);

    const payload = {
      FunctionName: 'game_getUserByName',
      Payload: JSON.stringify({ name: e.name })
    };

    return lambda.invoke(payload,
      (error, response) =>
        getPinByName(error, response));
  }

  const params = {
    Item: {
      name: e.name,
      pin: generateRandomString()
    },
    TableName: 'pins'
  };

  return docClient.put(params,
    (err, data) =>
      getUserByName(err, data));
}

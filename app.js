

function login(name) {
  if (getUserByName(name)) {
    send(pin);
  } else {
    requestPhone && createUser(name, phone);
  }
}

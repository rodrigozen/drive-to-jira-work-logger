var stdin = process.openStdin();

// Get a password from the console, printing stars while the user types
var get_password = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  password = ''
  process.stdin.on('data', function (char) {
    char = char + ""
    switch (char) {
    case "\n": case "\r": case "\u0004":
      // They've finished typing their password
      process.stdin.setRawMode(false)
      console.log("\nyou entered: "+password)
      stdin.pause()
      break
    case "\u0003":
      // Ctrl C
      console.log('Cancelled')
      process.exit()
      break
    default:
      // More passsword characters
      process.stdout.write('')
      password += char
      break
    }
  });
}

get_password();

var prompt = require("prompt");
prompt.colors = false;
prompt.message = "";
prompt.delimiter = "";
var questions = {
  properties: {
    senhaJira: {
      message: "Ops, Não achei a senha do jira, fala ae.. (prometo esquecer): ",
      hidden: true
    }
  }
}

prompt.get(questions, function( err, input ) {
  console.log('got it! ', input);
});
//console.log(new Buffer("rodrigo.zen").toString('base64'));

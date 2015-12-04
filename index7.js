var inquirer = require("inquirer");

var questions = [{
    message: "Ops, Não achei a senha do jira, fala ae.. (prometo esquecer): ",
    name: "pass",
    type: "password"
}]


inquirer.prompt(questions, function(answers) {
    console.log(answers)
});

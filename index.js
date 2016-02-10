var GoogleSheets = require('google-drive-sheets');
var inquirer = require("inquirer");
var conf = require('./conf');
var colunas = conf.colunas;
var creds = require('./google-service-account.json');
var appState = {};
appState.conf = conf;

var WorkLogger = function(planilha) {
    var wl = this;
    wl.planilha = planilha

    this.salvarSucessoAoLogar = function(linha) {
        return function(err) {
            if (err) {
                console.log(err);
            } else {
                linha[colunas.logado] = "TRUE";
                linha.save(function(err) {
                    if (err) console.log("FALHA AO SALVAR 'LOGADO' NA PLANILHA!!");
                });
            }
        }
    }

    this.verficarColunasObrigatorias = function(firstRow,sheet) {
        var ret = true;
        if (firstRow) {
            var firstRowKeys = Object.keys(firstRow);
            var colsKeys = Object.keys(colunas);
            for (var i = 0; i < colsKeys.length; i++) {
                if (firstRowKeys.indexOf(colunas[colsKeys[i]]) < 0) {
                    console.log("Coluna " + colunas[colsKeys[i]] + " não encontrada na planilha " + sheet.title)
                    ret = false;
                }
            }
        }
        return ret;
    }

    this.logarLinhas = function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) {
                jira.log(rows[i], wl.salvarSucessoAoLogar(rows[i]))
            }
        }
    }

    this.pegarlinhasNaoLogadas = function(sheet, cb) {
        sheet.getRows({ //pega 1 linha para passar pela validacao de colunas
            'max-results':1
        }, function (err,rows) {
            if (err) {
                console.log(err);
            } else {
                if (wl.verficarColunasObrigatorias(rows[0], sheet)) {
                    sheet.getRows({
                        query: colunas.logado + " != TRUE"
                    }, cb);
                }
            }
        });
    }

    this.cbPlanilhaCarregada = function(err, sheetInfo) {
        if (err) {
            console.log(err);
        } else {
            console.log(sheetInfo.title + ' carregado');
            for (var i = 0; i < sheetInfo.worksheets.length; i++) {
                console.log("Procurando horas não logadas na planilha " + sheetInfo.worksheets[i].title)
                wl.pegarlinhasNaoLogadas(sheetInfo.worksheets[i], wl.logarLinhas)
            }
        }
    }

    this.executar = function() {
        console.log("Carregando planilha...");
        var mySheet = new GoogleSheets(wl.planilha);
        mySheet.useServiceAccountAuth(creds, function(err) {
            if (err) {
                console.log(err);
            } else {
                mySheet.getInfo(wl.cbPlanilhaCarregada);
            }
        })
    }
}

//------------------------------------------


colunas = (function(_colunas) {
    // o google muda tira os espaçoes de deixa td lowercase.. não sei se abrange todos os casos
    var cols = {};
    var colsKeys = Object.keys(_colunas);
    for (var i = 0; i < colsKeys.length; i++) {
        cols[colsKeys[i]] = _colunas[colsKeys[i]].match(/([\S])/g).join('').toLowerCase();
    }
    return cols;
})(conf.colunas)

var jira = require('./jira')(colunas);

var questions = [{
    message: "Ops, Não achei a senha do jira, fala ae.. (prometo esquecer): ",
    name: "senhaJira",
    type: "password"
}]

var getQuestions = function(_conf) {
    var questions = [];

    if (!_conf.enderecoJira) {
        questions.push({
            message: "endereco Jira: ",
            name: "enderecoJira",
            type: "input",
            default: "https://lecomsa.atlassian.net"
        })
    }

    if (!_conf.planilha) {
        questions.push({
            message: "Hash da planilha: ",
            name: "planilha",
            type: "input"
        })
    }

    if (!_conf.usuarioJira) {
        questions.push({
            message: "Usuário Jira: ",
            name: "usuarioJira",
            type: "input"
        })
    }

    if (!_conf.senhaJira) {
        questions.push({
            message: "Senha Jira: ",
            name: "senhaJira",
            type: "password"
        })
    }

    return questions;
}

inquirer.prompt(getQuestions(conf), function(answers) {
    Object.assign(conf, answers);
    var workLogger = new WorkLogger(conf.planilha);
    workLogger.executar()
});

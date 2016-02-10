var request = require('request');
var conf = require('./conf');
var moment = require('moment');

var Jira = function(colunas) {

    this.worklogObjectFromGoogleRow = function(row) {
        var jiraWorklog = {}

        var duracao = moment.duration(row[colunas.duracao])
        jiraWorklog["timeSpent"] = duracao.days() + 'd ' + duracao.hours() + 'h ' + duracao.minutes() + 'm';
        //TODO: unHardCode timezone and date masks
        jiraWorklog["started"] = moment(row[colunas.data] + " " + row[colunas.inicio] + ' -02:00', "DD/MM/YYYY HH:mm Z").format('YYYY-MM-DDTHH:mm:ss.sssZZ');
        jiraWorklog["comment"] = row[colunas.comentario] ? row[colunas.comentario] : "";

        return jiraWorklog;
    };

    this.getBasicAuthString = function() {
        return "Basic " + new Buffer(conf.usuarioJira + ":" + conf.senhaJira).toString('base64')
    };

    this.makeRequest = function(row, cb) {
        var worklogObject = this.worklogObjectFromGoogleRow(row)

        var requestParams = {
            method: 'POST',
            uri: conf.enderecoJira + '/rest/api/2/issue/' + row[colunas.issue] + '/worklog',
            body: worklogObject,
            json: true,
            headers: {
                Authorization: this.getBasicAuthString()
            }

        }

        var requestCallback = function(error, response, body) {
            cb(response.statusCode != 201 ? ("jira error " + response.statusCode) : undefined);
        }

        console.log('Logando ' + worklogObject["timeSpent"] + " em " + worklogObject["started"] + " no issue " + row[colunas.issue]);
        request(requestParams, requestCallback);

    }

    this.log = function(row, cb) {
        if (row[colunas.issue]) {
            this.makeRequest(row, cb)
        } else {
            console.log("Linha com issue não preenchido" + ((row[colunas.comentario]) ? (' (' + row[colunas.comentario]) + ")" : "") + ", marcando como logado...")
            cb()
        }
    };
}

module.exports = function(colunas) {
    return new Jira(colunas);
}

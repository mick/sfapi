
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

module.exports = ticket = {};

ticket.parkingCitations = function(opts, cb){

    var formData = {
        clientcode:19,
        requestType:'submit',
        requestCount:1,
        clientAccount:5,
        ticketNumber:'',
        plateNumber:opts.plate,
        statePlate:opts.state, 
    };

    request({
        url:'https://prodpci.etimspayments.com/pbw/inputAction.doh',
        form:formData,
        method:'POST'
    }, function(err, resp, body){
        if(err) throw err;
        parseBody(opts, body, cb);
    });
};

function toMoney(str){
    str = str.replace('$', '');
    return parseFloat(str) || 0;
}

function parseBody(opts, body, cb){
    $ = cheerio.load(body);
    var results = {};
    var err = null;

    var error = $('#contents > table  > tr:nth-child(2) > td > form > table:nth-child(6) > tr > td > li.error').text().trim();

    if(error !== ''){
        if(error === 'Plate is not found'){
            err = {'error':error};
        } else if(error === 'The Plate entered has a balance of $0.00') {
            results = {
                plate: opts.plate,
                count: 0,
                plateAmount: 0,
                totalAmount: 0,
                processingFee: 0,
                citations: []
            };
        } else {
            err = {'error':'Unknown Error: ' + error };
        }
    }else {

        results = {
            plate: $('#contents > form > font:nth-child(8) > font > b').text().replace('License/Plate: ', ''),
            count: parseInt($('#contents > form > font:nth-child(8) > b').text(), 10) || 0,
            plateAmount: toMoney($('#contents > form > table:nth-child(11) > tr:nth-child(1) > td:nth-child(2) > font > b').text()),
            totalAmount: toMoney($('#contents > form > table:nth-child(11) > tr:nth-child(2) > td:nth-child(2) > b > font').text()),
            processingFee: toMoney($('#contents > form > table:nth-child(12) > tr > td > b').text())
        };
        results.state = results.plate.substr(0,2);
        results.plate = results.plate.substr(2);
        results.citations = [];

        for(var i =0; i < results.count; i++) {
            results.citations.push(
                {
                    citationNumber: $('#contents > form > table:nth-child(16)  > tr > td > table:nth-child(1)  > tr:nth-child(5) > td:nth-child(2) > table  > tr:nth-child('+(i+2)+') > td:nth-child(2) > font').text(),
                    issueDate: + new Date($('#contents > form > table:nth-child(16)  > tr > td > table:nth-child(1)  > tr:nth-child(5) > td:nth-child(2) > table  > tr:nth-child('+(i+2)+') > td:nth-child(3) > font').text()) /1000,
                    violationCode: $('#contents > form > table:nth-child(16)  > tr > td > table:nth-child(1)  > tr:nth-child(5) > td:nth-child(2) > table  > tr:nth-child('+(i+2)+') > td:nth-child(4) > font').text(),
                    violation: $('#contents > form > table:nth-child(16)  > tr > td > table:nth-child(1)  > tr:nth-child(5) > td:nth-child(2) > table  > tr:nth-child('+(i+2)+') > td:nth-child(5) > font').text(),
                    amount: toMoney($('#contents > form > table:nth-child(16)  > tr > td > table:nth-child(1)  > tr:nth-child(5) > td:nth-child(2) > table  > tr:nth-child('+(i+2)+') > td:nth-child(6) > font').text())
                }
            );
        }
    }
    cb(err, results);
}

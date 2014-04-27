var Hapi = require('hapi');
var ticket = require('./lib/ticket');

var server = Hapi.createServer('0.0.0.0', process.env.PORT || 3000, { cors: true });

var parkingCitations = function (request, reply) {
    var opts = {
        state: request.params.state,
        plate: request.params.plate
    };
    ticket.parkingCitations(opts, function(err, result){
        if(err) return reply(err);
        reply(result);
    });

};

server.route({ method: 'GET', path: '/citations/parking/{state}/{plate}.json', handler: parkingCitations });

server.start(function () {
    console.log('Server started at: ' + server.info.uri);
});

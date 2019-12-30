//npm install http;
var http = require('http');
//npm install express
var express = require("express");
//npm install node-red
var RED = require("node-red");
//npm install util
var util = require("util");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/red",
    httpNodeRoot: "/api",
    //on windows
    userDir:"c:\\node-red-files",
    //on linux
    // userDir:"/home/user",
    uiPort : 1880,
    uiHost: "localhost",
    storageModule : require("node-red-mongo-storage-plugin"),
    storageModuleOptions: {
        mongoUrl: 'mongodb://localhost:27017',
        database: 'local',
        collectionNames:{
            flows: "nodered-flows",
            credentials: "nodered-credentials",
            settings: "nodered-settings",
            sessions: "nodered-sessions"
        }
    }, 
    functionGlobalContext: { }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);



function getListenPath() {
    var port = settings.serverPort;
    if (port === undefined){
        port = settings.uiPort;
    }

    var listenPath = 'http'+(settings.https?'s':'')+'://'+
                    (settings.uiHost == '::'?'localhost':(settings.uiHost == '0.0.0.0'?'127.0.0.1':settings.uiHost))+
                    ':'+port;
    if (settings.httpAdminRoot !== false) {
        listenPath += settings.httpAdminRoot;
    } else if (settings.httpStatic) {
        listenPath += "/";
    }
    return listenPath;
}

RED.start().then(function() {
    if (settings.httpAdminRoot !== false || settings.httpNodeRoot !== false || settings.httpStatic) {
        server.on('error', function(err) {
            if (err.errno === "EADDRINUSE") {
                RED.log.error(RED.log._("server.unable-to-listen", {listenpath:getListenPath()}));
                RED.log.error(RED.log._("server.port-in-use"));
            } else {
                RED.log.error(RED.log._("server.uncaught-exception"));
                if (err.stack) {
                    RED.log.error(err.stack);
                } else {
                    RED.log.error(err);
                }
            }
            process.exit(1);
        });
        server.listen(settings.uiPort,settings.uiHost,function() {
            if (settings.httpAdminRoot === false) {
                RED.log.info(RED.log._("server.admin-ui-disabled"));
            }
            settings.serverPort = server.address().port;
            process.title = 'node-red';
            RED.log.info(RED.log._("server.now-running", {listenpath:getListenPath()}));
        });
    } else {
        RED.log.info(RED.log._("server.headless-mode"));
    }
}).otherwise(function(err) {
    RED.log.error(RED.log._("server.failed-to-start"));
    if (err.stack) {
        RED.log.error(err.stack);
    } else {
        RED.log.error(err);
    }
});

process.on('uncaughtException',function(err) {
    util.log('[red] Uncaught Exception:');
    if (err.stack) {
        util.log(err.stack);
    } else {
        util.log(err);
    }
    process.exit(1);
});
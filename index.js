const MongoHandler = require("./MongoHandler");


var settings;
var mongoHandler;

var mongodb = {    
    init: function(_settings) {
        settings = _settings;
        if(settings.storageModuleOptions == null || settings.storageModuleOptions.mongoUrl == null || settings.storageModuleOptions.database == null){
            throw new Error("mongo storage module's required parameters are not defined");
        }
        mongoHandler = new MongoHandler(settings.storageModuleOptions.mongoUrl, settings.storageModuleOptions.database);
        return mongoHandler.connect();
    },

    getFlows: function() {
        return mongoHandler.findAll('flows');
    },

    saveFlows: function(flows) {
        return mongoHandler.saveAll('flows', flows);
    },

    getCredentials: function() {
        return mongoHandler.findAll('credentials');
    },

    saveCredentials: function(credentials) {
        return mongoHandler.saveAll('credentials', credentials);
    },

    getSettings: function() {
        return mongoHandler.findAll('settings');
    },
    saveSettings: function(settings) {
        return mongoHandler.saveAll('settings', settings);
    },
    getSessions: function() {
        return mongoHandler.findAll('sessions');
    },
    saveSessions: function(sessions) {
        return mongoHandler.saveAll('sessions'. sessions);
    },

    getLibraryEntry: function(type, path) {
        return mongoHandler.findOneByPath(type, path);
    },

    saveLibraryEntry: function(type, path, meta, body) {
        return mongoHandler.saveOrUpdateByPath(type, path, meta, body) ;
    }
};

module.exports = mongodb;

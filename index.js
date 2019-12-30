const constants = require("./constants");
const MongoHandler = require("./MongoHandler");


var settings;
var mongoHandler;

var storageModule = {    
    init: function(_settings) {
        settings = _settings;
        if(settings.storageModuleOptions == null || settings.storageModuleOptions.mongoUrl == null || settings.storageModuleOptions.database == null){
            throw new Error("mongo storage module's required parameters are not defined");
        }        

        this.collectionNames = Object.assign(constants.DefaultCollectionNames);
        if(settings.storageModuleOptions.collectionNames != null){
            for(let settingsColName of Object.keys(settings.storageModuleOptions.collectionNames)){
                this.collectionNames[settingsColName] = settings.storageModuleOptions.collectionNames[settingsColName];
            }
        }
                
        mongoHandler = new MongoHandler(settings.storageModuleOptions.mongoUrl, settings.storageModuleOptions.database);
        return mongoHandler.connect();
    },

    getFlows: function() {
        return mongoHandler.findAll(this.collectionNames.flows);
    },

    saveFlows: function(flows) {
        return mongoHandler.saveAll(this.collectionNames.flows, flows);
    },

    getCredentials: function() {
        return mongoHandler.findAll(this.collectionNames.credentials);
    },

    saveCredentials: function(credentials) {
        return mongoHandler.saveAll(this.collectionNames.credentials, credentials);
    },

    getSettings: function() {
        return mongoHandler.findAll(this.collectionNames.settings);
    },
    saveSettings: function(settings) {
        return mongoHandler.saveAll(this.collectionNames.settings, settings);
    },
    getSessions: function() {
        return mongoHandler.findAll(this.collectionNames.sessions);
    },
    saveSessions: function(sessions) {
        return mongoHandler.saveAll(this.collectionNames.sessions, sessions);
    },

    getLibraryEntry: function(type, path) {
        return mongoHandler.findOneByPath(type, path);
    },

    saveLibraryEntry: function(type, path, meta, body) {
        return mongoHandler.saveOrUpdateByPath(type, path, meta, body) ;
    }
};

module.exports = storageModule;

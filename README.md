Node Red Mongo Storage Plugin
===============================

This plugin allows you to store your flows and library entries
in MongoDB.

The plugin creates a collection per entity type and save each entity seperatly which lead to increased performance.

Getting Started
-----

For this one, you'll need a separate script to start your Node Red,
as per the guide for running a custom Node-Red inside your process:

http://nodered.org/docs/embedding.html

You can also check my example node-red-app in the github repository: [node red quickstart with node-red-mongo-storage-plugin](https://github.com/adibenmati/node-red-mongo-storage-plugin/blob/master/examples/node-red-app.js)


Firstly, require the module:

```bash
npm install --save node-red-mongo-storage-plugin
```

Then, in your settings, add:

```javascript
var settings = {
	...
    storageModule : require("node-red-mongo-storage-plugin"),
    storageModuleOptions: {        
        mongoUrl: 'mongodb://localhost:27017',
        //also possible
        //mongoUrl: 'PROCESS.ENV.MONGOURL',
        database: 'local',
        //optional
        //set the collection name that the module would be using
        collectionNames:{
            flows: "nodered-flows",
            credentials: "nodered-credentials",
            settings: "nodered-settings",
            sessions: "nodered-sessions"
        }
    },
	...
};
```

Your `storageModuleOptions` could also be injected with env variables

credit to: freefoote for creating the npm package node-red-flows-mongo which help me made this one.



TODO
-----
1.Add tests
2.Create an abstraction over mongoHandler for reusing with different types of databases.
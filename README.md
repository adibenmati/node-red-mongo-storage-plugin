Node Red Mongo Storage Plugin
===============================

This module allows you to store your flows and library entries
in MongoDB.

Usage
-----

For this one, you'll need a separate script to start your Node Red,
as per the guide for running a custom Node-Red inside your process:

http://nodered.org/docs/embedding.html
You can also check my example node-red-app in the github repository 


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
        database: 'local'
    },
	...
};
```

Your `sotrageModuleOptions` could also be injected with env variables

credit to: freefoote for create the npm package node-red-flows-mongo.
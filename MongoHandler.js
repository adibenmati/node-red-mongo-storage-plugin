const when = require('when');
const Promise = when.promise;
const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

let MongoHandler = class MongoHandler {
  constructor(url, databaseName) {
    this.url = url;
    this.dbInstace = null;
    this.client = null;
    this.databaseName = databaseName;
  }

  connect() {
    return Promise((resolve, reject) => {
      MongoClient.connect(this.url, (err, client) => {
        if (err) {
          reject(err);
        }

        this.client = client;
        this.dbInstace = client.db(this.databaseName, {useUnifiedTopology: true });
        resolve();
      });
    })
  }  


  
  findAll(collectionName) {
    return Promise((resolve, reject) => {
      try {   
        this.dbInstace.collection(collectionName)
          .find({}).toArray(function (err, storageDocuments) {
            if (err) {
                reject(err);
            }
            if (storageDocuments == null) {
                resolve({});
            } else {                                
              resolve(storageDocuments);
            }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }


  saveAll(collectionName, objects) {
    return Promise(async (resolve, reject) => {
      try {           
        await this.dropCollectionIfExists(collectionName);        
        
        if(objects.length > 0){
        let bulk = this.dbInstace.collection(collectionName).initializeUnorderedBulkOp();          
          objects.forEach((obj) => {
            bulk.insert(obj);
          });                  
          bulk.execute();
        }

        resolve();        
      } catch (ex) {
        reject(ex);
      }
    });
  }

  async dropCollectionIfExists(collectionName){
    let collectionList= await this.dbInstace.listCollections({
      name: collectionName
    }).toArray();

    if(collectionList.length !== 0){
      await this.dbInstace.collection(collectionName).drop();
    }
  }

  findOneByPath(collectionName, path) {
    return Promise((resolve, reject) => {
      try {   
        this.dbInstace.collection(collectionName)
          .findOne({path : path}, function (err, storageDocument) {
            if (err) {
                reject(err);
            }
            if (storageDocument == null) {
                resolve({});
            } else {
                if (storageDocument.body) {
                    if (typeof(storageDocument.body) == "string") {
                        resolve(JSON.parse(storageDocument.body));
                    } else {
                        resolve(storageDocument.body);
                     }
                } else {
                    resolve({});
                }
            }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  saveOrUpdateByPath(collectionName, path, meta, body) {
    return Promise((resolve, reject) => {
      try {
        this.dbInstace.collection(collectionName)
          .findOne({              
              path: path
            },
            function (err, storageDocument) {
              if (err) {
                reject(err);
              } else {
                if (storageDocument == null) {
                  storageDocument = {                    
                    path: path
                  };
                }

                storageDocument.meta = JSON.stringify(meta);
                storageDocument.body = JSON.stringify(body);

                storageDocument.save(function (err, storageDocument) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              }
            }
          );
      } catch (ex) {
        reject(ex);
      }
    });
  }
};

module.exports = MongoHandler;

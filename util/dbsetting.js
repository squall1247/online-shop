const dbUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.groiz.mongodb.net:27017,cluster0-shard-00-01.groiz.mongodb.net:27017,cluster0-shard-00-02.groiz.mongodb.net:27017/${process.env.MONGO_DEFAULT_DATABASE}?ssl=true&replicaSet=atlas-2ixbgs-shard-0&authSource=admin&retryWrites=true&w=majority`;

exports.dbUri = dbUri;

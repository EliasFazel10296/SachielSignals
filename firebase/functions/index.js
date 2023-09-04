const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://sachiel-s-signals-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const database = admin.database();

const XMLHttpRequest = require("xhr2").XMLHttpRequest;

const runtimeOptions = {
    timeoutSeconds: 512,
}

/* Scheduled Functions */
// Schedule At 23:30 Everyday https://crontab.guru/ - (Minute) (Hours) (Day Of Month) (Month) (Day Of Week)
exports.sachielAnalysisStatus = functions.pubsub.schedule('30 23 * * *').timeZone('America/New_York').onRun((context) => {
    console.log('Time; ' + Date.now());

    /* Start - ETH/USDT */
    cryptocurrenciesMarketData('ETH/USDT');
    /* End - ETH/USDT */

    /* Start - EUR/USD */
    // forexMarketData('EUR/USD');
    /* End - EUR/USD */

    return null;
});

async function cryptocurrenciesMarketData(marketPairInput) {

    var marketPair = marketPairInput;

    var ethusdRsiEndpoint = 'https://api.polygon.io/v1/indicators/rsi/'
        + 'X:' + marketPair
        + '?timespan=day&window=13&series_type=close'
        + '&order=desc&limit=1'
        + '&apiKey=BW99q7QQNIgDVfkyHi1H7SrTSKHZeY9_'

    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', ethusdRsiEndpoint, true);
    xmlHttpRequest.setRequestHeader('accept', 'application/json');
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
    xmlHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4) {

        } else {

        }
    };
    xmlHttpRequest.onprogress = function () {

    };
    xmlHttpRequest.onload = function () {

        var jsonObjectRSI = JSON.parse(xmlHttpRequest.responseText);

        var rsiValue = jsonObjectRSI.results.values[0].value;
        var timestampValue = jsonObjectRSI.results.values[0].timestamp;

        analysisOfRsi(rsiValue, marketPair.replace("/", ""));

    };
    xmlHttpRequest.send();

}

async function analysisOfRsi(rsiNumber, marketPair) {

    var statusCondition = '\'Platinum\' in topics || \'Gold\' in topics || \'Palladium\' in topics';

    var statusMessage = 'Observing ' + marketPair;

    if (rsiNumber >= 73) {
       
        statusMessage = 'Sachiel AI is Analysing ' + marketPair + ' to SELL.';

        statusCheckpoint(marketPair, statusMessage, statusCondition);

    } else if (rsiNumber <= 27) {

        statusMessage = 'Sachiel AI is Analysing ' + marketPair + ' to BUY.';
        
        statusCheckpoint(marketPair, statusMessage, statusCondition);

    } else { 

        statusMessage = 'Observing ' + marketPair + '...' + 'RSI: ' + rsiNumber;

        statusCondition = '\'Privileged\' in topics';

        sendNotification(statusMessage, statusCondition);

    }

}

function statusCheckpoint(marketPair, statusMessage, statusCondition) {

    firestore.doc('/Sachiels/AI/Status/' + marketPair).get().then((documentSnapshot) => {

        if (documentSnapshot.exists()) {

            const documentData = documentSnapshot.data();

            var lastStatusUpdate = parseInt(documentData.statusTimestamp.toString());

            var nowMillisecond = Date.now();

            var sevenDaysMillisecond = 86400000 * 7;

            if ((nowMillisecond - lastStatusUpdate) > sevenDaysMillisecond) {

                sendNotification(statusMessage, statusCondition);

                const aiStatus = {
                    statusMessage: statusMessage,
                    statusMarket: marketPair,
                    statusAuthor: "Sachiels AI",
                    statusTimestamp: nowMillisecond
                };

                firestore.doc('/Sachiels/AI/Status/' + marketPair).set(aiStatus);

            }

        } else {

            sendNotification(statusMessage, statusCondition);

            const aiStatus = {
                statusMessage: statusMessage,
                statusMarket: marketPair,
                statusAuthor: "Sachiels AI",
                statusTimestamp: nowMillisecond
            };

            firestore.doc('/Sachiels/AI/Status/' + marketPair).set(aiStatus);

        }

    });

}
/* Scheduled Functions */

exports.platinumTier = functions.runWith(runtimeOptions).https.onCall(async (data, context) => {
    functions.logger.log("Receiving Platinum Signal :::", data.tradeTimestamp);

    firestore.doc('/Sachiels/Signals/Platinum/' + data.tradeTimestamp).get().then((documentSnapshot) => {
        functions.logger.log("Platinum Signal Document Snapshot ::: ", documentSnapshot);

        const documentData = documentSnapshot.data();
        functions.logger.log("Platinum Signal Document ::: ", documentData);

        if (tradeMarketType.length == 0) {

            updateMarketType(purchasingTier, data.tradeTimestamp, documentData.tradeMarketPair);

        }

        var notificationColor = "🟢";

        if (documentData.tradeCommand == "Sell") {

            notificationColor = "🔴";

        }

        const signalData = {

            notification: {
                title: notificationColor + " " + documentData.tradeCommand + " ➡️ " + documentData.tradeMarketPair,
                body: "Estimated Profit: " + documentData.tradeProfitAmount + "\n" 
                    + "Trade Accuracy: " + documentData.tradeAccuracyPercentage
            },
    
            android: {
                ttl: (3600 * 1000) * (1), // 1 Hour in Milliseconds
                priority: 'high',
            },
    
            data: {
                "tradeCommand": documentData.tradeCommand,
                "tradeAccuracyPercentage": documentData.tradeAccuracyPercentage,
                "tradeEntryPrice": documentData.tradeEntryPrice,
                "tradeLotSize": documentData.tradeLotSize,
                "tradeMarketPair": documentData.tradeMarketPair,
                "tradeProfitAmount": documentData.tradeProfitAmount,
                "tradeStopLoss": documentData.tradeStopLoss,
                "tradeTakeProfit": documentData.tradeTakeProfit,
                "tradeTimeframe": documentData.tradeTimeframe,
                "tradeTimestamp": documentData.tradeTimestamp,
            },
    
            topic: "Platinum"
        };
    
        admin.messaging().send(signalData).then((response) => {
            functions.logger.log("Successfully Sent ::: ", response);
    
        }).catch((error) => {
            functions.logger.log("Error Sending ::: ", error);
    
        });

    });

});

exports.goldTier = functions.runWith(runtimeOptions).https.onCall(async (data, context) => {
    functions.logger.log("Receiving Gold Signal :::", data.tradeTimestamp);

    firestore.doc('/Sachiels/Signals/Gold/' + data.tradeTimestamp).get().then((documentSnapshot) => {
        functions.logger.log("Gold Signal Document Snapshot ::: ", documentSnapshot);

        const documentData = documentSnapshot.data();
        functions.logger.log("Gold Signal Document ::: ", documentData);

        if (tradeMarketType.length == 0) {

            updateMarketType(purchasingTier, data.tradeTimestamp, documentData.tradeMarketPair);

        }

        var notificationColor = "🟢";

        if (documentData.tradeCommand == "Sell") {

            notificationColor = "🔴";

        }

        var signalData = {
    
            notification: {
                title: notificationColor + " " + documentData.tradeCommand + " ➡️ " + documentData.tradeMarketPair,
                body: "Estimated Profit: " + documentData.tradeProfitAmount + "\n" 
                    + "Trade Accuracy: " + documentData.tradeAccuracyPercentage
            },

            android: {
                ttl: (3600 * 1000) * (1), // 1 Hour in Milliseconds
                priority: 'high',
            },
    
            data: {
                "tradeCommand": documentData.tradeCommand,
                "tradeAccuracyPercentage": documentData.tradeAccuracyPercentage,
                "tradeEntryPrice": documentData.tradeEntryPrice,
                "tradeLotSize": documentData.tradeLotSize,
                "tradeMarketPair": documentData.tradeMarketPair,
                "tradeProfitAmount": documentData.tradeProfitAmount,
                "tradeStopLoss": documentData.tradeStopLoss,
                "tradeTakeProfit": documentData.tradeTakeProfit,
                "tradeTimeframe": documentData.tradeTimeframe,
                "tradeTimestamp": documentData.tradeTimestamp,
            },
    
            topic: "Gold"
        };
    
        admin.messaging().send(signalData).then((response) => {
            functions.logger.log("Successfully Sent ::: ", response);
    
        }).catch((error) => {
            functions.logger.log("Error Sending ::: ", error);
    
        });

    });

});

exports.palladiumTier = functions.runWith(runtimeOptions).https.onCall(async (data, context) => {
    functions.logger.log("Receiving Palladium Signal :::", data.tradeTimestamp);

    firestore.doc("/Sachiels/Signals/Palladium/" + data.tradeTimestamp).get().then((documentSnapshot) => {
        functions.logger.log("Palladium Signal Document Snapshot ::: ", documentSnapshot);

        const documentData = documentSnapshot.data();
        functions.logger.log("Palladium Signal Document ::: ", documentData);
    
        if (tradeMarketType.length == 0) {

            updateMarketType(purchasingTier, data.tradeTimestamp, documentData.tradeMarketPair);

        }

        var notificationColor = "🟢";
        
        if (documentData.tradeCommand == "Sell") {

            notificationColor = "🔴";

        }

        var signalData = {
    
            notification: {
                title: notificationColor + " " + documentData.tradeCommand + " ➡️ " + documentData.tradeMarketPair,
                body: "Estimated Profit: " + documentData.tradeProfitAmount + "\n" 
                    + "Trade Accuracy: " + documentData.tradeAccuracyPercentage
            },
            
            android: {
                ttl: (3600 * 1000) * (1), // 1 Hour in Milliseconds
                priority: 'high',
            },
    
            data: {
                "tradeCommand": documentData.tradeCommand,
                "tradeAccuracyPercentage": documentData.tradeAccuracyPercentage,
                "tradeEntryPrice": documentData.tradeEntryPrice,
                "tradeLotSize": documentData.tradeLotSize,
                "tradeMarketPair": documentData.tradeMarketPair,
                "tradeProfitAmount": documentData.tradeProfitAmount,
                "tradeStopLoss": documentData.tradeStopLoss,
                "tradeTakeProfit": documentData.tradeTakeProfit,
                "tradeTimeframe": documentData.tradeTimeframe,
                "tradeTimestamp": documentData.tradeTimestamp,
            },
    
            topic: "Palladium"
        };
    
        admin.messaging().send(signalData).then((response) => {
            functions.logger.log("Successfully Sent ::: ", response);
    
        }).catch((error) => {
            functions.logger.log("Error Sending ::: ", error);
    
        });

    });

});

exports.statusAI = functions.runWith(runtimeOptions).https.onCall(async (data, context) => {
    functions.logger.log("AI Status Message :::", data.statusMessage);

    const statusCondition = '\'Platinum\' in topics || \'Gold\' in topics || \'Palladium\' in topics';

    sendNotification(data.statusMessage, statusCondition);

});

exports.transferAcademyContents = functions.runWith(runtimeOptions).https.onRequest(async (req, res) => {

    var numberOfPage = req.query.numberOfPage;

    if (numberOfPage == null) {
        numberOfPage = 1;
    }

    var applicationsEndpoint = 'https://geeksempire.co/wp-json/wp/v2/posts?'
        + '&page=' + numberOfPage
        + '&per_page=99'
        + '&categories=4445'
        + '&orderby=date'
        + '&order=asc';

    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('GET', applicationsEndpoint, true);
    xmlHttpRequest.setRequestHeader('accept', 'application/json');
    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
    xmlHttpRequest.onreadystatechange = function () {
        if (this.readyState == 4) {

        } else {

        }
    };
    xmlHttpRequest.onprogress = function () {

    };
    xmlHttpRequest.onload = function () {

        var jsonArrayParserResponse = JSON.parse(xmlHttpRequest.responseText);

        jsonArrayParserResponse.forEach((jsonObject) => {

            setPostsData(jsonObject);

        });

    };
    xmlHttpRequest.send();

});

async function setPostsData(jsonObject) {

    const categoriesMap = new Map();

    categoriesMap.set("4562", "Articles");
    categoriesMap.set("1857", "News");
    categoriesMap.set("4563", "Tutorials");

    categoriesMap.set("4445", "Financial");
    categoriesMap.set("4508", "Investment");
    categoriesMap.set("4444", "Make Money Online");
    categoriesMap.set("4393", "Trading");

    categoriesMap.set("2485", "Lifestyle");

    const idKey = "id";
    const linkKey = "link";

    const titleKey = "title";
    const excerptKey = "excerpt";

    const categoriesKey = "categories";
    const tagsKey = "tags";

    const imageKey = "jetpack_featured_media_url";

    var postId = jsonObject[idKey];
    var postLink = jsonObject[linkKey];

    var postTitle = jsonObject[titleKey]["rendered"];
    var postSummary = jsonObject[excerptKey]["rendered"];

    var postImage = jsonObject[imageKey];

    var productCategories = jsonObject[categoriesKey].toString();
    var productCategory = "Financial";
    try {
        productCategory = categoriesMap.get(jsonObject[categoriesKey][0].toString());
    } catch (err) {
        functions.logger.log(err.toString());
    }


    /* Articles - News - Tutorials */
    var postType = "Articles";

    if (productCategories.includes("4562")) {

        postType = "Articles";

    } else if (productCategories.includes("1857")) {

        postType = "News";

    } else if (productCategories.includes("4563")) {

        postType = "Tutorials";

    }

    functions.logger.log(jsonObject[categoriesKey][0].toString());
    functions.logger.log(postId + " Added To " + postType + " | " + productCategory);

    /* Start - Document * With Even Directory */
    var firestoreDirectory = '/' + 'Sachiels'
        + '/' + 'Academy'
        + '/' + postType
        + '/' + postId;

    await firestore.doc(firestoreDirectory).set({
        articleCategory: productCategory,
        articleCover: postImage,
        articleLink: postLink,
        articleSummary: postSummary,
        articleTimestamp: Date.now().toString(),
        articleTitle: postTitle,
    }).then(result => {
        functions.logger.log("Successfully Added.");

    }).catch(error => {
        functions.logger.log("Error: " + error);
    });
    /* End - Document * With Even Directory */

}

exports.experiment = functions.runWith(runtimeOptions).https.onRequest(async (req, res) => {
    functions.logger.log("Experiments 🧪");

    var rawText = '{"results": {"underlying": {"url": "https://api.polygon.io/v2/aggs/ticker/C:EURUSD/range/1/day/1253851200000/1693236267122?limit=62&sort=desc"},"values": [{"timestamp": 1693094400000,"value": 29.18548305999019}]},"status": "OK","request_id": "834178999f763bdc336a2f95b530057f","next_url": "https://api.polygon.io/v1/indicators/rsi/C:EURUSD?cursor=YWRqdXN0ZWQ9dHJ1ZSZhcD0lN0IlMjJ2JTIyJTNBMCUyQyUyMm8lMjIlM0EwJTJDJTIyYyUyMiUzQTEuMDc5NCUyQyUyMmglMjIlM0EwJTJDJTIybCUyMiUzQTAlMkMlMjJ0JTIyJTNBMTY5MzAwODAwMDAwMCU3RCZhcz0mZXhwYW5kX3VuZGVybHlpbmc9ZmFsc2UmbGltaXQ9MSZvcmRlcj1kZXNjJnNlcmllc190eXBlPWNsb3NlJnRpbWVzcGFuPWRheSZ0aW1lc3RhbXAubHQ9MTY5MzA5NDQwMDAwMCZ3aW5kb3c9MTM"}';
    
    var jsonObjectRSI = JSON.parse(rawText);

    var rsiValue = jsonObjectRSI.results.values[0].value;
    var timestampValue = jsonObjectRSI.results.values[0].timestamp;

    res.send(200, "RSI: " + rsiValue 
        + " ----- "
        + "Timestamp: " + timestampValue);

});

async function updateMarketType(purchasingTier, tradeTimestamp, tradingPair) {

    const reference = database.ref("/SachielsSignals/Markets");

    reference.once("value", function(querySnapshot) {
        
        querySnapshot.forEach((childSnapshot) => {  
            functions.logger.log("🧪 " + childSnapshot.key);

            childSnapshot.forEach((itemSnapshot) => {

                if (itemSnapshot.key == tradingPair) {
                    console.log('Founded Item ::: ' + itemSnapshot.key);

                    firestore.doc("/Sachiels/Signals/" + purchasingTier + "/" + tradeTimestamp)
                        .update({tradeMarketType: childSnapshot.key}).then((documentSnapshot) => {
        
                            

                        });

                }
                
            });
            
        });

    }); 
      
}

/* Utilities */
function sendNotification(statusMessage, statusCondition) {

    var dataStatusAI = {
        
        notification: {
            title: "Sachiels AI Status 🤖",
            body: statusMessage
        },
        
        android: {
            ttl: (3600 * 1000) * (1), // 1 Hour in Milliseconds
            priority: 'high',
        },

        data: {
            "statusMessage": statusMessage,
        },

        condition: statusCondition
        
    };

    admin.messaging().send(dataStatusAI).then((response) => {
        functions.logger.log("Successfully Sent ::: ", response);

    }).catch((error) => {
        functions.logger.log("Error Sending ::: ", error);

    });

}
/* Utilities */
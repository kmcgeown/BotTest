/*-----------------------------------------------------------------------------
This Bot demonstrates how to use a waterfall to prompt the user with a series
of questions.
This example also shows the user of session.userData to persist information
about a specific user. 
# RUN THE BOT:
    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

var builder = require('./node_modules/botbuilder');
var restify = require('./node_modules/restify');
//var someApi = require('someApi.js');

//=========================================================
// Bot Setup
//=========================================================
//var items = [{ application: "Test1", avatar_url: "", html_url: "www.google.com" }, { application: "Test2", avatar_url: "", html_url: "www.google.com" }];
// var card = new builder.ThumbnailCard(session);
// card.title("CC");
// card.image([builder.CardImage.create(session, "https://www.google.co.uk/imgres?imgurl=http%3A%2F%2Fmedia.istockphoto.com%2Fphotos%2Fcloud-computing-picture-id498087393%3Fk%3D6%26m%3D498087393%26s%3D170667a%26w%3D0%26h%3DQtErE9Sb1Es_8IeT1wkLq9DHqq5jvYgqu5-c83D5hZM%3D&imgrefurl=http%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcloud-computing&docid=ZvEDlmvfh_GISM&tbnid=GeKXPPSl8jmJQM%3A&vet=1&w=479&h=359&safe=active&bih=1830&biw=1080&ved=0ahUKEwjq36qGuJvQAhUDliwKHcn5BDcQMwgqKA0wDQ&iact=mrc&uact=8")]);
// card.tap(new builder.CardAction.openUrl(session, "www.google.com"));
// var message = new builder.Message(session).attachments(card).attachmentLayout('carousel');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: "5cd69007-4e0d-4bcb-a1fc-a6f74f943ef1",
    appPassword: "qcLVVh2LexyP1jcyNaTFA2h"
});
var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', function (session) {
//     session.send("Hello World");
// });
// bot.dialog('/', [
//     function (session) {
//         builder.Prompts.text(session, "Hi welcome to Avaya.. What's your name?");
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?");
//     },
//     function (session, results) {
//         session.userData.productFamily = results.response;
//         builder.Prompts.choice(session, "What type of product are you interested in?", ["Unified Communications and Collaboration", "Customer Experience Management", "Networking", "Cloud"]);
//     },
//     function (session, results) {
//         session.userData.product = results.response;
//         session.userData.productFamilyChoosen = results.response.entity;
//         builder.Prompts.choice(session, session.userData.productFamilyChoosen + " has the following products ", ["Communication and Messaging", "Platform and Infrasture", "Video and Conferencing"]);
//         // session.userData.language = results.response.entity;
//         // session.send("Got it.. " + session.userData.name +
//         //     " you've been programming for " + session.userData.coding +
//         //     " years and use " + session.userData.language + ".");
//     }
// ]);
bot.dialog('/', [
    function (session) {
        session.send("Hello... How can we help you today");
        session.beginDialog('/menu');
    },
    function (session, results) {
        session.endConversation("Goodbye until next time...");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Products|Services|Support|None');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/products');
                break;
            case 1:
                session.beginDialog('/services');
                break;
            case 2:
                session.beginDialog('/support');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('/products', [
    function (session, args) {
        builder.Prompts.choice(session, "What type of product are you interested in?", ["Unified Communications", "Customer Experience", "Networking", "Cloud"]);
        // builder.Prompts.choice(session, "Choose heads or tails.", "heads|tails", { listStyle: builder.ListStyle.none })
    }
    // ,
    // function (session, results) {
    //     session.userData.product = results.response;
    //     session.userData.productFamilyChoosen = results.response.entity;
    //     // var cards = function () { return createCard(session) };

    //     // session.send(message);
    // }
    ,
    function (session) {
        // Reload menu
        session.endConversation("Goodbye until next time...");
    }
    //,
    // function (session, results) {
    //     var flip = Math.random() > 0.5 ? 'heads' : 'tails';
    //     if (flip == results.response.entity) {
    //         session.endDialog("It's %s. YOU WIN!", flip);
    //     } else {
    //         session.endDialog("Sorry... It was %s. you lost :(", flip);
    //     }
    // }
]);

bot.dialog('/services', [
    function (session, args) {
        builder.Prompts.number(session, "How many dice should I roll?");
    }
    // ,
    // function (session, results) {
    //     if (results.response > 0) {
    //         var msg = "I rolled:";
    //         for (var i = 0; i < results.response; i++) {
    //             var roll = Math.floor(Math.random() * 6) + 1;
    //             msg += ' ' + roll.toString();
    //         }
    //         session.endDialog(msg);
    //     } else {
    //         session.endDialog("Ummm... Ok... I rolled air.");
    //     }
    // }
]);

bot.dialog('/orders', [
    function (session, args) {
        // builder.Prompts.text(session, "What is your question?");
        builder.Prompts.number(session, "Please enter your Order No and we can check it's status");
    }
    ,
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        session.endDialog(randomAnswers);
    }
]);

bot.dialog('/support', [
    function (session, args) {
        // builder.Prompts.text(session, "What is your question?");
        builder.Prompts.number(session, "Please enter your Order No and we can check it's status");
    }
    ,
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        session.endDialog(randomAnswers);
    }
]);

var randomAnswers = [
    "Your account is on hold",
    "Your order is processed",
    "Have you paid?"
];

function createCard(session) {
    var card = new builder.ThumbnailCard(session);
    card.title("CC");
    card.image([builder.CardImage.create(session, "")]);
    card.tap(new builder.CardAction.openUrl(session, "www.google.com"));
    return card;
}

// function createCard(session, item) {
//     var card = new builder.ThumbnailCard(session);
//     card.title(application);
//     card.image([builder.CardImage.create(session, avatar_url)]);
//     card.tap(new builder.CardAction.openUrl(session, html_url));
//     return card;
// }
// var thumbnail = new builder.ThumbnailCard(sessio);
// thumbnail.title(profile.login);
// thumbnail.
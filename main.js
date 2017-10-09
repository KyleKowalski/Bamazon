(function() { // TODO:  more research on IIFE

    var inquirer = require('inquirer');
    var db = require('./bamazonDB.js');
    var endUser = require('./endUser.js');
    var supervisor = require('./supervisor.js');
    var manager = require('./manager.js');

    mainPrompt();

    function mainPrompt() {
        db.openDb;
        inquirer.prompt([
            {
                type: "list",
                message: "\n\n=====\nWelcome to Bamazon:  Please select your user\n(Yes, I know this is tied to a users' permissions)\n=====",
                choices: ["End User", "Manager", "Supervisor", "Quit"],
                name: "mainPromptChoice"
            }
        ]).then(function(response) {
            if (response.mainPromptChoice === 'End User') {
                endUser.mainPrompt();
            }
            else if (response.mainPromptChoice === 'Manager') {
                manager.mainPrompt();
            }
            else if (response.mainPromptChoice === 'Supervisor') {
                supervisor.mainPrompt();
            }
            else if (response.mainPromptChoice === 'Quit') {
                quit();
            }
            else {
                console.log("We've escaped the main prompt choice somehow - log an error")
            }
        });
    }

    function quit() {
        console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
        db.closeDb();
    }

    module.exports = {
        mainPrompt: mainPrompt
    }

})();
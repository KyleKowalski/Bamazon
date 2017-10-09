var inquirer = require('inquirer');
var main = require('./main.js');
var db = require('./bamazonDB.js');

function mainPrompt() {
    console.log(`\n\nWelcome To The Bamazon Supervisor Interface!\n`);

    db.listProductsByDepartment();
    
    // inquirer.prompt([
    //     {
    //         type: 'input',
    //         message: `Type in the ID number of the item you'd like to buy:`,
    //         name: 'productId',
    //         validate: (value) => !isNaN(value)
    //     },
    //     {
    //         type: 'input',
    //         message: `How many units would you like to buy?`,
    //         name: 'quantity',
    //         validate: (value) => !isNaN(value)
    //     }
    //     ]).then(function(response) {
    //         console.log('blah');
    //     })
}

function quit() {
    main.mainPrompt();
}

module.exports = {
    mainPrompt: mainPrompt
}
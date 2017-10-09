var inquirer = require('inquirer');
var main = require('./main.js');
var db = require('./bamazonDB.js');

// mainPrompt();

function mainPrompt() {
    console.log(`\n\nWelcome To Bamazon!\n`);

    db.listProductsByDepartment('');
    
    // mainPromptInquire();
}

function mainPromptInquire() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Enter the ID of the product to purchase:',
            name: 'productId',
            validate: (value) => !isNaN(value)
        },
        {
            type: 'input',
            message: 'How many would you like to purchase?',
            name: 'quantity',
            validate: (value) => !isNaN(value)
        }
        ]).then(function(response) {
            db.sellProduct(response.productId, response.quantity);
        })
}

function authorizeSale(productId, quantity) {
    inquirer.prompt([
        {
            type: 'confirm',
            message: 'Proceed with sale?',
            name: 'proceed'
        }
    ]).then(function(response){
        if (response.proceed) {
            db.addSale(productId, quantity);
        }
        mainPrompt();
    })
}

function quit() {
    main.mainPrompt();
}

module.exports = {
    mainPrompt: mainPrompt,
    authorizeSale: authorizeSale
}
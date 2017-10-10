var mysql = require('mysql');
var AsciiTable = require('ascii-table');
var inquirer = require('inquirer');
// var main = require('./main.js');
// var db = require('./bamazonDB.js');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'bamazon_service',
    password : 'password',
    database : 'bamazon'
  });

mainPrompt();

function mainPrompt() {
    console.log(`\n\nWelcome To The Bamazon Manager Interface!\n`);

    // db.listProductsByDepartment('');
    
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
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
    connection.end();
}

module.exports = {
    mainPrompt: mainPrompt
}
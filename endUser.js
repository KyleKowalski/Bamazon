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
connection.connect();

function mainPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: `\n\n\n=====\nPlease select one of the following:\n=====\n`,
            choices: ['Browse Inventory', 'Quit'],
            name: 'mainChoice'
        }
        ]).then(function(response) {
            if (response.mainChoice === 'Browse Inventory') {
                salePrompt();
            }
            else if (response.mainChoice === 'Quit') {
                quit();
            }
        });
}

function salePrompt() {
    
    console.log(`\n\nWelcome To Bamazon!\n`);

    listProductsByDepartment('');

    setTimeout(salePromptInquire, 500);
}

function salePromptInquire() {
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
            sellProduct(response.productId, response.quantity);
        })
}

function listProductsByDepartment(departmentName) {
    var table = new AsciiTable();
    table.setHeading('ID', 'Product', 'Department', 'Price', 'Quantity');
    // this is the default 'all' departments
    var thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id`;

    if (departmentName != '') {
        thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id where department_name like '%${departmentName}%'`
    }

    connection.query(thisQuery, (err, result) => {
		console.log(`\n Products On Hand:`);
		result.forEach((product) => {
			table.addRow(product.product_id, product.product_name, product.department_name, '$' + product.product_price, product.product_stock_quantity);
		})
		console.log(`${table.toString()}\n`);
    });
}

function sellProduct(productId, requestedQuantity) {
    var quantityQuery = `SELECT product_id, product_name, product_stock_quantity, product_price FROM products WHERE product_id = ${productId}`
    connection.query(quantityQuery, (err, result) => {
        if (err) throw err;
        var currentQuantity = result[0].product_stock_quantity;
        if (requestedQuantity > currentQuantity) {
            console.log(`Insufficient quantity (${currentQuantity} less then ${requestedQuantity}) to sell - try a lower quantity?`);
            setTimeout(salePrompt, 2500);
        }
        else if (requestedQuantity <= currentQuantity) {
            var remainingQuantity = currentQuantity - requestedQuantity;
            var totalCost = requestedQuantity * result[0].product_price;
            console.log(`Requested quantity available, ${requestedQuantity} will cost $${totalCost}`);
            
            authorizeSale(productId, requestedQuantity, remainingQuantity);
        }
    });
}

// sellProduct(1, 1);

function authorizeSale(productId, requestedQuantity, remainingQuantity) {
    inquirer.prompt([
        {
            type: 'confirm',
            message: 'Proceed with sale?',
            name: 'proceed'
        }
    ]).then(function(response){
        if (response.proceed) {
            addSale(productId, requestedQuantity);
            updateSalesTable(productId, remainingQuantity);
        }
        setTimeout(mainPrompt, 100);
    })
}

function addSale(productId, requestedQuantity) {
    var updateQuantityQuery = `INSERT INTO sale (fk_product_id, sale_quantity) VALUES (${productId}, ${requestedQuantity})`;

    connection.query(updateQuantityQuery, (err, result) => {
        if (err) throw err;
        console.log(`Sale recorded!`);
    });
}

function updateSalesTable(productId, remainingQuantity) {
    var updateSalesQuery = `UPDATE products SET product_stock_quantity = ${remainingQuantity} WHERE product_id = ${productId}`;
    
    connection.query(updateSalesQuery, (err, result) => {
        if (err) throw err;
        console.log(`Sale completed - thank you!`);
    });
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
    connection.end();
}


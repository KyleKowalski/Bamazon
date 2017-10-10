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
    console.log(`\n\nWelcome To The Bamazon Manager Interface!\n`);

    inquirer.prompt([
    {
        type: 'list',
        message: `\nPlease make a selection:\n`,
        name: 'mainSelection',
        choices: ['View Products For Sale', 'View Low Inventory (<5 quantity)', 'Add Inventory', 'Add New Product', 'Quit']
    }
    ]).then(function(response) {
        if (response.mainSelection === 'View Products For Sale') {
            listProductsByDepartment('');
        }
        else if (response.mainSelection === 'View Low Inventory (<5 quantity)') {
            listLowInventory();
        }
        else if (response.mainSelection === 'Add Inventory') {
            addInventoryPrompt();
        }
        else if (response.mainSelection === 'Add New Product') {
            addNewProduct();
        }
        else if (response.mainSelection === 'Quit') {
            quit();
        }
        else {
            console.log(`We've escaped our prompts somehow - record error on manager selection`);
        }
    })
}

function listProductsByDepartment(departmentName) {
    var table = new AsciiTable();
    table.setHeading('ID', 'Product', 'Department', 'Price', 'Quantity');
    // this is the default 'all' departments
    var thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id ORDER BY fk_department_id, product_id`;

    if (departmentName != '') {
        thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id where department_name like '%${departmentName}% ORDER BY fk_department_id, product_id'`
    }

    connection.query(thisQuery, (err, result) => {
		console.log(`\n Products On Hand:`);
		result.forEach((product) => {
			table.addRow(product.product_id, product.product_name, product.department_name, '$' + product.product_price, product.product_stock_quantity);
		})
        console.log(`${table.toString()}\n`);
        mainPrompt();
    });
}

function listLowInventory() {
    var table = new AsciiTable();
    table.setHeading('ID', 'Product', 'Department', 'Price', 'Quantity');

    thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id where product_stock_quantity < 6`

    connection.query(thisQuery, (err, result) => {
		console.log(`\n Products With Low Inventory:`);
		result.forEach((product) => {
			table.addRow(product.product_id, product.product_name, product.department_name, '$' + product.product_price, product.product_stock_quantity);
		})
        console.log(`${table.toString()}\n`);
        mainPrompt();
    });
}

function addInventoryPrompt() { 
    inquirer.prompt([
    {
        type: 'input',
        message: 'Enter the ID of the product to increase quantity of:',
        name: 'productId',
        validate: (value) => !isNaN(value)
    },
    {
        type: 'input',
        message: 'What quantity would you like to order and add to current stock?',
        name: 'quantityToAdd',
        validate: (value) => !isNaN(value)
    }
    ]).then(function(response) {
        addInventory(response.productId, response.quantityToAdd);
    })
}

function addInventory(productId, quantityToAdd) {
    var quantityQuery = `SELECT product_id, product_name, product_stock_quantity, product_price FROM products WHERE product_id = ${productId}`
    connection.query(quantityQuery, (err, result) => {
        if (err) throw err;
        var selectedProduct = result[0].product_name;
        var currentQuantity = result[0].product_stock_quantity;
        // TODO add a prompt to confirm adding?  - maybe - but we'll assume managers are compitent for now.
        var newQuantity = parseInt(currentQuantity) + parseInt(quantityToAdd);

        console.log(`\nAdding more inventory to '${selectedProduct}' - starting quantity: '${currentQuantity}' - ending quantity: '${newQuantity}'`)

        var addQuantityQuery = `UPDATE products SET product_stock_quantity = ${newQuantity} WHERE product_id = ${productId}`
        connection.query(addQuantityQuery, (err, result) => {
        if (err) throw err;
            console.log(`\n\nInventory Updated!\n`);
            mainPrompt();
        });
    });
}

function addNewProduct() { 
    inquirer.prompt([
    {
        type: 'input',
        message: 'Please enter the new product name:',
        name: 'productName',
        validate: (value) => !(value === '')
    },
    {
        type: 'input',
        message: `What department does this product belong to? (Enter '1' for Paint, '2' for Lawn and Garden, or '3' for Tools): `,
        name: 'departmentId',
        validate: (value) => !isNaN(value)
    },
    {
        type: 'input',
        message: 'Enter the price for this product:',
        name: 'productPrice',
        validate: (value) => !isNaN(value)
    },
    {
        type: 'input',
        message: 'Enter the initial stock quantity:',
        name: 'productQuantity',
        validate: (value) => !isNaN(value)
    }
    ]).then(function(response) {
        addProduct(response.productName, response.departmentId, response.productPrice, response.productQuantity);
    })
}

function addProduct(productName, departmentId, productPrice, productQuantity) {
    var insertNewProductQuery = `INSERT INTO products (product_name, fk_department_id, product_price, product_stock_quantity) VALUES ('${productName}', ${departmentId}, ${productPrice}, ${productQuantity})`;
    
    connection.query(insertNewProductQuery, (err, result) => {
        if (err) throw err;
        console.log(`\nProduct Added!\n`);
        mainPrompt();
    });
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
    connection.end();
}
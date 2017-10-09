var mysql = require('mysql');
var AsciiTable = require('ascii-table');
var endUser = require('./endUser.js');
var supervisor = require('./supervisor.js');
var manager = require('./manager.js');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'bamazon_service',
  password : 'password',
  database : 'bamazon_kyle'
});

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
        }
        else if (requestedQuantity <= currentQuantity) {
            var remainingQuantity = currentQuantity - requestedQuantity;
            var totalCost = requestedQuantity * result[0].product_price;
            console.log(`Requested quantity available, ${requestedQuantity} will cost $${totalCost}`);
            
            endUser.authorizeSale(productId, requestedQuantity);
        }
    });
}

// sellProduct(1, 1);

function addSale(productId, requestedQuantity) {
    var updateQuantityQuery = `INSERT INTO sale (fk_product_id, sale_quantity) VALUES (${productId}, ${requestedQuantity})`;

    connection.query(updateQuantityQuery, (err, result) => {
        if (err) throw err;
        console.log(`Sale recorded!`);
        updateSalesTable(productId, requestedQuantity);
    });
}

// addSale(1,1);

function updateSalesTable(productId, remainingQuantity) {
    var updateSalesQuery = `UPDATE products SET product_stock_quantity = ${remainingQuantity} WHERE product_id = ${productId}`;
    
    connection.query(updateSalesQuery, (err, result) => {
        if (err) throw err;
        console.log(`Sale completed - thank you!`);
    });
}

function closeDb() {
    connection.end();
}

function openDb() {
    connection.connect();
}

module.exports = {
    listProductsByDepartment: listProductsByDepartment,
    sellProduct: sellProduct,
    addSale: addSale,
    closeDb: closeDb,
    openDb: openDb
}
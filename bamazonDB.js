var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'bamazon_service',
  password : 'password',
  database : 'bamazon_kyle'
});
 
// connection.connect();
 
function selectTable(tableName) {
    connection.query(`SELECT * FROM ${tableName}`, (err, res) => {
        if (err) throw err;
        console.log(JSON.stringify(res, null, 2));
    });
};

// selectTable('products');
// selectTable('departments');

function listProductsByDepartment(departmentName) {
    connection.connect();
    // this is the default 'all' departments
    var thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id`;

    if (departmentName != '') {
        thisQuery = `select product_id, product_name, department_name, product_price, product_stock_quantity from products inner join departments on department_id = fk_department_id where department_name like '%${departmentName}%'`
    }

    connection.query(thisQuery, (err, res) => {
        if (err) throw err;
        console.log(JSON.stringify(res, null, 2));
    });

    connection.end();
}

listProductsByDepartment('too');

// connection.end();
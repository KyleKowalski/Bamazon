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
    console.log(`\n\nWelcome To The Bamazon Supervisor Interface!\n`);
  
    inquirer.prompt([
    {
        type: 'list',
        message: `\nPlease make a selection:\n`,
        name: 'mainSelection',
        choices: ['View Product Sales By Department', 'Create New Department', 'Quit']
    }
    ]).then(function(response) {
        if (response.mainSelection === 'View Product Sales By Department') {
            listDepartmentRevenue();
        }
        else if (response.mainSelection === 'Create New Department') {
            addDepartmentPrompt();
        }
        else if (response.mainSelection === 'Quit') {
            quit();
        }
        else {
            console.log(`We've escaped our prompts somehow - record error on manager selection`);
        }
    })
}

function listDepartmentRevenue() {
    var table = new AsciiTable();
    table.setHeading('ID', 'Department Name', 'Description', 'Overhead Cost', 'Sales', 'Estimated Profit');

    listDepartmentRevenueQuery = `select department_id, department_name, department_description, department_overhead_cost, sum(sale_quantity * product_price) as unit_sales, (sum(sale_quantity * product_price) - department_overhead_cost) as unit_profit from sale
                                    left join products on product_id = fk_product_id
                                    left join departments on department_id = fk_department_id
                                    group by department_name`

    connection.query(listDepartmentRevenueQuery, (err, result) => {
		result.forEach((department) => {
			table.addRow(department.department_id, department.department_name, department.department_description, '$' + department.department_overhead_cost, '$' + department.unit_sales, '$' + department.unit_profit);
		})
        console.log(`${table.toString()}\n`);
        mainPrompt();
    });
}

function addDepartmentPrompt() { 
    inquirer.prompt([
    {
        type: 'input',
        message: 'Enter the new department name:',
        name: 'departmentName',
        validate: (value) => !(value === '')
    },
    {
        type: 'input',
        message: 'Enter the description for the new department:',
        name: 'departmentDescription',
        validate: (value) => !(value === '')
    },
    {
        type: 'input',
        message: 'What is the overhead cost to get this department setup?',
        name: 'overheadCost',
        validate: (value) => !isNaN(value)
    }
    ]).then(function(response) {
        addDepartment(response.departmentName, response.departmentDescription, response.overheadCost);
    })
}

function addDepartment(departmentName, departmentDescription, overheadCost) {
    var addDepartmentQuery = `INSERT INTO departments (department_name, department_description, department_overhead_cost) VALUES ('${departmentName}', '${departmentDescription}', ${overheadCost})`

    connection.query(addDepartmentQuery, (err, result) => {
    if (err) throw err;
        console.log(`\n\nDepartment Added!\n`);
        mainPrompt();
    });
}

function quit() {
    console.log("\n=====\nHave a great day!\n\nGood Bye!\n=====");
    connection.end();
}
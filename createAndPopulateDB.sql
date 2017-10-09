-- DROP DATABASE IF EXISTS bamazon_kyle;
-- CREATE database bamazon_kyle;

USE bamazon_kyle;

CREATE TABLE products (
	product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    fk_department_id INT NULL,
    product_price FLOAT(12,2) NULL,
    product_stock_quantity INT NULL,
    product_active BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id)
);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(50) NOT NULL,
    department_description VARCHAR(250) NULL,
    department_overhead_cost INT NULL,
	PRIMARY KEY (department_id)
);

CREATE TABLE product_sales (
	sale_id INT NOT NULL AUTO_INCREMENT,
    fk_product_id INT NOT NULL,
    sale_quantity INT NOT NULL,
    PRIMARY KEY (sale_id)
);


INSERT INTO departments (department_id, department_name, department_description, department_overhead_cost) VALUES 
(1, "paint", "all things paint related", 1000),
(2, "lawn and garden", "outdoor items", 1500),
(3, "tools", "tools... and... tools?", 2000),
(4, "adminstration", "adminstrative work", 5000)

INSERT INTO products (product_name, fk_department_id, product_price, product_stock_quantity) VALUES
("Orange 1 Gallon", 1, 10.00, 50),
("Blue 1 Gallon", 1, 10.00, 50),
("Rainbow 1 Gallon", 1, 13.00, 45),
("Gas Lawnmower", 2, 100.00, 5),
("Electric Lawnmower", 2, 150.00, 3),
("Weed Wacker", 2, 50.00, 10),
("Digging Gloves", 2, 15.00, 20),
("Screw Driver Set", 3, 30.00, 30),
("Wrench Set", 3, 20.00, 40),
("Drills", 3, 44.99, 20);


select * from departments;

select * from products;

select product_id, product_name, department_name, product_price, product_stock_quantity
from products
inner join departments on department_id = fk_department_id;


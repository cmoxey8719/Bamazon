DROP DATABASE IF EXISTS bamazon_DB;
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE store_stock (
	item_id INT (50),
    product_name VARCHAR(50),
    department_name VARCHAR (50),
    price DECIMAL(10, 2),
    stock INT (3), 
    PRIMARY KEY(item_id)
);store_stock
    
    SELECT * FROM store_stock;
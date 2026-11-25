--creating products table
create table products(
id serial primary key,
name varchar(100)not null,
price integer,
stock_quantity integer default 0
)

--inserting one product
insert into products(name, price, stock_quantity)
values('Wireless Mouse', 35000, 50);

--inserting two products
insert into products(name, price, stock_quantity)
values('Mechanical Keyboard', 120000, 20),
('HDMI Cable', 8000, 100);

--retrieving all data from products table
select*from products
--retrieving only name and price column
select name, price from products;
--retrieving orders where quantity is greater than 3
select*from orders
where quantity_ordered>3;

--updating wireless mouse's price 
update products
set price=38000
where id=1;

--updating mechanical keyboard quantity to 35
update products
set stock_quantity=35
where id=2;

--deleting HDMI Cable from products
delete from products
where id=3;

--inserting negative values

insert into products(name, price, stock_quantity)
values('Guitar', -5000, 20);

--The postgreSQL accepts minus values since we didn't define CHECK constraint for the price

add constraint check_positive_price
CHECK (price>=0);

--inserting order without providing product_id
insert into orders(quantity_ordered)
values(2);
--PostgreSQL rejects this query since product_id has a NOT NULL constraint
--NOT NULL constraint makes sure every order must have product ID
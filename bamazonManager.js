var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var figlet = require('figlet');

figlet('Manager View', function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  console.log(data)
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  menuOptions();
});

function menuOptions() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Products for Sale":
          displayProducts();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;
      }
    });
}

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("");
    console.table(res);
    menuOptions();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;
    if (res == 0) {
      console.log("");
      console.log("There are no items that have less than 5 in stock.");
      console.log("");
      menuOptions();
    } else {
      console.log("");
      console.table(res);
      console.log("");
      menuOptions();
    }
  });
}

function addInventory(results) {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.log("");
    console.table(results);
    inquirer
      .prompt([
        {
          name: "addMoreId",
          type: "input",
          message: "What is the ID of the item you would like to add more of?",
        },
        {
          name: "howMuch",
          type: "input",
          message: "How many units of the item would you like to add?",
        }
      ])
      .then(function (answer) {
        var chosen;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id == parseInt(answer.addMoreId)) {
            chosen = results[i];
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: chosen.stock_quantity + parseInt(answer.howMuch)
                },
                {
                  item_id: answer.addMoreId
                }
              ],
              function (err) {
                if (err) throw err;
                console.log("");
                console.log("You have added " + answer.howMuch + " units of the product " + chosen.product_name + ".");
                displayProducts();
              }
            );
          }
        }
      });
  });
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message: "What is the name of the item you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department will this item be located in?"
      },
      {
        name: "price",
        type: "input",
        message: "What would you like the price of the item to be?",
      },
      {
        name: "stock",
        type: "input",
        message: "How many items do you want to add to have in stock?",
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.productName,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.stock,
          product_sales: 0
        },
        function (err) {
          if (err) throw err;
          console.log("");
          console.log("The product " + answer.productName + " has been added successfully.");
          displayProducts();
        }
      );
    });
}

// Manager Problems:
// (Add New Product)
// Product sales are suppose to be 0 when an item is added. 
// Item_id is now jumping numbers and not going in order even after I deleted rows. 

// Supervisor Problems:
// (View Departments)
// For departments I have data repeating. 


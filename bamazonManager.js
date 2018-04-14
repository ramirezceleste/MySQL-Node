var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var figlet = require('figlet');

figlet('Manager View', function(err, data) {
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

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  menuOptions();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("");
    console.table(res);
  });
}


/* List a set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.*/

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
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
        displayProducts();
          break;
  
        case "View Low Inventory":
          
          break;
  
        case "Add to Inventory":
          
          break;
  
        case "Add New Product":
          
          break;
        }
      });
  }
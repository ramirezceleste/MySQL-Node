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
        message: "How much much of the item would you like to add?",
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
              // re-prompt the user for if they want to bid or post
              displayProducts();
            }
          );
        }
      }
    });
  });
}


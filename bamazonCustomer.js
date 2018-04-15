var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var figlet = require('figlet');

figlet('Customer View', function (err, data) {
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
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("");
    console.table(res);
    questions();
  });
}

function questions(results) {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "idChoice",
          type: "input",
          message: "What is the ID of the item you would like to buy?"
        },
        {
          name: "units",
          type: "input",
          message: "How many units would you like to buy?"
        }
      ])
      .then(function (answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          // console.log(typeof answer.idChoice);
          if (results[i].item_id == parseInt(answer.idChoice)) {
            chosenItem = results[i];
            if (chosenItem.stock_quantity >= parseInt(answer.units)) {
              connection.query(
                "UPDATE products SET ? , ? WHERE ?",
                [
                  {
                    stock_quantity: chosenItem.stock_quantity - answer.units
                  },
                  {
                    product_sales: chosenItem.product_sales + (answer.units * chosenItem.price)
                  },
                  {
                    item_id: chosenItem.item_id
                  }
                ],
                function (error) {
                  if (error) throw err;
                  console.log("");
                  console.log("Purchase complete!");
                  console.log("");
                  console.log("The total cost of your purchase was $" + answer.units * chosenItem.price + " dollars.");
                  displayProducts();
                }
              );
            } else {
              console.log("");
              console.log("Insufficient quantity! Please try again.");
              displayProducts();
            }
          }
        }
      });
  });
}

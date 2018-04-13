var mysql = require("mysql");
var inquirer = require("inquirer");
const { table } = require('table');

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
    displayProducts();
    connection.end();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res[0].item_id);
        let config,
            data,
            output;

        data = [
            
        ];

        

        output = table(data);

        console.log(output);

        console.log(res);
        // bidAuction();
    });
}

/* The app should then prompt users with two messages.

The first should ask them the ID of the product they would like to buy.
The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

However, if your store does have enough of the product, you should fulfill the customer's order.

This means updating the SQL database to reflect the remaining quantity.
Once the update goes through, show the customer the total cost of their purchase. */

function questions() {
    connection.query("SELECT * FROM products", function(err, results) {
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
        .then(function(answer) {
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].item_id === answer.idChoice) {
              chosenItem = results[i];
            }
          }

          // determine if bid was high enough
          if (chosenItem.stock_quantity < parseInt(answer.units)) {
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: stock_quantity - answer.units
                },
                {
                  item_id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Everything worked successfully!");
                displayProducts();
              }
            );
          }
          else {
            // bid wasn't high enough, so apologize and start over
            console.log("Insufficient quantity!");
            displayProducts();
          }
        });
    });
  }

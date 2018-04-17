var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var figlet = require('figlet');
var colors = require('colors');
 
colors.setTheme({
  success: 'green',
  error: 'red',
  general: 'blue'
});

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
  database: "bamazon_db"
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
      console.log(colors.general("There are no items that have less than 5 in stock."));
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
                console.log(colors.success("You have added " + answer.howMuch + " units of the product " + chosen.product_name + "."));
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
          stock_quantity: answer.stock
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


// DIDN'T CHECK CORRECTLY MY DATA CAME BACK AS 0 EACH TIME SO IT KEPT TELLING ME I COULDN'T ADD A PRODUCT EVEN IF IT WAS AN EXISITING DEPARTMENT. 
// Tried a few different things but it never worked how it was suppose too. 

// function addNewProduct() {
//   inquirer
//     .prompt([
//       {
//         name: "productName",
//         type: "input",
//         message: "What is the name of the item you would like to add?"
//       },
//       {
//         name: "department",
//         type: "input",
//         message: "What department will this item be located in?"
//       },
//       {
//         name: "price",
//         type: "input",
//         message: "What would you like the price of the item to be?",
//       },
//       {
//         name: "stock",
//         type: "input",
//         message: "How many items do you want to add to have in stock?",
//       }
//     ])
//     .then(function (answer) {
//       connection.query(
//       "SELECT * FROM departments WHERE department_name = ?",
//       {
//         department_name: answer.department
//       },
//       function(err, data) {
//         console.log(typeof(data.length));
//         if (err) throw err;
//         if (data.length === 0) {
//           console.log("");
//           console.log(colors.error("Sorry that department doesn't exist! Only a Supervisor can add new departments. Please try again by adding new products to existing departments."));
//           displayProducts();
//         } else {
//           connection.query(
//             "INSERT INTO products SET ?",
//             {
//               product_name: answer.productName,
//               department_name: answer.department,
//               price: answer.price,
//               stock_quantity: answer.stock
//             },
//             function (err) {
//               if (err) throw err;
//               console.log("");
//               console.log(colors.success("The product " + answer.productName + " has been added successfully."));
//               displayProducts();
//             }
//           );
//         }
      
//       }
//       );
     
//     });
// }


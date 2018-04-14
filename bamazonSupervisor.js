var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var figlet = require('figlet');

figlet('Supervisor View', function (err, data) {
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
        "View Product Sales by Department",
        "Create New Department"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
         
          break;

        case "Create New Department":
         
          break;
      }
    });
}
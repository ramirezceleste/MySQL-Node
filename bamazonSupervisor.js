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
        "View Product Sales by Department",
        "Create New Department"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View Product Sales by Department":
         viewProducts();
          break;

        case "Create New Department":
         createDepartment();
          break;
      }
    });
}

function viewProducts() {
  connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales, sum(departments.over_head_costs - products.product_sales) AS total_profits FROM departments AS departments INNER JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name) AS products ON departments.department_name = products.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales ORDER BY departments.department_id", function (err, res) {
      if (err) throw err 
      console.log("");
      console.table(res);
      console.log("");
      menuOptions();
  });
}

function createDepartment() {
  inquirer
  .prompt([
    {
      name: "departmentName",
      type: "input",
      message: "What is the name of the department you would like to add?"
    },
    {
      name: "overHeadCosts",
      type: "input",
      message: "Enter over head costs."
    }
  ])
  .then(function (answer) {
    connection.query(
      "INSERT INTO departments SET ?",
      {
        department_name: answer.departmentName,
        over_head_costs: answer.overHeadCosts
      },
      function (err) {
        if (err) throw err;
        console.log("");
        console.log(colors.success("The department " + answer.departmentName + " has been added successfully."));
        console.log("");
        displayDepartments();
      }
    );
  });
}

function displayDepartments() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    console.log("");
    console.table(res);
    console.log("");
    menuOptions();
  });
}
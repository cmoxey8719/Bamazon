// all the required packages for node
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

// global varable for table values to use between functions
var itemTobuy = [];



var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "admin87",
  database: "bamazon_DB"
});

//shows table of store inventory then runs the intial function
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected");
});

tableDisplay();

//the function that chooses between options for the user
function customerPurchase() {
	inquirer
	.prompt({
	  name: "action",
	  type: "list",
	  message: "What would you like to do?",
	  choices: [
	    "Purchase an item",
	    "Change quantity of item",
	    "Quit"
	  ]
	})
	.then(function(answer) {
	  switch (answer.action) {
	  	//runs function to select item to purchase
	    case "Purchase an item":
	    	itemPurchase();
	      	break;
	    //runs the function to change the qunatities of the item purchased 
	    case "Change quantity of item":
	      	quantPurchase();
	      	break;

	    case "Quit":
	    	//ends the process/app/functions
	    	process.exit(1);
	      	break;
		}
	});
}

//asks user for which item they want to purchase, locating item by the item_id
function itemPurchase() {
 	inquirer.prompt(
	  	{
	      name: "item",
	      type: "input",
	      message: "What item would you like to purchase?"
	    })
	    .then(function(answer) {
	    	var itemId = answer.item - 1;
			var query = "SELECT item_id, product_name, price, stock FROM store_stock WHERE item_id ";
			connection.query(query, { item_id: answer.item}, function(err, res) {
				var info = res[itemId];
				console.log("-----------------------------------------------------------------");
	        	console.log("You have choosen: " + info.product_name + " price: " + info.price + " stock: " + info.stock);
	        	console.log("-----------------------------------------------------------------");
	        	itemTobuy = info;
	        	console.table(res);
	        	customerPurchase();
	    	});
	    });
}

function tableDisplay(){
	var sql = "SELECT * FROM store_stock" ; 
	connection.query(sql, function (err, result) {
		if (err) throw err;
		console.table(result);
		customerPurchase();
  	});
}

// the user selects how many of an item they want to purchase
function quantPurchase() {
	inquirer.prompt(
  	{
      name: "item",
      type: "input",
      message: "How many of the item would you like to purchase?"
    })
    .then(function(answer) {
    	var want = answer.item;
    	var has = itemTobuy.stock;
    	var total = has - want;

		if(total >= 0){
    		var query = "UPDATE store_stock SET ? WHERE ?";
    		connection.query(query, [{stock: total}, {item_id: itemTobuy.item_id}],
    		function(err, res) {
    			console.log("-----------------------------------------------------------------");
	        	console.log("Thank you for purchasing " + want + itemTobuy.product_name + "!");
	        	console.log("-----------------------------------------------------------------");
    			tableDisplay();
    		});	
    	}
    	else{
    		console.log("-----------------------------------------------------------------");
    		console.log("Sorry. That is not an acceptable selection. Please select again");
    		console.log("-----------------------------------------------------------------");
    		customerPurchase();
    	}
	});
}




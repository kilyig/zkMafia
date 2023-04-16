// =============================================================================
//                                  Config
// =============================================================================
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

// Constant we use later
var GENESIS = '0x0000000000000000000000000000000000000000000000000000000000000000';

// This is the ABI for your contract (get it from Remix, in the 'Compile' tab)
// ============================================================
var abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "amount",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "cycleAmount",
          "type": "uint32"
        },
        {
          "internalType": "address[11]",
          "name": "cycle",
          "type": "address[11]"
        }
      ],
      "name": "add_IOU",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "debts",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "debtor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "creditor",
          "type": "address"
        }
      ],
      "name": "lookup",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "ret",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]; // FIXME: fill this in with your contract's ABI //Be sure to only have one array, not two
// ============================================================
abiDecoder.addABI(abi);
// call abiDecoder.decodeMethod to use this - see 'getAllFunctionCalls' for more

var contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // FIXME: fill this in with your contract's address/hash

var BlockchainSplitwise = new ethers.Contract(contractAddress, abi, provider.getSigner());

// =============================================================================
//                            Functions To Implement
// =============================================================================

// TODO: Add any helper functions here!
async function simulate() {
	var allCalls = await getAllFunctionCalls(contractAddress, "add_IOU");
	allCalls.reverse();
	var users = await getUsers();
	var debts = {};

	// initialize dictionary
	for (const user of users) {
		debts[user.toLowerCase()]={};
		for (const other of users) {
			debts[user.toString().toLowerCase()][other.toString().toLowerCase()] = 0;
		}
	}

	for (const obj of allCalls){
		//.log("Cycle scanning %s", obj.from);
		// update mapping
		//console.log(debts);
		debts[(obj.from).toLowerCase()][obj.args[0].toString().toLowerCase()] = parseInt((debts[(obj.from).toLowerCase()][obj.args[0].toString().toLowerCase()] || 0) + parseInt(obj.args[1]));
		//console.log(debts);
		const cycleAmount = parseInt(obj.args[2]);
		//console.log(cycleAmount);
		const cycle =obj.args[3]; 
		//console.log(cycle);
		var valid = true;
		var i;
		//console.log(debts[cycle[0]][cycle[1]]);
		//console.log(debts[cycle[1]][cycle[0]]);
		for (i = 0; i < cycle.length - 1; i++) { // A B C A

			// Stop the loop if the next index of cycle is zero
			if (cycle[i+1] == ethers.constants.AddressZero) {
				//console.log("fail here?");
                break;
            }

			// Check if debt is enough
            if (debts[cycle[i]][cycle[i+1]] < cycleAmount) {
                valid = false;
                break;
            }

			//console.log("index: %s, addr: %s -> addr: %s is ok",i, cycle[i],cycle[i+1]);
		}

		//console.log(valid);

		// if valid cycle, need to remove it
        if (valid) {
			var j;
            for (j = 0; j < i; j++) {
                debts[cycle[j]][cycle[j+1]] = debts[cycle[j]][cycle[j+1]] - cycleAmount;
				console.log("index: %s, addr: %s -> addr: %s was removed",j, cycle[j],cycle[j+1]);
            } 
        }
		else if (i != 1) {
			console.log("FAILED: blockchain cycle not valid from client POV");
		}
	}

	return debts;
}

async function getNeighbors(user, debts) {
	var debtor = user.toString().toLowerCase();
	var neighbors = [];
	console.log("in neighbors");
	if (debts[debtor]) {
		for (creditor of Object.keys(debts[debtor])) {
			if (debts[debtor][creditor] > 0) {
				neighbors.push(creditor.toString().toLowerCase());
			}
		}
	}		
	return neighbors;
}

// TODO: Return a list of all users (creditors or debtors) in the system
// All users in the system are everyone who has ever sent or received an IOU
async function getUsers() {
	var users = new Set();
	var allCalls = await getAllFunctionCalls(contractAddress,"add_IOU");
	for (var i = 0; i < allCalls.length; i++) {
		users.add(allCalls[i].from.toString().toLowerCase());
		users.add(allCalls[i].args[0].toString().toLowerCase());
	}
	var unique = Array.from(users);
	return unique;
}

// TODO: Get the total amount owed by the user specified by 'user'
async function getTotalOwed(debtor) {
	var user = debtor.toString().toLowerCase();
	var debts = await simulate();
	// console.log(user);
	// console.log(debts);
	// console.log(Object.keys(debts));
	// console.log(debts[user]);
	//console.log(debts["0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"]);
	var total = 0;
	if (!debts[user]) {
		//console.log("not here plz");
		return total;
	}
	for (creditor of Object.keys(debts[user])) {
		//console.log("here plz");
		total = total + parseInt(debts[user][creditor.toString().toLowerCase()] || 0);
	}
	return total;
}

// TODO: Get the last time this user has sent or received an IOU, in seconds since Jan. 1, 1970
// Return null if you can't find any activity for the user.
// HINT: Try looking at the way 'getAllFunctionCalls' is written. You can modify it if you'd like.
async function getLastActive(user) {
	user.toString();
	user = user.toLowerCase();
	console.log(user);
	var allCalls = await getAllFunctionCalls(contractAddress,"add_IOU");
	for (var i = 0; i < allCalls.length; i++) {
		if (allCalls[i].from.toString().toLowerCase() == user || allCalls[i].args[0].toString().toLowerCase() == user) {
			return allCalls[i].t;
		}
	}
	return null;
}

// TODO: add an IOU ('I owe you') to the system
// The person you owe money is passed as 'creditor'
// The amount you owe them is passed as 'amount'
async function add_IOU(creditor, amount) {

	var debts = await simulate();
	cycle = await doBFS(creditor.toString().toLowerCase(),defaultAccount.toString().toLowerCase(),getNeighbors);
	console.log(cycle);
	
	if (cycle) {
		if (cycle.length <= 10) {
			console.log("we have a cycle");
			console.log(cycle);
			
			// TODO: we also need to calculate the minimum value along the cycle
			var min = amount;
			for (var i = 0; i < cycle.length - 1; i++) {
				console.log(cycle[i]);
				var cur = debts[cycle[i]][cycle[i+1]];
				console.log(cur);
				if (cur < min) {
					min = cur;
				}
			}
			console.log(min);
	
			// TODO: Package cycle as A,B,C,A
			var packagedCycle = ([defaultAccount.toString().toLowerCase()]).concat(cycle);
			//packagedCycle.push(defaultAccount);
			for (var j = 0; j < 10-cycle.length; j++) {
				packagedCycle.push(ethers.constants.AddressZero);
			}
	
			console.log("[Cycle] Client side: sending %s from %s to %s, with cycle %s", amount, defaultAccount.toString().toLowerCase(), creditor.toString().toLowerCase(), packagedCycle);
			return BlockchainSplitwise.connect(provider.getSigner(defaultAccount)).add_IOU(creditor.toString().toLowerCase(), amount, min, packagedCycle);	
		// 	
		}
	}




	console.log("Client side: sending %s from %s to %s", amount, defaultAccount, creditor);
	return BlockchainSplitwise.connect(provider.getSigner(defaultAccount)).add_IOU(creditor.toString().toLowerCase(), amount, 0, [defaultAccount.toString().toLowerCase(),defaultAccount.toString().toLowerCase(), ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero, ethers.constants.AddressZero]);	
}

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

// This searches the block history for all calls to 'functionName' (string) on the 'addressOfContract' (string) contract
// It returns an array of objects, one for each call, containing the sender ('from'), arguments ('args'), and the timestamp ('t')
async function getAllFunctionCalls(addressOfContract, functionName) {
	var curBlock = await provider.getBlockNumber();
	var function_calls = [];

	while (curBlock !== GENESIS) {
	  var b = await provider.getBlockWithTransactions(curBlock);
	  var txns = b.transactions;
	  for (var j = 0; j < txns.length; j++) {
	  	var txn = txns[j];

	  	// check that destination of txn is our contract
			if(txn.to == null){continue;}
	  	if (txn.to.toLowerCase() === addressOfContract.toLowerCase()) {
	  		var func_call = abiDecoder.decodeMethod(txn.data);

				// check that the function getting called in this txn is 'functionName'
				if (func_call && func_call.name === functionName) {
					var timeBlock = await provider.getBlock(curBlock);
		  		var args = func_call.params.map(function (x) {return x.value});
	  			function_calls.push({
	  				from: txn.from.toLowerCase(),
	  				args: args,
						t: timeBlock.timestamp
	  			})
	  		}
	  	}
	  }
	  curBlock = b.parentHash;
	}
	return function_calls;
}

// We've provided a breadth-first search implementation for you, if that's useful
// It will find a path from start to end (or return null if none exists)
// You just need to pass in a function ('getNeighbors') that takes a node (string) and returns its neighbors (as an array)
async function doBFS(start, end, getNeighbors) {
	var queue = [[start]];
	var debts = await simulate();
	while (queue.length > 0) {
		var cur = queue.shift();
		var lastNode = cur[cur.length-1]
		if (lastNode.toLowerCase() === end.toString().toLowerCase()) {
			return cur;
		} else {
			var neighbors = await getNeighbors(lastNode,debts);
			for (var i = 0; i < neighbors.length; i++) {
				queue.push(cur.concat([neighbors[i]]));
			}
		}
	}
	return null;
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response)=> {
	defaultAccount = response[0];

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	});

	getLastActive(defaultAccount).then((response)=>{
		time = timeConverter(response)
		$("#last_active").html(time)
	});
});

// This code updates the 'My Account' UI with the results of your functions
$("#myaccount").change(function() {
	defaultAccount = $(this).val();

	getTotalOwed(defaultAccount).then((response)=>{
		$("#total_owed").html("$"+response);
	})

	getLastActive(defaultAccount).then((response)=>{
		time = timeConverter(response)
		$("#last_active").html(time)
	});
});

// Allows switching between accounts in 'My Account' and the 'fast-copy' in 'Address of person you owe
provider.listAccounts().then((response)=>{
	var opts = response.map(function (a) { return '<option value="'+
			a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
	$(".account").html(opts);
	$(".wallet_addresses").html(response.map(function (a) { return '<li>'+a.toLowerCase()+'</li>' }));
});

// This code updates the 'Users' list in the UI with the results of your function
getUsers().then((response)=>{
	$("#all_users").html(response.map(function (u,i) { return "<li>"+u+"</li>" }));
});

// This runs the 'add_IOU' function when you click the button
// It passes the values from the two inputs above
$("#addiou").click(function() {
	defaultAccount = $("#myaccount").val(); //sets the default account
  add_IOU($("#creditor").val(), $("#amount").val()).then((response)=>{
		window.location.reload(false); // refreshes the page after add_IOU returns and the promise is unwrapped
	})
});

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
	$("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

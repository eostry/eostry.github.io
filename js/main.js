var g_curwalletname = '';
var g_curtable = '';
var g_curaction = '';
var g_eos = '';
var g_abidata = '';
var eosjs = '';
var eos = null;
var scatter = null;
var loginflag = 0;
var sellersel = '';
var sellerprice = '';
var curcointype = '';
var network = {
	blockchain: 'eos',
	protocol: 'https',
	host: 'mainnet.eoscannon.io',
	port: 443,
	chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};

function EosjsInit() {
	var eosConfig = {
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
		httpEndpoint: 'https://mainnet.eoscannon.io',
		verbose: true
	}

	eosjs = Eos(eosConfig);
}

$(function () {
	
	EosjsInit();
	document.addEventListener('scatterLoaded', function (scatterExtension) {
		console.log("scatterLoaded enter");
		scatter = window.scatter;
		eos = scatter.eos(network, Eos, {}, "https");
	});

	setInterval(ask1, 1000);
	setInterval(ask2, 1000);
	setInterval(ask3, 1000);

	
})



function ask1()
{
		var contract = 'okkkkkkkkkkk';
		var scope = 'developstdio';
		var table = 'accounts';
		var lower = 'OCT';

		g_eos.getTableRows(true, contract, scope, table, "",lower ,-1, 1, function (error, data) {
			if (error == null) {
				
				document.getElementById("inp1").value=(((data["rows"][0]["balance"]).split(" ")[0])+' '+lower);
			} else {

				//document.getElementById("inp1").value=error;
				console.log(error);
			}
		})

}

function ask2()
{
		var contract = 'okkkkkkkkkkk';
		var scope = 'developstdio';
		var table = 'accounts';
		var lower = 'MOYU';

		g_eos.getTableRows(true, contract, scope, table, "",lower ,-1, 1, function (error, data) {
			if (error == null) {
				
				document.getElementById("inp2").value=((data["rows"][0]["balance"]).split(" ")[0]+' '+lower);
			} else {

				//document.getElementById("inp2").value=error;
				console.log(error);
			}
		})

}


function ask3()
{
	if (loginflag != 0) {
		var contract = 'okkkkkkkkkkk';
		var table = 'accounts';
		var lower = 'EPRA';
		scatter.getIdentity({
				accounts: [network]
			}).then(function (identity) {
				var account = identity.accounts[0];
				var options = {
					authorization: account.name + '@' + account.authority,
					broadcast: true,
					sign: true
				};
				var scope = account.name;

				
			g_eos.getTableRows(true, contract, scope, table, "",lower ,-1, 1, function (error, data) {
					if (error == null) {
						//$("#inp3").html(JSON.stringify(data, null, 2));
						document.getElementById("inp3").value=(((data["rows"][0]["balance"]).split(" ")[0])+' '+lower);
					} else {
						//$("#inp3").html(error);
						console.log(error);
					}
				})
			})
		}
		else
		{
			document.getElementById("inp3").value=('请先点击左上角登录');
		}


}

function scatterLogin() {
	if (!scatter) {
		Dialog.init("Please install Scatter!");
		return;


	}

	scatter.getIdentity({
		accounts: [network]
	}).then(function (identity) {
		var account = identity.accounts[0];
		loginflag = 1;
		console.log(account.name + " 已登录");
		//Dialog.init(account.name + " 已登录");
		//getaccountinfo(account.name);
		$("#loginbtn").attr("disabled", true);
		$("#loginbtn").html(account.name).css('color', '#1E90FF');
		ask3();

	}).catch(function (e) {
		console.log(e);
	});

}











function transfersell1() {
	try {

		              scatter.getIdentity({
                        accounts: [network]
                    }).then(function(identity) {
                        var account = identity.accounts[0];
                        var options = {
                            authorization: account.name + '@' + account.authority,
                            broadcast: true,
                            sign: true
                        };
                        var memo = 'sell1';
                        eos.transfer(account.name, 'eosiocompute', '0.0001 EOS', memo, options).then(function(tx) {
                            Dialog.init("Success!");
                        }).catch(function(e) {
                            e = JSON.parse(e);
                            Dialog.init('Tx failed: ' + e.error.details[0].message);
                        })
                    })
		
	} catch (e) {
		Dialog.init(e);
	}
}



function transfersell() {
	try {
		
		var sellasset = $("#sellasset").val();
		if (tp.isConnected() == true) {
			tp.eosTokenTransfer({
				from: $("#loginbtn").html(),
				to: 'eosiocompute',
				amount: $("#sellasset").val(),
				tokenName: "MOYU",
				precision: 4,
				contract: 'okkkkkkkkkkk',
				memo: 'sell',
			}).then(function (data) {
				//Dialog.init('Success!');
				//sellcoinchange();
			}).catch(function (err) {
				Dialog.init(JSON.stringify(err));
			});
		} else {
			scatter.getIdentity({
				accounts: [network]
			}).then(function (identity) {
				var account = identity.accounts[0];
				var options = {
					authorization: account.name + '@' + account.authority,
					broadcast: true,
					sign: true
				};

				eos.contract("okkkkkkkkkkk", options).then(contract => {
					contract.transfer(account.name, 'eosiocompute', $("#sellasset").val() + ' MOYU', 'sell', options).then(function (tx) {
						//Dialog.init('Success!');
						alert("Success!"); 
						//sellcoinchange();
						//getaccountinfo(account.name);
					}).catch(function (e) {
						console.log(e);
						e = JSON.parse(e);
						//Dialog.init('Tx failed: ' + e.error.details[0].message);
						alert('Tx failed: ' + e.error.details[0].message); 
					});
				});

			})
		}
	} catch (e) {
		Dialog.init(e);
	}
}

function transferbuy() {
	try {
		var buyasset = $("#buyasset").val();

		if (tp.isConnected() == true) {
			tp.eosTokenTransfer({
				from: $("#loginbtn").html(),
				to: 'eosiocompute',
				amount: $("#buyasset").val(),
				tokenName: 'EOS',
				precision: 4,
				contract: 'eosio.token',
				memo: 'buy',
			}).then(function (data) {
				//Dialog.init('Success!');
				//sellcoinchange();
			}).catch(function (err) {
				Dialog.init(JSON.stringify(err));
			});
		} else {
			scatter.getIdentity({
				accounts: [network]
			}).then(function (identity) {
				var account = identity.accounts[0];
				var options = {
					authorization: account.name + '@' + account.authority,
					broadcast: true,
					sign: true
				};

				eos.contract("eosio.token", options).then(contract => {
					contract.transfer(account.name, 'eosiocompute', $("#buyasset").val() + ' EOS', 'buy', options).then(function (tx) {
						Dialog.init('Success!');
						//alert("Success!"); 
						//sellcoinchange();
						//getaccountinfo(account.name);
					}).catch(function (e) {
						console.log(e);
						e = JSON.parse(e);
						Dialog.init('Tx failed: ' + e.error.details[0].message);
						//alert('Tx failed: ' + e.error.details[0].message); 
					});
				});

			})
		}
	} catch (e) {
		Dialog.init(e);
	}
}

function sell() {
if (loginflag == 0) {
		alert("请先点击左上角登录2");  
	}
	transfersell1();
}

function buy() {
if (loginflag == 0) {
		 alert("请先点击左上角登录");  
	}
	transferbuy();
}


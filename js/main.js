var g_curwalletname = '';
var g_curtable = '';
var g_curaction = '';
var g_eos = '';
var g_abidata = '';

$(function () {
	
	var $httpendpointid = $("#httpendpointid");
	$httpendpointid.val("https://mainnet.eoscannon.io");

	EosjsInit();
	

	if (tp.isConnected() == true) {
		tp.getWalletList('eos').then(data => {
			var accountcnt = data["wallets"]["eos"].length;
			var $accountlistid = $("#accountlistid");
			$accountlistid.empty();
			for (var i = 0; i <= accountcnt; i++) {
				var accountname = data["wallets"]["eos"][i]["name"];
				$accountlistid.append(new Option(accountname, accountname));
				if (i == 0) {
					g_curwalletname = accountname;
				}
			}
		})
	} else {
		console.log("tp is not connected!");
	}
	
})


function WalletChange(obj) {
	g_curwalletname = $(obj).val();
}

function HttpEndPointChange(obj) {
	EosjsInit();
}

function OperateShow(type) {
	if (type == 0) {
		$("#tableid").hide();
		$("#actionid").show();
	} else if (type == 1) {
		$("#tableid").show();
		$("#actionid").hide();
	}
}

function OperateChange(obj) {
	var type = $(obj).val();
	OperateShow(type);
}

function OperateSubmit() {
	var contract = $("#contractid").val();
	var type = $("#operatetypeid").val();
	if (type == 0) {
		try {
			var curaccount = g_curwalletname;
			var action = $("#actionlistid").val();
			var paramdata = '';
			$("#actionparamlistid").find(".row").each(function () {
				paramname = $(this).find("label").html();
				paramval = $(this).find("input").val();
				paramdata += '"' + paramname + '":"' + paramval + '",';
			});
			paramdata = paramdata.substring(0, paramdata.length - 1)

			var actionstr = '{"actions":[{"account":"' + contract + '","name":"' + action + '","authorization":[{"actor":"' + curaccount + '","permission":"active"}],"data":{' + paramdata + '}}]}';
			console.log("actionstr is " + actionstr);
			var params = JSON.parse(actionstr);
			tp.pushEosAction(params).then(data => {
				var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
				$('#logid').html(result);
			}).catch(function (err) {
				$("#logid").html(err);
			});
		} catch (e) {
			$("#logid").html(e);
			console.log(e);
		}
	} else if (type == 1) {
		var scope = $("#scopeid").val();
		var table = $("#tablelistid").val();
		g_eos.getTableRows(true, contract, scope, table, function (error, data) {
			if (error == null) {
				$("#logid").html(JSON.stringify(data, null, 2));
			} else {
				$("#logid").html(error);
				console.log(error);
			}
		})
	}
}


function ask()
{
		var contract = 'eosnamedapp1';
		var scope = 'eosnamedapp1';
		var table = 'accountstat';

		g_eos.getTableRows(true, contract, scope, table, function (error, data) {
			if (error == null) {
				$("#logid1").html(JSON.stringify(data, null, 2));
			} else {
				$("#logid1").html(error);
				console.log(error);
			}
		})

}

function ask1()
{
		var contract = 'okkkkkkkkkkk';
		var scope = 'developstdio';
		var table = 'accounts';
		var lower = 'EPRA';

		g_eos.getTableRows(true, contract, scope, table, "",0 ,-1, 1, function (error, data) {
			if (error == null) {
				$("#logid").html(JSON.stringify(data, null, 2));
			} else {
				$("#logid").html(error);
				console.log(error);
			}
		})

}

function ask2()
{
		var contract = 'okkkkkkkkkkk';
		var scope = 'developstdio';
		var table = 'accounts';
		var lower = 'EPRA';

		g_eos.getTableRows(true, contract, scope, table, "",lower ,-1, 1, function (error, data) {
			if (error == null) {
				$("#logid").html(JSON.stringify(data, null, 2));
			} else {
				$("#logid").html(error);
				console.log(error);
			}
		})

}

function pusheosshishicaiaddlink() {
	if (tp.isConnected() == true) {
		try {
			var curaccount = g_curwalletname;
			var upplayer = $("#upplayer").val();
			var actionstr = '{"actions":[{"account":"eosshishicai","name":"addlink","authorization":[{"actor":"' + curaccount + '","permission":"active"}],"data":{"player":"' + curaccount + '","upplayer": "' + upplayer + '"}}]}';
			var params = JSON.parse(actionstr);
			tp.pushEosAction(params).then(data => {
				//var result = JSON.stringify(JSON.parse(JSON.stringify(data)), null, 2);
				//$('.consoleLog').html(result);
			});

		} catch (e) {
			//$('.consoleLog').html(e);
		}
	} else {
		console.log("tp is not connected!");

	}
}

function EosjsInit() {
	var eosConfig = {
		chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
		httpEndpoint: $("#httpendpointid").val(),
		verbose: true
	}

	g_eos = Eos(eosConfig);
}

function GetAbi() {
	var $contractid = $("#contractid");
	var $tablelistid = $("#tablelistid");
	var $actionlistid = $("#actionlistid");
	$tablelistid.empty();
	$actionlistid.empty();
	$("#tableid").hide();
	$("#actionid").hide();
	g_eos.getAbi($contractid.val(), function (error, data) {
		if (error == null) {
			g_abidata = data;
			console.log(JSON.stringify(data, null, 2));
			var tablecnt = data["abi"]["tables"].length;
			for (var i = 0; i < tablecnt; i++) {
				var tablename = data["abi"]["tables"][i]["name"];
				$tablelistid.append(new Option(tablename, tablename));
			}

			var actioncnt = data["abi"]["actions"].length;
			for (var i = 0; i < actioncnt; i++) {
				var actionname = data["abi"]["actions"][i]["name"];
				$actionlistid.append(new Option(actionname, actionname));
			}

			$("#operatetypeid").empty();
			$("#operatetypeid").append(new Option("pushaction", 0));
			$("#operatetypeid").append(new Option("gettable", 1));

			OperateShow($("#operatetypeid").val());

			ActionParamParse($actionlistid.val());
		} else {
			$("#logid").html(error);
			console.log(error);
		}
	})
}

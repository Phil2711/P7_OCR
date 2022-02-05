console.log("Bonjour");

// $.ajax({
	// url:"/api/demandes/",
	// success: console.log("ok")
	// });

$.ajax({
	url:"/api/anciennetés_clients/",
	success: affiche_anciennetés_base
	});
	
$.ajax({
	url:"/",
	success: liste_clients
	});
	
var le_seuil = 50;
var base_anciennetés;
var les_antécèdents;
var en_tête = "<tr><th>AME_CONTRACT_TYP</th><th>MT_ANNUIT</th><th>MT_APPLICATIO</th><th>MT_CREDI</th><th>MT_DOWN_PAYMEN</th><th>MT_GOODS_PRIC</th><th>EEKDAY_APPR_PROCESS_STAR</th><th>OUR_APPR_PROCESS_STAR</th><th>LAG_LAST_APPL_PER_CONTRAC</th><th>FLAG_LAST_APPL_IN_DA</th><th>ATE_DOWN_PAYMEN</th><th>ATE_INTEREST_PRIMAR</th><th>ATE_INTEREST_PRIVILEGE</th><th>AME_CASH_LOAN_PURPOS</th><th>AME_CONTRACT_STATU</th><th>AYS_DECISIO</th><th>AME_PAYMENT_TYP</th><th>ODE_REJECT_REASO</th><th>AME_TYPE_SUIT</th><th>AME_CLIENT_TYP</th><th>AME_GOODS_CATEGOR</th><th>AME_PORTFOLI</th><th>AME_PRODUCT_TYP</th><th>HANNEL_TYP</th><th>ELLERPLACE_ARE</th><th>AME_SELLER_INDUSTR</th><th>NT_PAYMEN</th><th>AME_YIELD_GROU</th><th>RODUCT_COMBINATIO</th><th>AYS_FIRST_DRAWIN</th><th>AYS_FIRST_DU</th><th>AYS_LAST_DUE_1ST_VERSIO</th><th>AYS_LAST_DU</th><th>AYS_TERMINATIO</th><th>FLAG_INSURED_ON_APPROVA</th></tr>"
var liste_champs = ['NAME_CONTRACT_TYPE', 'AMT_ANNUITY',
       'AMT_APPLICATION', 'AMT_CREDIT', 'AMT_DOWN_PAYMENT', 'AMT_GOODS_PRICE',
       'WEEKDAY_APPR_PROCESS_START', 'HOUR_APPR_PROCESS_START',
       'FLAG_LAST_APPL_PER_CONTRACT', 'NFLAG_LAST_APPL_IN_DAY',
       'RATE_DOWN_PAYMENT', 'RATE_INTEREST_PRIMARY',
       'RATE_INTEREST_PRIVILEGED', 'NAME_CASH_LOAN_PURPOSE',
       'NAME_CONTRACT_STATUS', 'DAYS_DECISION', 'NAME_PAYMENT_TYPE',
       'CODE_REJECT_REASON', 'NAME_TYPE_SUITE', 'NAME_CLIENT_TYPE',
       'NAME_GOODS_CATEGORY', 'NAME_PORTFOLIO', 'NAME_PRODUCT_TYPE',
       'CHANNEL_TYPE', 'SELLERPLACE_AREA', 'NAME_SELLER_INDUSTRY',
       'CNT_PAYMENT', 'NAME_YIELD_GROUP', 'PRODUCT_COMBINATION',
       'DAYS_FIRST_DRAWING', 'DAYS_FIRST_DUE', 'DAYS_LAST_DUE_1ST_VERSION',
       'DAYS_LAST_DUE', 'DAYS_TERMINATION', 'NFLAG_INSURED_ON_APPROVAL']
var X_SMOTE;
	   
console.log("Au-revoir");


function liste_clients(X) {
	console.log("Création de la liste des clients");
}	

	
function affiche_anciennetés_base(résultat) {
	console.log("Affichage emplacement des antécèdents");
	
	base_anciennetés = résultat["data"];
	récupère_id_client(base_anciennetés);
	}

function récupère_id_client() {
	var index_sélectionné = document.getElementById("client");
	var client_sélectionné = index_sélectionné.options[index_sélectionné.selectedIndex].value;

	document.getElementById("validation").innerText = "Client sélectionné : " + client_sélectionné;
	
	adresse = "/functions/risque?id=" + client_sélectionné;
	console.log(adresse);
	$.ajax({
		url:adresse,
		success: function(résultat) {
			le_risque = Math.round(100 * résultat["data"]["risque"]);
			console.log("Risque = " + le_risque + "%");
			console.log(résultat["data"]["classe"]);
			document.getElementById("risque").innerText = "Risque de non remboursement : " + le_risque + "%";
			if (résultat["data"]["classe"] == 1) {
				document.getElementById("classe").innerText = "Client à risque";
				} else {
					document.getElementById("classe").innerText = "Client sûr";
				}
			Jauge(100 * résultat["data"]["risque"], le_seuil);
			}
	});
		
	affiche_anciennetés(base_anciennetés, client_sélectionné);
} 

function Jauge(val, seuil) {
	
Highcharts.chart("container", {
		
    chart: {
		backgroundColor: '#f8f8f8',
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
		height: 300,
		width:300
    },

    title: {
        text: 'Risque'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 100,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: '%'
        },
        plotBands: [{
            from: 0,
            to: seuil,
            color: '#55BF3B' // green
		}, {
        // }, {
            // from: 120,
            // to: 160,
            // color: '#DDDF0D' // yellow
        // }, {
            from: seuil,
            to: 100,
            color: '#DF5353' // red
        }]
    },

    series: [{
        name: 'Pourcentage',
        data: [val],
        tooltip: {
            valueSuffix: ' %'
        }
    }]

},
// Add some life
// function (chart) {
    // if (!chart.renderer.forExport) {
        // setInterval(function () {
            // var point = chart.series[0].points[0],
                // newVal,
                // inc = 0;
				// Math.round((Math.random() - 0.5) * 20);

            // newVal = point.y + inc;
            // if (newVal < 0 || newVal > 200) {
                // newVal = point.y - inc;
            // }

            // point.update(newVal);

        // }, 3000);
    // }
// });
}

function jauge(x) {
	adresse = "/functions/jauge?risque=" + x
	console.log(adresse);
	$.ajax({
		url:adresse,
		success: function(x) {
			;
			}
	});	
	return x;
}

function affiche_anciennetés(base_anciennetés, client) {
	console.log("Affichage des antécèdents du client sélectionné");
	console.log(anciennetés);
    var div = $("#tableau_antécèdents").html("");
    div.append("<table></table");
    var tableau_antécèdents = $("#tableau_antécèdents table");
	// var en_tête = "<tr><th>Client</th><th>Annuités</th><th>En cours</th></tr>"
	tableau_antécèdents.append(en_tête);
	indices = [];
	taille = Object.keys(base_anciennetés).length;

	for (i = 0; i < taille; i++) {
		if (base_anciennetés[i]["SK_ID_CURR"] == client) {
			indices.push(i);
			}
		}
	if (indices.length == 0) {

		var nouvelle_ligne = "<tr><td class='client'>" + client + "</td><td>Pas d'antécédent</td><td> </td></tr>";
		tableau_antécèdents.append(nouvelle_ligne);
		}
		else {
		for (var i = 0; i < indices.length; i++) {
				les_antécèdents = base_anciennetés[i];
			}
		}
	for (var i = 0; i < indices.length; i++) {
		var nouvelle_ligne = "<tr><td class='client'>" + client + "</td>";
		for (j = 0; j < liste_champs.length; j++) {
			nouvelle_ligne += "<td>" + base_anciennetés[i][liste_champs[j]] + "</td>";
			}
		nouvelle_ligne += "</tr>";
		tableau_antécèdents.append(nouvelle_ligne);
		}	
	}


  

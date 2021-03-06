console.log("Bonjour");

// $.ajax({
	// url:"/api/demandes/",
	// success: console.log("ok")
	// });

// $.ajax({
	// url:"/api/anciennetés_clients/",
	// success: affiche_anciennetés_base
	// });
	
$.ajax({
	url:"/",
	success: liste_clients
	});
	
var le_seuil = 45;
var en_tête = "<tr><th>CLIENT</th<th>NAME_CONTRACT_TYP</th><th>MT_ANNUIT</th><th>MT_APPLICATIO</th><th>MT_CREDI</th><th>MT_DOWN_PAYMEN</th><th>MT_GOODS_PRIC</th><th>EEKDAY_APPR_PROCESS_STAR</th><th>OUR_APPR_PROCESS_STAR</th><th>LAG_LAST_APPL_PER_CONTRAC</th><th>FLAG_LAST_APPL_IN_DA</th><th>ATE_DOWN_PAYMEN</th><th>ATE_INTEREST_PRIMAR</th><th>ATE_INTEREST_PRIVILEGE</th><th>AME_CASH_LOAN_PURPOS</th><th>AME_CONTRACT_STATU</th><th>AYS_DECISIO</th><th>AME_PAYMENT_TYP</th><th>ODE_REJECT_REASO</th><th>AME_TYPE_SUIT</th><th>AME_CLIENT_TYP</th><th>AME_GOODS_CATEGOR</th><th>AME_PORTFOLI</th><th>AME_PRODUCT_TYP</th><th>HANNEL_TYP</th><th>ELLERPLACE_ARE</th><th>AME_SELLER_INDUSTR</th><th>NT_PAYMEN</th><th>AME_YIELD_GROU</th><th>RODUCT_COMBINATIO</th><th>AYS_FIRST_DRAWIN</th><th>AYS_FIRST_DU</th><th>AYS_LAST_DUE_1ST_VERSIO</th><th>AYS_LAST_DU</th><th>AYS_TERMINATIO</th><th>FLAG_INSURED_ON_APPROVA</th></tr>"
var liste_champs = ["NAME_CONTRACT_TYPE", "AMT_ANNUITY",
       "AMT_APPLICATION", "AMT_CREDIT", "AMT_DOWN_PAYMENT", "AMT_GOODS_PRICE",
       "WEEKDAY_APPR_PROCESS_START", "HOUR_APPR_PROCESS_START",
       "FLAG_LAST_APPL_PER_CONTRACT", "NFLAG_LAST_APPL_IN_DAY",
       "RATE_DOWN_PAYMENT", "RATE_INTEREST_PRIMARY",
       "RATE_INTEREST_PRIVILEGED", "NAME_CASH_LOAN_PURPOSE",
       "NAME_CONTRACT_STATUS", "DAYS_DECISION", "NAME_PAYMENT_TYPE",
       "CODE_REJECT_REASON", "NAME_TYPE_SUITE", "NAME_CLIENT_TYPE",
       "NAME_GOODS_CATEGORY", "NAME_PORTFOLIO", "NAME_PRODUCT_TYPE",
       "CHANNEL_TYPE", "SELLERPLACE_AREA", "NAME_SELLER_INDUSTRY",
       "CNT_PAYMENT", "NAME_YIELD_GROUP", "PRODUCT_COMBINATION",
       "DAYS_FIRST_DRAWING", "DAYS_FIRST_DUE", "DAYS_LAST_DUE_1ST_VERSION",
       "DAYS_LAST_DUE", "DAYS_TERMINATION", "NFLAG_INSURED_ON_APPROVAL"]

var X_SMOTE;
	   
console.log("Au-revoir");


function liste_clients() {
	console.log("Création de la liste des clients");

} // fonction liste_clients

	
function affiche_anciennetés_base(résultat) {
	console.log("Affichage emplacement des antécèdents");
} // fonction affiche_anciennetés_base 


function récupère_id_client() {
	var index_sélectionné = document.getElementById("client");
	var client_sélectionné = index_sélectionné.options[index_sélectionné.selectedIndex].value;

	document.getElementById("validation").innerText = "Client sélectionné : " + client_sélectionné;
	
	adresse = "/functions/risque/?id=" + client_sélectionné;
	console.log(adresse);
	$.ajax({
		url:adresse,
		success: function(résultat) {
			le_risque = Math.round(100 * résultat["data"]["risque"]);
			console.log("Risque = " + le_risque + "%");
			console.log(résultat["data"]["classe"]);
			document.getElementById("risque").innerText = "Risque de non remboursement : " + le_risque + "%";
			if (le_risque >= le_seuil) {
				document.getElementById("classe").innerText = "Client à risque";
				} else {
					document.getElementById("classe").innerText = "Client sûr";
				}
			Jauge(100 * résultat["data"]["risque"], le_seuil);
			graphe(résultat["data"]["champ1"], résultat["data"]["valeurs1"], 'container2', 'Marqueur de risque', 'red');
			graphe(résultat["data"]["champ2"], résultat["data"]["valeurs2"], 'container3', 'Marqueur de sûreté', 'blue');
			affiche_anciennetés(résultat["data"]["antécèdents"], client_sélectionné, résultat["data"]["shap"]);
			},
		error: function(résultat) {
			console.log("pb!");
			}
	});
} //fonction récupère_id_client

function graphe(champ, contenu, conteneur, titre, couleur) {

	clefs = [];
	valeurs = [];
	
	for (clef in contenu) {
		clefs.push(clef);
		if (champ == "DAYS_BIRTH") {
			valeurs.push(Math.round(Math.abs(contenu[clef] / 365.25)));
			} else
			{
			valeurs.push(contenu[clef]);
			}
		}
	
	console.log(valeurs);
	
	Highcharts.chart(conteneur, {
    title: {
        text: titre
    },

    xAxis: [{
        title: { text: '' },
        alignTicks: false
    }, {
        title: { text: '' },
        alignTicks: false,
        opposite: true
    }],

    yAxis: [{
        title: { text: '' }
    }, {
        title: { text: '' },
        opposite: true
    }],

    plotOptions: {
        histogram: {
			color: couleur,
            accessibility: {
                point: {
                    valueDescriptionFormat: '{index}. {point.x:.3f} to {point.x2:.3f}, {point.y}.'
                }
            }
        }
    },

	series: [{
        name: champ,
        type: 'histogram',
        xAxis: 1,
        yAxis: 1,
        baseSeries: 's1',
        zIndex: -1
    }, {
        name: '',
        type: 'scatter',
        data: valeurs,
        id: 's1',
        marker: {
            radius: 0.0
        }
    }]
});
}

function Jauge(val, seuil) {
	
Highcharts.chart("container1", {
		
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
// }
);
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
} // fonction jauge

function affiche_anciennetés(antécèdents, client, graphe) {
	console.log("Affichage des antécèdents du client sélectionné");
	console.log("Chargement des données pour le client : " + client);
    console.log(antécèdents);
	console.log(graphe[0]);
	
	var div_shap = $("#shap").html("");
	var graphe_shap = document.createElement("iframe");
	
	graphe_shap.srcdoc = graphe[0];
	graphe_shap.width = "100%";
	graphe_shap.height = "200px";
	graphe_shap.style = "border:0px;";
	document.body.appendChild(graphe_shap);
	div_shap.append(graphe_shap);
	
	var div_tableau = $("#tableau_antécèdents").html("");
    div_tableau.append("<table></table");

    var tableau_antécèdents = $("#tableau_antécèdents table");
	tableau_antécèdents.append(en_tête);
	// indices = [];
	taille = Object.keys(antécèdents).length;

	console.log(taille);
	if (antécèdents.length == 0) {
		var nouvelle_ligne = "<tr><td class='client'>" + client + "</td><td>Pas d'antécédent</td><td> </td></tr>";
		tableau_antécèdents.append(nouvelle_ligne);
		}
		else {
		for (var i = 0; i < taille; i++) {
			var nouvelle_ligne = "<tr><td class='client'>" + client + "</td>";
			 
			for (j = 0; j < liste_champs.length; j++) {
				nouvelle_ligne += "<td>" + antécèdents[i][liste_champs[j]] + "</td>";
				}
			nouvelle_ligne += "</tr>";
			tableau_antécèdents.append(nouvelle_ligne);		
			}
		}
} // fonction affiche_anciennetés


  

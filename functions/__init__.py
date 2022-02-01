# -*- coding: utf-8 -*-
import plotly.graph_objects as go
import xgboost as xgb

# Calcule le résultat du candidat selon le modèle choisi
# En entrée :
# -les caractéristiques des clients pour le modèle
#  -client : l'identifiant du client
#  -emplacement : chemin du modèle (utile lors des transferts de sites)
# En sortie :
#  -le résultat du client
#  -la classe d'appartenance du client
def risque_client(X,
                  client,
                  emplacement) :

    if X.columns[0] == 'Unnamed: 0' :
        X.drop('Unnamed: 0',
               axis = 1,
               inplace = True)
    le_modèle_ajusté = xgb.XGBClassifier()
    le_modèle_ajusté.load_model(emplacement + '\\Data\\modele.json')

    la_proba_du_client = le_modèle_ajusté.predict_proba(X[X['SK_ID_CURR'] == client])[0][1]
    la_classe_du_client = le_modèle_ajusté.predict(X[X['SK_ID_CURR'] == client])[0]

    return la_proba_du_client, la_classe_du_client

# Trace le seuil et la position du candidat sous forme de jauge
# En entrée :
#  -seuil : le seuil retenu pour le modèle
#  -valeur : le résultat du candidat pour le modèle
# En sortie :
#  -une jauge positionnant le candidat par raport au seuil
def trace_jauge(seuil,
                valeur) :

    la_jauge =  go.Figure(go.Indicator(domain = {'x': [0, 0.5], 
                                                'y': [0, 0.]},
                                                value = valeur,
                                                    mode = 'gauge+number+delta',
                                                    title = {'text': "Seuil"},
                                                    delta = {'reference': seuil},
                                                    gauge = {'axis': {'range': [None, 
                                                                                1]},
                                                            'steps' : [
                                                                {'range': [0,
                                                                            0.3],
                                                                'color': 'lightgreen'},
                                                                {'range': [0.3,
                                                                            1],
                                                                'color': 'orange'}],
                                                            'threshold' : {'line': {'color': 'red',
                                                                                    'width': 4},
                                                                                    'thickness': 0.75,
                                                                                    'value': valeur}}))

    la_jauge.to_html()

def test(x) :
    
    return x*2
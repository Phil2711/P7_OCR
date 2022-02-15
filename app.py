# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
import os
import json
import requests
import pandas as pd
from functions import risque_client
import xgboost as xgb
import shap
from shap.plots._force_matplotlib import draw_additive_plot
from shap import initjs
import numpy as np
import pickle
    
app = Flask(__name__)

taux = .2
FN = .000245
FP = .08
valeur_attendue_illustrateur = -3.0499682529354506
le_modèle_ajusté = xgb.XGBClassifier()
le_modèle_ajusté.load_model('modèle.txt') 
X_SMOTE = pd.read_csv('X_SMOTE_TDB.csv')
if X_SMOTE.columns[0] == 'Unnamed: 0' :
    X_SMOTE.drop('Unnamed: 0',
    axis = 1,
    inplace = True)
# illustrateur_shap = shap.TreeExplainer(le_modèle_ajusté, X_SMOTE, y = 192)
with open('illustrateur.save', 'wb') as f :
    illustrateur_shap = pickle.load(f)
with open('valeurs_shap.save', 'wb') as f :
    valeurs_shap = pickle.load()
with open ('anciennetes.json') as base_anciennetes :
    anciens = json.load(base_anciennetes)
print(valeurs_shap.shape)

def _force_plot_html(valeur_espérée, vecteur, colonnes, ind):
    force_plot = shap.plots.force(valeur_espérée, vecteur[ind], X_SMOTE.values[ind], feature_names = colonnes, matplotlib=False)
    shap_html = f"<head>{shap.getjs()}</head><body>{force_plot.html()}</body>"
        
    return shap_html      

                           

@app.route('/functions/risque/', methods = ['GET'])
def calcul_du_risque() :
    
    id_temp = request.args.get('id', 0)
    id_client = int(id_temp)

    risque, classe = risque_client(X_SMOTE, id_client)
    
    shap.initjs()
    
    shap_plots = {}    
   
    shap_plots[0] = _force_plot_html(valeur_attendue_illustrateur, valeurs_shap, X_SMOTE.columns, id_client - 100002)
    champ1 = X_SMOTE[X_SMOTE['SK_ID_CURR'] == id_client].columns[np.where(valeurs_shap[id_client - 100002] == np.max(valeurs_shap[id_client - 100002]))[0][0]]
    champ2 = X_SMOTE[X_SMOTE['SK_ID_CURR'] == id_client].columns[np.where(valeurs_shap[id_client - 100002] == np.min(valeurs_shap[id_client - 100002]))[0][0]]
    valeurs1 = X_SMOTE[champ1].to_dict()
    valeurs2 = X_SMOTE[champ2].to_dict()

    temporaire = dict()
    i  = 0
    for clef, valeur in anciens.items() :
        if anciens[clef]['SK_ID_CURR'] == id_client :
            temporaire.__setitem__(i, valeur)
            i += 1
    
    le_risque = json.dumps(risque.item())
    la_classe = json.dumps(classe.item())
    
    # somme_empruntée = X_SMOTE[X_SMOTE['AMT_CREDIT'] == id_client][0]
    
    return jsonify({'status': 'ok',
                    'data': {
                    
                        'risque': le_risque,
                        'classe': la_classe,
                        'antécèdents': temporaire,
                        'shap' : shap_plots,
                        'champ1' : champ1,
                        'champ2' : champ2,
                        'valeurs1': valeurs1,
                        'valeurs2' : valeurs2}
                    })

    
@app.route('/')
def racine():

    # shap.initjs()

    # def _force_plot_html(illustrateur, valeurs, colonnes, ind):
        # force_plot = shap.plots.force(illustrateur, valeurs[ind], colonnes, matplotlib=False)
        # shap_html = f"<head>{shap.getjs()}</head><body>{force_plot.html()}</body>"
        
        # return shap_html    
        
    # shap_plots = {}    
    
   
    # shap_plots[0] = _force_plot_html(illustrateur_shap.expected_value, valeurs_shap, X_SMOTE.columns, 10000)
   
    les_clients = pd.read_csv('les_clients.csv',
                               sep = ',')
    
    return render_template('tdb.html',
                           clients = les_clients['SK_ID_CURR'].unique().tolist())
                           
                           
                            
#================================================================================
 
# @app.route('/api/anciennetés_clients/')
# def anciennetés_clients():
    
    # shap_plots = {}    
   
    # shap_plots[0] = _force_plot_html(illustrateur_shap.expected_value, valeurs_shap, X_SMOTE.columns, 10000)
   
    # les_clients = pd.read_csv('les_clients.csv',
                               # sep = ',')
                               
    # anciennetés = pd.read_csv('anciennetés.csv')
    
    # return jsonify({'status' : 'ok',
                   # 'data' : {
                        # "antécèdents" : anciennetés.to_dict(orient = 'index'),
                        # "shap" : shap_plots
                        # }
                    # })
                    


#=====================================main=======================================

if __name__ == "__main__":

    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3002)), threaded=True, debug = True)

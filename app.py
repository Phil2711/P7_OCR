# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
import os
import json
import requests
import pandas as pd
from functions import risque_client

import xgboost as xgb
# from flask_talisman import Talisman

# chemin = '/'
    
app = Flask(__name__)

X_SMOTE = pd.read_csv('X_SMOTE_TDB.csv')
anciennetés = pd.read_csv('anciennetes.csv')
# with open ('anciennetes.json') as base_anciennetés :
    # anciennetés = json.load(base_anciennetés)
    
    
#================================================================================
    
@app.route('/functions/risque/', methods = ['GET'])
def calcul_du_risque() :
    


    id_temp = request.args.get('id', 0)
    id_client = int(id_temp)

    risque, classe = risque_client(X_SMOTE, id_client)
    
    antécèdents = anciennetés[anciennetés['SK_ID_CURR'] == id_temp]
    
    le_risque = json.dumps(risque.item())
    la_classe = json.dumps(classe.item())
        
    return jsonify({'status': 'ok',
                    'data': {
                        'risque': le_risque,
                        'classe': la_classe,
                        'antécèdents': antécèdents.to_dict(orient =  'index')}
                    })

    
@app.route('/')
def racine():
    
  
    les_clients = pd.read_csv('les_clients.csv',
                               sep = ',')

    
    
    return render_template('tdb.html',
                           clients = les_clients['SK_ID_CURR'].unique().tolist())
                            
#================================================================================
 
@app.route('/api/anciennetés_clients/')
def anciennetés_clients():
    

    anciennetés = pd.read_csv('anciennetés.csv')
    
    return jsonify({'status' : 'ok',
                   'data' : anciennetés.to_dict(orient = 'index')})
                    


#=====================================main=======================================

if __name__ == "__main__":

    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3002)), threaded=True, debug = True)

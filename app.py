# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
import os
import json
import requests
import pandas as pd
from OpenSSL import crypto
from functions import risque_client

app = Flask(__name__)

X_SMOTE = pd.read_csv('X_SMOTE_TDB.csv')
            
#================================================================================
    
@app.route('/functions/risque/', methods = ['GET'])
def calcul_du_risque() :

    id_client = int(request.args.get('id', 0))

    risque, classe = risque_client(X_SMOTE, id_client, chemin)

    le_risque = json.dumps(risque.item())
    la_classe = json.dumps(classe.item())
    
    return jsonify({'status': 'ok',
                    'data': {
                        'risque': le_risque,
                        'classe': la_classe
                        }
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
    
    with open('antécèdents.json', 'r') as clients_json :
              dictionnaire_antécèdents = json.load(clients_json)
        
    return jsonify({'status' : 'ok',
                    'data' : dictionnaire_antécèdents,
                    })
                    


#=====================================main=======================================

if __name__ == "__main__":

    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3002)), threaded=True, debug = True, ssl_context = 'adhoc')

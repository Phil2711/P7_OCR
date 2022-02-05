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

# if 'DYNO' in os.environ: # only trigger SSLify if the app is running on Heroku
    # Talisman(app)
    
X_SMOTE = pd.read_csv('X_SMOTE_TDB.csv')

# def read_json_file(filename):
    # data = []
    # with open(filename, 'r') as f:
        # data = [json.loads(_.replace('}]}"},', '}]}"}')) for _ in f.readlines()]
    
    # return data
    
#================================================================================
    
@app.route('/functions/risque/', methods = ['GET'])
def calcul_du_risque() :

    id_temp = request.args.get('id', 0)[ : -1]
    id_client = int(id_temp)

    risque, classe = risque_client(X_SMOTE, id_client, '')

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
    
    # with open('antécèdents.json') as clients_json :
              # dictionnaire_antécèdents = json.load(clients_json)
    anciennetés = pd.read_csv('anciennetés.csv')
    
    return jsonify(anciennetés.to_dict(orient='records'))

    
    # return anciennetés
    
    dictionnaire_antécèdents = read_json_file('anciennetés.csv')
   
    return dictionnaire_antécèdents
    
    # return jsonify({'status' : 'ok',
                    # 'data' : dictionnaire_antécèdents,
                    # })
                    


#=====================================main=======================================

if __name__ == "__main__":

    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3002)), threaded=True, debug = True)

# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
import os
import json
import requests
import pandas as pd
from functions import risque_client
# from functions import trace_jauge

app = Flask(__name__)

chemin_données = r'https://github.com/Phil2711/P7_OCR/tree/bases/Data/'
# chemin = r'C:\Users\Sdis59\Documents\OpenClassroom\P7_DS_OCR'
X_SMOTE = pd.read_csv(chemin_données + 'X_SMOTE.csv')

# X_SMOTE = pd.read_csv(chemin_données + 'X_SMOTE.csv')


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
    
# @app.route('/functions/jauge/', methods = ['GET'])
# def jauge() :

    # risque = float(request.args.get('risque', 0))

    # la_jauge = trace_jauge(le_seuil, risque)

    # return la_jauge
    
@app.route('/')
def racine():
    
    # os.system('kaggle competitions download -p \'Data\\\' -c \'home-credit-default-risk\'')
    
    les_clients = pd.read_csv('Data\\les_clients.csv')
    
    return render_template('tdb.html',
                           clients = les_clients['SK_ID_CURR'].unique().tolist())
        
 
#================================================================================
 
@app.route('/api/anciennetés_clients/')
def anciennetés_clients():
    
    with open('\\Data\\antécèdents.json') as clients_json :
              dictionnaire_antécèdents = json.load(clients_json)
        
    return jsonify({'status' : 'ok',
                    'data' : dictionnaire_antécèdents,
                    })
                    


#=====================================main=======================================

if __name__ == "__main__":
#    app.config['TEMPLATES_AUTO_RELOAD'] = True
    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), threaded=True)

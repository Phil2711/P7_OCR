# -*- coding: utf-8 -*-
from flask import Flask, render_template, jsonify, request
import os
import json
import requests
import pandas as pd
# import git
from functions import risque_client
# from functions import trace_jauge

app = Flask(__name__)

URL = 'https://1drv.ms/f/s!Am80QXETynO-hbkQa3ev8H-WWAcDtA'

# chemin_données = r'https://github.com/Phil2711/P7_OCR/tree/bases/Data/'
# chemin = r'C:\Users\Sdis59\Documents\OpenClassroom\P7_DS_OCR'
X_SMOTE = pd.read_csv('X_SMOTE.csv')
# X_SMOTE = pd.read_csv(chemin_données + 'X_SMOTE.csv')

# @app.route('/mise_à_jour', methods=['POST'])
# def webhook():
        # if request.method == 'POST':
            # repo = git.Repo('https://github.com/Phil2711/P7_OCR')
            # origin = repo.remotes.p7
            
# origin.pull()
# return 'Mise à jour réussie', 200
        # else:
            # return 'Erreur', 400
            
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
    
    # les_clients = pd.read_csv('les_clients.csv',
                               # sep = ',')
    # clients = [i for in in range(100002, 111683, 1)]
    # les_clients['SK_ID_CURR'].unique().tolist()
    
    return render_template('tdb.html',
                           range(100002, 111683, 1))
        
 
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
#    app.config['TEMPLATES_AUTO_RELOAD'] = True
    # app.run(host='127.0.0.1', debug = True)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), threaded=True, debug = True)

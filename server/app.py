from flask import Flask, request, jsonify,session
from config import  ApplicationConfig
from flask_cors import CORS,cross_origin
from flask_bcrypt import Bcrypt 
from flask_session import Session
from model import db, User
import os
import urllib.request
from werkzeug.utils import secure_filename 
import pandas as pd
from sqlalchemy import create_engine
import psycopg2

engine = create_engine('postgresql+psycopg2://postgres:root@localhost:5432/demo')
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrpyt = Bcrypt(app)
CORS(app, origins='http://localhost:3000', methods=['GET', 'POST'],supports_credentials=True)


server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
  
ALLOWED_EXTENSIONS = set(['txt', 'pdf','csv','xlsx'])
  
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/@me')
def get_current_user():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({"error":"Unauthorized"}),401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify(
        {"id": user.id,
            "email": user.email,
            "department": user.department,
            })


@app.route('/register', methods=['POST'])
def register():
    email = request.json['email']
    password = request.json['password']
    department = request.json['department']
    user_exist = User.query.filter_by(email=email).first() is not None

    if user_exist:
        return jsonify({"error":"User already exist"}),409

    hashed_password = bcrpyt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password , department=department)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(
        {"id": new_user.id,
         "email": new_user.email,
         "department": new_user.department,
         })


@app.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error":"Unauthorized"}),401

    if not bcrpyt.check_password_hash(user.password, password) :
        return jsonify({"error":"Unauthorized"}),401

    session['user_id'] = user.id

    return jsonify(
        {"id": user.id,
         "email": user.email,
         "department": user.department,
         })

@app.route('/fabrication', methods=['POST'])
def fabrication():
    # check if the post request has the file part
    if 'files[]' not in request.files:
        resp = jsonify({
            "message": 'No file part in the request',   
            "status": 'failed'
        })
        resp.status_code = 400
        return resp
  
    files = request.files.getlist('files[]')
      
    errors = {}
    success = False
      
    for file in files:      
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            success = True
        else:
            resp = jsonify({
                "message": 'File type is not allowed',
                "status": 'failed'
            })
            return resp
         
    if success and errors:
        errors['message'] = 'File(s) successfully uploaded'
        errors['status'] = 'failed'
        resp = jsonify(errors)
        resp.status_code = 500
        return resp
    if success:
        resp = jsonify({
            "message": 'Files successfully uploaded',
            "status": 'successs'
        })
        resp.status_code = 201
        df = pd.read_excel('../fabrication.xlsx',index_col=None)
        print(df)
        df = pd.read_excel('../fabrication.xlsx',index_col=None)
        print(df.dtypes)
        df['inDate'] = (
            pd.to_datetime(df['inDate'], errors='coerce', dayfirst=True)
            .dt.strftime('%Y-%m-%d')
        )
        df['outDate'] = (
            pd.to_datetime(df['outDate'], errors='coerce', dayfirst=True)
            .dt.strftime('%Y-%m-%d')
        )
        main_df = df[['itemID','inDate','outDate','categoryID']].copy()
        main_df.to_sql('Fabrication', engine, if_exists='append', index=False)
        print(main_df)
        return resp
    else:
        resp = jsonify(errors)
        resp.status_code = 500
        return resp

if __name__ == '__main__':
    app.run(debug=True)

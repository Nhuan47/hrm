
import os
from flask import Flask, Blueprint, render_template

from src.routes.auth import auth_bp
from src.routes.service import service_bp
from src.routes.province import province_bp
from src.routes.leave import timeoff_bp

from src.routes.employee.employee import employee_bp
from src.routes.employee.reportTo import reportTo_bp
from src.routes.employee.salary import salary_bp

from src.routes.reportAnalytic import analytic_bp
from src.routes.settings.manageRole import manage_role_bp
from src.routes.settings.userRole import user_role_bp
from src.routes.settings.manageAttribute import manage_attribute_bp

from src.common.utils import init_log_file
from flask_cors import CORS

import config

current_dir = os.path.dirname(__file__)
current_dir = current_dir.replace('\\', '/')
template_folder = current_dir + f'/../client/dist/{config.mode}'
static_folder = current_dir + f'/../client/dist/{config.mode}/assets'



app = Flask(__name__,
            template_folder=template_folder,
            static_folder=static_folder
            )

# Set a secret key for the application


app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config["SESSION_PERMANENT"] = False
# app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
CORS(app, supports_credentials=True)



# Initialize logging configuration
log_file = os.path.join(config.LOG_DIR,  'hrm.log')
init_log_file(log_file)


app_root = config.APPLICATION_ROOT
parent = Blueprint('index', __name__, url_prefix=app_root)

parent.register_blueprint(auth_bp, url_prefix='/auth')
parent.register_blueprint(service_bp, url_prefix='/service')
parent.register_blueprint(province_bp, url_prefix='/province')
parent.register_blueprint(employee_bp, url_prefix='/employee')
parent.register_blueprint(reportTo_bp, url_prefix='/employee/report-to')
parent.register_blueprint(salary_bp, url_prefix='/employee/salary')
parent.register_blueprint(analytic_bp, url_prefix='/reports')
parent.register_blueprint(timeoff_bp, url_prefix='/leave')

parent.register_blueprint(manage_role_bp, url_prefix='/setting')
parent.register_blueprint(user_role_bp, url_prefix='/setting')
parent.register_blueprint(manage_attribute_bp, url_prefix='/setting')

app.register_blueprint(parent)


@app.route('/')
@app.route('/login')
@app.route('/dashboard')
@app.route('/employees')
@app.route('/report-and-analytics/catalogue')
@app.route('/leave')
@app.route('/recruitment')
@app.route('/performance')
@app.route('/admin/system-users')
@app.route('/report-and-analytics/definition')
@app.route('/report-and-analytics/catalogue')
@app.route('/setting/manage-roles')
@app.route('/setting/manage-roles')
@app.route('/setting/user-roles')
@app.route('/setting/manage-attributes')
def index():
    return render_template('./index.html')


@app.route('/employee/<id>/profile')
@app.route('/employee/<id>/personal-details')
@app.route('/report-and-analytics/report-template/<id>')
@app.route('/report-and-analytics/definition/<id>')
@app.route('/employee/<id>/report-to')
@app.route('/employee/<id>/salary')
@app.route('/error/<id>')
@app.route('/setting/edit-role/<id>')
def index1(id):
    return render_template('./index.html')


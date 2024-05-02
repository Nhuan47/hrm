#####################################################
################ NHUAN SETUP ########################
#####################################################
#Load python
LoadFile /var/www/html/workspaces/python3.7/lib/libpython3.7m.so.1.0

#Load wsgi module
LoadModule wsgi_module "/var/www/html/workspaces/python3.7/lib/python3.7/site-packages/mod_wsgi/server/mod_wsgi-py37.cpython-37m-x86_64-linux-gnu.so"

# Setup python Home
WSGIPythonHome "/var/www/html/workspaces/python3.7"

<VirtualHost *:80>
    #DocumentRoot ""
    WSGIDaemonProcess / user=apache threads=5
    #WSGIScriptAlias / /var/www/html/workspaces/source_code/SVI_HRM/v0.2/server/api/app.wsgi
    WSGIScriptAlias / /var/www/html/workspaces/lab/app.wsgi
    #TimeOut 1800    
    <Directory "/var/www/html/workspaces/lab/">
       WSGIProcessGroup /
       WSGIApplicationGroup /
       Options Indexes FollowSymLinks
       AllowOverride All
       Require all granted 
    </Directory>
</VirtualHost>

######################################################
######################## END #########################
#####################################################

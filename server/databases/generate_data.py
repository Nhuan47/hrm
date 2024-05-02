import pandas as pd
import pymysql
from pymysql.constants import CLIENT
import sys

# DB_NAME = 'hrm_test'
# DB_USER = 'root'
# DB_PASS = ''
# DB_HOST = 'localhost'
# DB_PORT = 3306

DB_NAME = 'hrm_dev'
DB_USER = 'hrm'
DB_PASS = 'hrm_svi4ams!'
DB_HOST = '192.168.200.59'
DB_PORT = 3306

def create_connection():
        connection = None
        try:
            connection = pymysql.connect(host = DB_HOST,
                            port         = DB_PORT,
                            user         = DB_USER, 
                            password     = DB_PASS,
                            db           = DB_NAME,
                            charset      = 'utf8mb4',
                            cursorclass  = pymysql.cursors.DictCursor,
                            client_flag  = CLIENT.MULTI_STATEMENTS
                            )
            return connection
        except Exception as e:
            print(e)
        return connection

def db_execute( query):
        try:
            connection          = create_connection()
            cursor              = connection.cursor()
            cursor.execute(query)
            connection.commit()
            return cursor.lastrowid
        except Exception as e:
            raise Exception(e)
        finally:
            connection.close()

def db_query( query):
    try:
        connection          = create_connection()
        cursor              = connection.cursor()
        cursor.execute(query)
        rows                = cursor.fetchall()
        if rows:
            return rows
        else:
            return None
    except Exception as e:
        raise Exception(e)         
    finally:
        connection.close()


def create_procedure():
    # SQL code for the stored procedure
    sql_code = """
        CREATE PROCEDURE create_dynamic_employee_view()
        BEGIN
            DECLARE dynamic_sql TEXT;
            SET SESSION group_concat_max_len = 1000000;
            
            SELECT GROUP_CONCAT(DISTINCT
                    CONCAT(
                        'MAX(CASE WHEN attribute_accessor = ''',
                        attribute_accessor,
                        ''' THEN attribute_value END) AS ',
                        attribute_accessor
                    )
                ) INTO dynamic_sql
            FROM v_employee_cols;

            SET @sql = CONCAT('CREATE OR REPLACE VIEW v_employee_attribute AS SELECT v_employee_cols.employee_id, ', dynamic_sql, ' FROM v_employee_cols GROUP BY employee_id');
            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        END;
    """
    db_execute(sql_code)

def initialize():
    sqls = ["DELETE FROM group_attributes;",
            'DELETE FROM employee_attribute_values',
            'DELETE FROM attributes',
            'DELETE FROM attribute_values',
            'DELETE FROM employee_role',
            'DELETE FROM employee_tokens',
            'DELETE FROM employees',
            'DROP PROCEDURE IF EXISTS create_dynamic_employee_view'
            ]
    
    for sql in sqls:
        print(sql)
        db_execute(sql)

def get_group_id(grp_name):
    sql = f"SELECT group_id FROM groups WHERE group_accessor = '{grp_name}'"
    print(sql)
    rows= db_query(sql)
    if rows:
        return rows[0]['group_id']
    return None

def add_attribute(attribute_id, attribute_accessor, attribute_name, attribute_type, is_required, description, attribute_order, is_display_table, is_add_user_required):
    sql = f"""INSERT INTO attributes
         (attribute_id, attribute_accessor, attribute_name, attribute_type, is_required, description, attribute_order, is_display_table, is_add_user_required)
         VALUES ('{attribute_id}', '{attribute_accessor}', '{attribute_name}', '{attribute_type}', {is_required}, '{description}', '{attribute_order}', {is_display_table}, {is_add_user_required})
         """
    print(sql)
    id = db_execute(sql)
    return id

def add_group_attribute(group_id, attribute_id):
    sql =  f"""
            INSERT INTO group_attributes
            (group_id, attribute_id) VALUES ('{group_id}', {attribute_id})
            """
    id = db_execute(sql)
    return id

def get_headers(file_path, sheet_name=None):
    try:
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
        else:
            df = pd.read_excel(file_path)
        
        headers = df.columns.tolist()
        return headers
    except Exception as e:
        return None, str(e)
    
def read_excel_file_by_header(file_path, headers):
    try:
        df = pd.read_excel(file_path)
        selected_columns = df[headers]
        return selected_columns
    except Exception as e:
        return None, str(e)
    

def excel_to_dict(file_path, sheet_name=None):
    try:
        if sheet_name:
            df = pd.read_excel(file_path, sheet_name=sheet_name)
        else:
            df = pd.read_excel(file_path)
        
    
        data_dict = df.to_dict(orient='records')
        return data_dict
    except Exception as e:
        return None, str(e)
    

def get_attributes():
    sql = """SELECT attribute_id, attribute_accessor FROM attributes"""
    rows = db_query(sql)
    out = []
    for row in rows:
        tmp = {}
        tmp['attribute_id'] = row['attribute_id']
        tmp['attribute_accessor'] = row['attribute_accessor']
        out.append(tmp)
    return out

def init_employee_attribute_value():
    sql = """INSERT INTO attribute_values (attribute_value) VALUES ('')"""
    return  db_execute(sql)

def save_employee_value(emp_id, attr_id, value_id):
    sql = f"""INSERT INTO employee_attribute_values (employee_id, attribute_id, attribute_value_id) VALUES ({emp_id}, {attr_id}, {value_id})"""
    db_execute(sql)

def init_user(email):

    # Add employee
    sql_1 = f"""INSERT INTO employees (email, password) VALUES ("{email}", "24af26fb5719e905ce602bf2030da74e684d32009930344565a9e43f03182096")""";
    emp_id = db_execute(sql_1)

    # Add roles
    sql_2 = f"""INSERT INTO employee_role (employee_id, role_id) VALUES ("{emp_id}", 1)""";
    db_execute(sql_2)

    # init value
    attributes = get_attributes()
    for attr in attributes:
        value_id = init_employee_attribute_value()
        save_employee_value(emp_id, attr['attribute_id'], value_id)


def main():

    
    initialize()
    file_path = './employee_attribute.xlsx'
    sheet_name = 'attributes' 
    rows = excel_to_dict(file_path, sheet_name)
    dict_group = {}
    for row in rows:
        group = row['group']

        try:
            tmp = dict_group[group]
        except KeyError:
            dict_group[group] = []
        dict_group[group].append(row)
    
    for group_name in dict_group:
        grp_id = get_group_id(group_name)
        
        for item in dict_group[group_name]:
            id = item['No']
            accessor = item['accessor']
            display = item['display']
            type = item['type']
            is_required = int(item['is_required']) if item['is_required'] == 1 else 0
            description = item['description'] if  item['description']  else ''
            is_table_display = int(item['is_table_display']) if item['is_table_display'] == 1 else 0
            is_add_user_required = int(item['is_add_user_required']) if item['is_add_user_required'] == 1 else 0
            order = item['order']

            attr_id = add_attribute(id, accessor, display, type, is_required, description, order, is_table_display, is_add_user_required)
            if(grp_id):
                add_group_attribute(grp_id, attr_id)

    # init_user('admin@savarti.com')

    create_procedure()
    db_execute('call create_dynamic_employee_view()')







if __name__ == '__main__':
    main()



import pandas as pd
import pymysql
from pymysql.constants import CLIENT
import sys
from pprint import pprint
sys.path.insert(0, "../src")

from common.db_enum import DBTableName, DBViewName, DBTableFields


DB_NAME = 'hrm_pilot'
DB_USER = 'hrm'
DB_PASS = 'hrm_svi4ams!'
DB_HOST = '192.168.200.59'
DB_PORT = 3306

# DB_NAME = 'hrm_dev_1'
# DB_USER = 'root'
# DB_PASS = ''
# DB_HOST = 'localhost'
# DB_PORT = 3306



# Header config 
class ExcelKeys:
    GROUP_ORDER = 'Group Order'
    SHOW_ON_PERSONAL_DETAILS="Show On Personal Details"
    SHOW_ON_REPORT_ANALYSIS="Show On Report Analysis (Filters, Display)"
    EXCEL_HEADER = "Excel Header"
    ACCESSOR = "Accessor"
    DISPLAY = "Display"
    DATA_TYPE = "Data Type"
    REQUIRED_FIELD = "Required Field"
    DESCRIPTION = "Description"
    SHOW_ON_EMPLOYEE_TABLE = "Show On Employee Table"
    SHOW_ON_EMPLOYEE_TABLE_ORDER = "Show On Employee Table(Order)"
    SHOW_ON_ADD_EMPLOYEE_MODAL  = "Show On Add Employee Modal"
    SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER  = "Show On Add Employee Modal(Order)"
    GROUP = "Group"
    ATTRIBUTE_ORDER_IN_GROUP =  "Attribute Order In Group"
    
    


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


class Group():
    def __init__(self):
        pass
    def get_groups(self):
        out= []
        sql = f"""SELECT * FROM {DBTableName.GROUPS}"""
        rows = db_query(sql)
        if rows:
            for row in rows:
                item = {}
                item[DBTableFields.GROUP_ID] = row[DBTableFields.GROUP_ID]
                item[DBTableFields.GROUP_NAME] = row[DBTableFields.GROUP_NAME]
                item[DBTableFields.GROUP_ACCESSOR] = row[DBTableFields.GROUP_ACCESSOR]
                item[DBTableFields.GROUP_ORDER] = row[DBTableFields.GROUP_ORDER]
                item[DBTableFields.GROUP_DESCRIPTION] = row[DBTableFields.GROUP_DESCRIPTION]
                item[DBTableFields.SHOW_ON_PERSONAL_DETAILS] = row[DBTableFields.SHOW_ON_PERSONAL_DETAILS]
                item[DBTableFields.SHOW_ON_REPORT_ANALYSIS] = row[DBTableFields.SHOW_ON_REPORT_ANALYSIS]
                out.append(item)
        return out
    
    def  update_group(self, id, name, accessor, order, description, is_show_on_personal_detail, is_show_on_report_analysis):
        
        sql = f"""UPDATE {DBTableName.GROUPS} 
                    SET {DBTableFields.GROUP_NAME}="{name}",
                    {DBTableFields.GROUP_ACCESSOR}="{accessor}",
                    {DBTableFields.GROUP_ORDER}="{order}",
                    {DBTableFields.GROUP_DESCRIPTION}="{description}",
                    {DBTableFields.SHOW_ON_PERSONAL_DETAILS}="{is_show_on_personal_detail}",
                    {DBTableFields.SHOW_ON_REPORT_ANALYSIS}="{is_show_on_report_analysis}"
                    WHERE {DBTableFields.GROUP_ID}={id}                
        """
        #print (sql)
        db_execute(sql)
        
    def  add_group(self, name, accessor, order, description, is_show_on_personal_detail, is_show_on_report_analysis):

      
        sql = f"""INSERT INTO {DBTableName.GROUPS} 
                    ({DBTableFields.GROUP_NAME}, {DBTableFields.GROUP_ACCESSOR}, {DBTableFields.GROUP_ORDER}, {DBTableFields.GROUP_DESCRIPTION}, {DBTableFields.SHOW_ON_PERSONAL_DETAILS},{DBTableFields.SHOW_ON_REPORT_ANALYSIS})
                    VALUES ("{name}", "{accessor}", "{order}", "{description}", "{is_show_on_personal_detail}", "{is_show_on_report_analysis}")
                             
        """
        db_execute(sql)
        #print (sql)
        
    def find_group_id(self, display):
        sql = f"""SELECT {DBTableFields.GROUP_ID}
                    FROM {DBTableName.GROUPS} 
                    WHERE {DBTableFields.GROUP_NAME}="{display}"
                """
        rows = db_query(sql)
        if rows:
            for row in rows:
                return row[DBTableFields.GROUP_ID]
        else:
            return None
        
    def update_group_atrtibute_mapping(self, old_id, attr_id,  new_id):
        sql = f"""
                UPDATE {DBTableName.GROUP_ATTRIBUTES} 
                SET {DBTableFields.GROUP_ID} = {new_id} 
                WHERE {DBTableFields.GROUP_ID} = {old_id} AND {DBTableFields.ATTRIBUTE_ID} = {attr_id}
                """
        db_execute(sql)
        
    def add_group_atrtibute_mapping(self, grp_id, attr_id):
        sql = f"""
                INSERT INTO  {DBTableName.GROUP_ATTRIBUTES} 
                    ( {DBTableFields.GROUP_ID}, {DBTableFields.ATTRIBUTE_ID}) 
                VALUES ( "{grp_id}" , "{attr_id}")
                """
        db_execute(sql)
        
    
class Attribute:
    
    def __init__(self):
        pass
    
    def get_attributes(self):
        out= []
        sql = f"""SELECT {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_TYPE},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_REQUIRED},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_EMPLOYEE_TABLE},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL_ORDER},
                        {DBTableName.GROUPS}.{DBTableFields.GROUP_NAME}
        
            FROM {DBTableName.GROUP_ATTRIBUTES}
            INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
            INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUPS}.{DBTableFields.GROUP_ID} = {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID}
            
        """
        rows = db_query(sql)
        if rows:
            for row in rows:
                item = {}
                item[DBTableFields.ATTRIBUTE_ID] = row[DBTableFields.ATTRIBUTE_ID]
                item[DBTableFields.ATTRIBUTE_NAME] = row[DBTableFields.ATTRIBUTE_NAME]
                item[DBTableFields.ATTRIBUTE_TYPE] = row[DBTableFields.ATTRIBUTE_TYPE]
                item[DBTableFields.ATTRIBUTE_REQUIRED] = row[DBTableFields.ATTRIBUTE_REQUIRED]
                item[DBTableFields.ATTRIBUTE_ACCESSOR] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                item[DBTableFields.ATTRIBUTE_ORDER] = row[DBTableFields.ATTRIBUTE_ORDER]
                item[DBTableFields.SHOW_ON_EMPLOYEE_TABLE] = row[DBTableFields.SHOW_ON_EMPLOYEE_TABLE]
                item[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL] = row[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL]
                item[DBTableFields.GROUP_NAME] = row[DBTableFields.GROUP_NAME]
                out.append(item)
        return out
    
    def update_attribute(self, id, name, type, required, description, is_display, is_add_user, order):
        sql =f"""
                    UPDATE {DBTableName.ATTRIBUTES} 
                    SET {DBTableFields.ATTRIBUTE_NAME} = "{name}",
                    {DBTableFields.ATTRIBUTE_TYPE} = "{type}",
                    {DBTableFields.ATTRIBUTE_REQUIRED} = "{required}",
                    {DBTableFields.ATTRIBUTE_DESCRIPTION} = "{description}",
                    {DBTableFields.SHOW_ON_EMPLOYEE_TABLE} = "{is_display}",
                    {DBTableFields.ATTRIBUTE_ORDER} = "{order}",
                    {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL} = "{is_add_user}"
                    WHERE {DBTableFields.ATTRIBUTE_ID} = {id}
                """
        #print(sql)
        db_execute(sql)
        
        
    def add_attribute(self, name, type, required, description, accessor, is_display, is_add_user, order):
        sql =f"""
                    INSERT INTO  {DBTableName.ATTRIBUTES} 
                    ({DBTableFields.ATTRIBUTE_NAME},
                        {DBTableFields.ATTRIBUTE_TYPE},
                        {DBTableFields.ATTRIBUTE_REQUIRED},
                        {DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableFields.SHOW_ON_EMPLOYEE_TABLE},
                        {DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL},
                        {DBTableFields.ATTRIBUTE_ORDER})
                    VALUES (
                        "{name}",
                        "{type}",
                        "{required}",
                        "{accessor}",
                        "{is_display}",
                        "{is_add_user}",
                        "{order}"   
                    )
                """
                
        id = db_execute(sql)
        return id
        #print(sql)
        
        
    def find_attribute_id(self, accessor):
        sql = f"""SELECT {DBTableFields.ATTRIBUTE_ID}
                    FROM {DBTableName.ATTRIBUTES} 
                    WHERE {DBTableFields.ATTRIBUTE_ACCESSOR}="{accessor}"
                """
        rows = db_query(sql)
        if rows:
            for row in rows:
                return row[DBTableFields.ATTRIBUTE_ID]
        else:
            return None
        
        
        
    
class Excel():
    def __init__(self, file_path):
        
        self.path = file_path
    
    def get_headers(self, sheet_name=None):
        try:
            if sheet_name:
                df = pd.read_excel(self.path, sheet_name=sheet_name)
            else:
                df = pd.read_excel(self.path)
            
            headers = df.columns.tolist()
            return headers
        except Exception as e:
            return None, str(e)
        
    def read_excel_file_by_header(self, sheet_name,  headers):
        try:
            df = pd.read_excel(self.path, sheet_name)
            selected_columns = df[headers]
            return selected_columns
        except Exception as e:
            return None, str(e)
        
    def excel_to_dict(self, sheet_name=None):
        try:
            if sheet_name:
                df = pd.read_excel(self.path, sheet_name=sheet_name)
            else:
                df = pd.read_excel(self.path)
            
            data_dict = df.to_dict(orient='records')
            return data_dict
        except Exception as e:
            return None, str(e)
      
        
def add_admin(email, password):
    sql = f"""INSERT INTO {DBTableName.EMPLOYEES} 
                ({DBTableFields.EMAIL}, {DBTableFields.PASSWORD}) 
            VALUES ("{email}", "{password}")
            """
    id = db_execute(sql)
    return id

def add_roles(employee_id, role_id):
    sql = f"""INSERT INTO {DBTableName.EMPLOYEE_ROLE} 
                ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.ROLE_ID})  
            VALUES ("{employee_id}", "{role_id}")
            """
    id = db_execute(sql)

        
        
def convert_to_accessor_key(items):
    results = {}
    for item in items:
        accessor = item[ExcelKeys.ACCESSOR]
        results[accessor] = item
    return results

def convert_to_excel_name_key(items):
    results = {}
    for item in items:
        accessor = item[ExcelKeys.EXCEL_HEADER]
        results[accessor] = item
    return results

def  find_employee(email):
    sql = f"""SELECT {DBTableFields.EMPLOYEE_ID}
                    FROM {DBTableName.EMPLOYEES} 
                    WHERE {DBTableFields.EMAIL}="{email}"
                """
    rows = db_query(sql)
    if rows:
        return rows[0][DBTableFields.EMPLOYEE_ID]
    else:
        return None
    
def add_employee(email):
    sql = f"""INSERT INTO {DBTableName.EMPLOYEES} 
                ({DBTableFields.EMAIL}) 
            VALUES ("{email}")
            """
    id = db_execute(sql)
    return id
    
def find_attr_id(attr_accessor):
    sql = f"""SELECT {DBTableFields.ATTRIBUTE_ID}
                    FROM {DBTableName.ATTRIBUTES} 
                    WHERE {DBTableFields.ATTRIBUTE_ACCESSOR}="{attr_accessor}"
                """
    rows = db_query(sql)
    if rows:
        return rows[0][DBTableFields.ATTRIBUTE_ID]
    else:
        return None

def find_employee_value_id(employee_id, attr_id):
    sql = f"""SELECT {DBTableFields.ATTRIBUTE_VALUE_ID}
                    FROM {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES} 
                    WHERE {DBTableFields.EMPLOYEE_ID}="{employee_id}" AND {DBTableFields.ATTRIBUTE_ID}="{attr_id}"
                """
    rows = db_query(sql)
    if rows:
        return rows[0][DBTableFields.ATTRIBUTE_VALUE_ID]
    else:
        return None
    
def add_attribute_value( value):
    sql = f"""INSERT INTO {DBTableName.ATTRIBUTE_VALUES} 
                ({DBTableFields.ATTRIBUTE_VALUE}) 
            VALUES ("{value}")
            """
    id = db_execute(sql)
    return id

def update_attribute_value( value_id, value):
    sql = f"""UPDATE {DBTableName.ATTRIBUTE_VALUES} 
                SET {DBTableFields.ATTRIBUTE_VALUE} = "{value}"
                WHERE {DBTableFields.ATTRIBUTE_VALUE_ID} ={value_id}
            """
    id = db_execute(sql)
    return id

def add_employee_attribute_value( employee_id, attribute_id, value_id):
    sql = f"""INSERT INTO {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES} 
                ({DBTableFields.EMPLOYEE_ID}, {DBTableFields.ATTRIBUTE_ID}, {DBTableFields.ATTRIBUTE_VALUE_ID}) 
            VALUES ("{employee_id}", "{attribute_id}", "{value_id}" )
            """
    id = db_execute(sql)
    return id
   
   
def add_assignment(employee_id, method_id, supervisor_id):
    sql = f"""INSERT INTO {DBTableName.ASSIGNED} 
                ({DBTableFields.SUBORDINATE_ID}, {DBTableFields.METHOD_ID}, {DBTableFields.SUPERVISOR_ID}) 
            VALUES ("{employee_id}", "{method_id}", "{supervisor_id}" )
            """
    id = db_execute(sql)
    return id

def find_employee_id_by_name(employee_name):
    sql = f"""SELECT {DBTableFields.EMPLOYEE_ID}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} 
                    WHERE full_name="{employee_name}"
                """
    rows = db_query(sql)
    if rows:
        return rows[0][DBTableFields.EMPLOYEE_ID]
    else:
        return None

excel_path = "./Staff_data_sample.xlsx"
group_sheet = "Groups"
attribute_sheet = "Attributes"
data_sheet = "Employees"

# Handle code add/update group
grp_object = Group()

attr_object = Attribute()

excel_object = Excel(excel_path)


db_groups = grp_object.get_groups()
excel_groups = excel_object.excel_to_dict(group_sheet)


# ADD GROUP
for obj in excel_groups:
    item_update = {}
    for db_obj in db_groups:
        if obj[ExcelKeys.ACCESSOR] == db_obj[DBTableFields.GROUP_ACCESSOR]:
            item_update = db_obj
            break
    if (item_update):
        
        grp_object.update_group(item_update[DBTableFields.GROUP_ID], obj[ExcelKeys.DISPLAY], obj[ExcelKeys.ACCESSOR], obj[ExcelKeys.GROUP_ORDER], obj[ExcelKeys.DESCRIPTION], obj[ExcelKeys.SHOW_ON_PERSONAL_DETAILS], obj[ExcelKeys.SHOW_ON_REPORT_ANALYSIS])
    else:
        grp_object.add_group( obj[ExcelKeys.DISPLAY], obj[ExcelKeys.ACCESSOR], obj[ExcelKeys.GROUP_ORDER], obj[ExcelKeys.DESCRIPTION], obj[ExcelKeys.SHOW_ON_PERSONAL_DETAILS], obj[ExcelKeys.SHOW_ON_REPORT_ANALYSIS])
        


list_db_attributes = attr_object.get_attributes()
list_excel_attributes = excel_object.excel_to_dict(attribute_sheet)
dict_excel_accessor_attributes = convert_to_accessor_key(list_excel_attributes)


for dict_excel_attr in list_excel_attributes:
    excel_accessor_key = dict_excel_attr[ExcelKeys.ACCESSOR]
    
    print(f"Process the attribute {excel_accessor_key}")
    is_modified = False
    for dict_db_attr in list_db_attributes:
        db_accessor_key = dict_db_attr[DBTableFields.ATTRIBUTE_ACCESSOR]
        if excel_accessor_key == db_accessor_key :
            is_modified = True
            
            # All attribute as the same between excel and database
            if (dict_db_attr[DBTableFields.ATTRIBUTE_NAME] == dict_excel_attr[ExcelKeys.DISPLAY] and \
                dict_db_attr[DBTableFields.ATTRIBUTE_TYPE] == dict_excel_attr[ExcelKeys.DATA_TYPE] and \
                dict_db_attr[DBTableFields.ATTRIBUTE_REQUIRED] == dict_excel_attr[ExcelKeys.REQUIRED_FIELD] and \
                dict_db_attr[DBTableFields.ATTRIBUTE_DESCRIPTION] == dict_excel_attr[ExcelKeys.DESCRIPTION] and \
                dict_db_attr[DBTableFields.SHOW_ON_EMPLOYEE_TABLE] == dict_excel_attr[ExcelKeys.SHOW_ON_EMPLOYEE_TABLE] and \
                dict_db_attr[DBTableFields.SHOW_ON_ADD_EMPLOYEE_MODAL] == dict_excel_attr[ExcelKeys.SHOW_ON_ADD_EMPLOYEE_MODAL] and \
                dict_db_attr[DBTableFields.ATTRIBUTE_ORDER] == dict_excel_attr[ExcelKeys.ATTRIBUTE_ORDER_IN_GROUP]):
                
                pass
            # Update attribute in the database
            else:
                attr_object.update_attribute( dict_db_attr[DBTableFields.ATTRIBUTE_ID],\
                                        dict_excel_attr[ExcelKeys.DISPLAY],\
                                        dict_excel_attr[ExcelKeys.DATA_TYPE],\
                                        dict_excel_attr[ExcelKeys.REQUIRED_FIELD],\
                                        dict_excel_attr[ExcelKeys.DESCRIPTION],\
                                        dict_excel_attr[ExcelKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                        dict_excel_attr[ExcelKeys.SHOW_ON_ADD_EMPLOYEE_MODAL],\
                                        dict_excel_attr[ExcelKeys.ATTRIBUTE_ORDER_IN_GROUP]
                                        )
                
            
            # Update group attributes  if difference        
            if dict_db_attr[DBTableFields.GROUP_NAME] != dict_excel_attr[ExcelKeys.GROUP]:
                db_grp_id = grp_object.find_group_id(dict_db_attr[DBTableFields.GROUP_NAME])
                
                excel_grp_id = grp_object.find_group_id(dict_excel_attr[ExcelKeys.GROUP])
                
                grp_object.update_group_atrtibute_mapping(db_grp_id, dict_db_attr[DBTableFields.ATTRIBUTE_ID], excel_grp_id )

            break
    
    if not is_modified:
        # Add new attribute from excel to the database
        attr_id = attr_object.add_attribute(dict_excel_attr[ExcelKeys.DISPLAY],\
                                dict_excel_attr[ExcelKeys.DATA_TYPE],\
                                dict_excel_attr[ExcelKeys.REQUIRED_FIELD],\
                                dict_excel_attr[ExcelKeys.DESCRIPTION],\
                                dict_excel_attr[ExcelKeys.ACCESSOR],\
                                dict_excel_attr[ExcelKeys.SHOW_ON_EMPLOYEE_TABLE],\
                                dict_excel_attr[ExcelKeys.SHOW_ON_ADD_EMPLOYEE_MODAL],\
                                dict_excel_attr[ExcelKeys.ATTRIBUTE_ORDER_IN_GROUP]
                                )
        
        excel_grp_id = grp_object.find_group_id(dict_excel_attr[ExcelKeys.GROUP])
        grp_object.add_group_atrtibute_mapping( excel_grp_id, attr_id )
        
        
        


# Convert list of dict excel key to the dict with key is excel header 
dict_attribute_by_excel_header = convert_to_excel_name_key(list_excel_attributes)

excel_row_data = excel_object.excel_to_dict(data_sheet)
# Show up attribute not define in group sheet
for it in excel_row_data[0]:
    if  it not in dict_attribute_by_excel_header:
        print(f"This's an attribute {it} not define in the Groups sheet ")
        



import numpy as np 
from unidecode import unidecode
import math

# get all attributes from the databases after add/update from excel 
list_db_attributes = attr_object.get_attributes()


index = 0

dict_id = {}

dict_report = {}

for row in excel_row_data:
    # Replace FistName, MiddleName, LastName  for the row dict

    index +=1
    print(f"{index}/{len(excel_row_data)} - {row['Full name']}" )

    
    # Find employee in the database
    employee_id = find_employee(row['Email'])

    # Add employee to the database if not found
    if employee_id is None:
        employee_id = add_employee(row['Email'])
        add_roles(employee_id, 4)
        
        
        
            
        
    for attribute in list_db_attributes:
        attr_id = attribute[DBTableFields.ATTRIBUTE_ID]
        attr_accessor = attribute[DBTableFields.ATTRIBUTE_ACCESSOR]
        
        # Find the attribute value for the current employee
        employee_value_id = find_employee_value_id(employee_id, attr_id)
        
        # handle case employee have a attribute value 
        if (employee_value_id):
            # Get the attribute excel header 
            excel_header = dict_excel_accessor_attributes[attr_accessor]['Excel Header']
            
            # retrieve the value of attribute from excel file by header is excel key
            attr_value = row[excel_header]
            
            if type(attr_value) == type(row['From']):
                attr_value = attr_value.strftime('%Y-%m-%d')
                
            if type(attr_value) == type(float('nan')) and  math.isnan(attr_value):
                attr_value = ""
                
                
            
            # Update the value of attribute
            attr_value_id = update_attribute_value(employee_value_id, attr_value)
            
            
    
        else: 
            # Handle case employee not  exist attribute value
            excel_header = dict_excel_accessor_attributes[attr_accessor]['Excel Header']
            attr_value = row[excel_header]
            
            if type(attr_value) == type(row['From']):
                attr_value = attr_value.strftime('%Y-%m-%d')
                
            if type(attr_value) == type(float('nan')) and  math.isnan(attr_value):
                attr_value = ""
                
            # Add new attribute value for the employee 
            attr_value_id = add_attribute_value(attr_value)
            
            
            # Add mapping key employee_id -> attribute_id -> attribute_value_id
            employee_attribute_value_id = add_employee_attribute_value(employee_id, attr_id, attr_value_id)

    

    # Add report to        
    
    dict_id[row['Full name']] = employee_id
    
    manager_name = row['Manager']
    dict_report[employee_id] = manager_name
        
        
        
        
for employee_id in dict_report:
    manage_name = dict_report[employee_id]
    if manage_name in dict_id and dict_id[manage_name]:
        supervisor_id = dict_id[manage_name]
        if (supervisor_id):
            add_assignment(employee_id, 1,  supervisor_id)
        
    

               
                
                
                    
            
                    

        
        


        
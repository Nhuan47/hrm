from src.common.db_enum import DBTableName, DBTableFields, DBViewName
from src.common.enum import CommonKeys


class ReportAnalyticModel():
    def __init__():
        pass
    
    def get_reports(self,  user_id, folder_id=None,):
        
        if(folder_id is not None):
            conditions = f" WHERE {DBTableName.REPORTS}.{DBTableFields.CREATED_BY} = {user_id}  AND {DBTableName.REPORT_FOLDERS}.{DBTableFields.FOLDER_ID} = {folder_id} "
        else:
            conditions = f" WHERE {DBTableName.REPORTS}.{DBTableFields.CREATED_BY} = {user_id} OR {DBTableName.REPORTS}.{DBTableFields.IS_PUBLIC} = 1 "
            
        
        sql = f"""
                    SELECT 
                        {DBTableName.FOLDERS}.{DBTableFields.FOLDER_ID},
                        {DBTableName.FOLDERS}.{DBTableFields.FOLDER_NAME},
                        {DBTableName.REPORTS}.{DBTableFields.REPORT_ID},
                        {DBTableName.REPORTS}.{DBTableFields.REPORT_NAME}                    
                    FROM {DBTableName.REPORT_FOLDERS}
                    INNER JOIN {DBTableName.FOLDERS} ON {DBTableName.FOLDERS}.{DBTableFields.FOLDER_ID} = {DBTableName.REPORT_FOLDERS}.{DBTableFields.FOLDER_ID}
                    INNER JOIN {DBTableName.REPORTS} ON {DBTableName.REPORTS}.{DBTableFields.REPORT_ID} = {DBTableName.REPORT_FOLDERS}.{DBTableFields.REPORT_ID}
                    
                    {conditions}
                """
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                item = {}                       
                item['id'] = row[DBTableFields.REPORT_ID]
                item['name'] = row[DBTableFields.REPORT_NAME]
                item['folderId'] = row[DBTableFields.FOLDER_ID]
                
                out.append(item)
               
        return out
    
    def add_folder(self, folder_name):
        sql =  f"""INSERT INTO {DBTableName.FOLDERS} 
                        ({DBTableFields.FOLDER_NAME})
                    VALUES 
                        ("{folder_name}")
                """
        id = self.db_execute_return_id(sql)
        return id
    
    
    def update_folder(self, folder_id, folder_name):
        sql =  f"""UPDATE {DBTableName.FOLDERS} 
                    SET {DBTableFields.FOLDER_NAME} = "{folder_name}"
                    WHERE  {DBTableFields.FOLDER_ID} = {folder_id}

                """
        self.db_execute(sql)
    

    
    
    def delete_folder(self, folder_id):
        sql =  f"""DELETE FROM {DBTableName.FOLDERS} 
                   WHERE {DBTableFields.FOLDER_ID} = {folder_id}
                """
        self.db_execute(sql)
        
        
                

    def get_group_attribute_values(self):
        sql = f"""
                    SELECT 
                        {DBTableFields.GROUP_ID},
                        {DBTableFields.GROUP_NAME},
                        {DBTableFields.GROUP_ACCESSOR},
                        {DBTableFields.GROUP_ORDER},
                        {DBTableFields.ATTRIBUTE_ID},
                        {DBTableFields.ATTRIBUTE_NAME},
                        {DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableFields.ATTRIBUTE_VALUE_ID},
                        {DBTableFields.ATTRIBUTE_VALUE}
                    FROM {DBViewName.VIEW_GROUP_ATTRIBUTE_VALUE}
                """

        rows = self.db_query(sql)
        output = {}
        if (rows):
            for row in rows:
                group_accessor = row[DBTableFields.GROUP_ACCESSOR]
                attribute_accessor = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                
                try:
                    tmp = output[group_accessor]
                except KeyError:
                    output[group_accessor] = {}
                    output[group_accessor]['id'] = row[DBTableFields.GROUP_ID]
                    output[group_accessor]['name'] = row[DBTableFields.GROUP_NAME]
                    output[group_accessor]['accessor'] = row[DBTableFields.GROUP_ACCESSOR]
                    output[group_accessor]['order'] = row[DBTableFields.GROUP_ORDER]
                    output[group_accessor]['attributes'] = {}
                    
                try:
                    tmp1 = output[group_accessor]['attributes'][attribute_accessor]
                except KeyError:
                    output[group_accessor]['attributes'][attribute_accessor] = {}
                    output[group_accessor]['attributes'][attribute_accessor]['id'] = row[DBTableFields.ATTRIBUTE_ID]
                    output[group_accessor]['attributes'][attribute_accessor]['name'] = row[DBTableFields.ATTRIBUTE_NAME]
                    output[group_accessor]['attributes'][attribute_accessor]['accessor'] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                    output[group_accessor]['attributes'][attribute_accessor]['order'] = row[DBTableFields.ATTRIBUTE_ORDER]
                    output[group_accessor]['attributes'][attribute_accessor]['values'] = []
                
                value = row[DBTableFields.ATTRIBUTE_VALUE]
                
                if value and value not in output[group_accessor]['attributes'][attribute_accessor]['values']:
                    output[group_accessor]['attributes'][attribute_accessor]['values'].append(value)
                    
        return output

                    
        
    def get_folders(self):
        sql     = f"""
                    SELECT 
                        {DBTableFields.FOLDER_ID},
                        {DBTableFields.FOLDER_NAME}
                    FROM {DBTableName.FOLDERS}
                """
        out = []
        rows = self.db_query(sql)
        if rows:
            for row in rows:
                out.append({
                    "id": row[DBTableFields.FOLDER_ID],
                    "name": row[DBTableFields.FOLDER_NAME],
                })
        return out
    
    def add_report(self, report_name):
        sql = f"""
                INSERT INTO {DBTableName.REPORTS}
                    ({DBTableFields.REPORT_NAME})
                VALUES ("{report_name}")
                """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_report(self, report_id,  report_name):
        sql = f"""
                UPDATE {DBTableName.REPORTS}
                SET {DBTableFields.REPORT_NAME} = "{report_name}"
                WHERE {DBTableFields.REPORT_ID} = {report_id} 
                AND  {DBTableFields.REPORT_NAME} != "{report_name}"
                """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def public_report(self, report_id,  is_public):
        sql = f"""
                UPDATE {DBTableName.REPORTS}
                SET {DBTableFields.IS_PUBLIC} = {is_public}
                WHERE {DBTableFields.REPORT_ID} = {report_id}
                """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    
                
    def add_report_into_folder(self, folder_id, report_id):
        sql = f"""
                INSERT INTO {DBTableName.REPORT_FOLDERS}
                    ({DBTableFields.FOLDER_ID}, {DBTableFields.REPORT_ID})
                VALUES ({folder_id}, {report_id})
                """
        print(sql)
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def delete_report_in_folder(self, folder_id, report_id):
        sql = f"""
                DELETE FROM {DBTableName.REPORT_FOLDERS}
                WHERE {DBTableFields.FOLDER_ID} = {folder_id} 
                AND {DBTableFields.REPORT_ID} = {report_id}                
                """

        self.db_execute(sql)
        
    def delete_report_filter_field(self, report_id):
        sql = f"""
                DELETE FROM  {DBTableName.REPORT_FILTER_FIELDS} 
                WHERE {DBTableFields.REPORT_ID} = {report_id}                
                """
        self.db_execute(sql)
        
    def delete_report_display_field(self, report_id):
        sql = f"""
                DELETE FROM {DBTableName.REPORT_DISPLAY_FIELDS}
                WHERE {DBTableFields.REPORT_ID} = {report_id}                
                """
        self.db_execute(sql)

    
    
    
    def add_report_filter_field(self, report_id, attribute_id, value=None):
        if (value):
            sql =   f"""INSERT INTO {DBTableName.REPORT_FILTER_FIELDS}
                        ({DBTableFields.REPORT_ID}, {DBTableFields.ATTRIBUTE_ID}, {DBTableFields.ATTRIBUTE_VALUE})
                        VALUES ({report_id}, {attribute_id}, "{value}")
                    """
        else: 
            sql =   f"""INSERT INTO {DBTableName.REPORT_FILTER_FIELDS}
                        ({DBTableFields.REPORT_ID}, {DBTableFields.ATTRIBUTE_ID})
                        VALUES ({report_id}, {attribute_id})
                    """
        print(sql)
        self.db_execute(sql)
        
    def add_report_display_field(self, report_id, attribute_id):
        sql = f"""INSERT INTO {DBTableName.REPORT_DISPLAY_FIELDS}
                    ({DBTableFields.REPORT_ID}, {DBTableFields.ATTRIBUTE_ID})
                    VALUES ({report_id}, {attribute_id})
               """
        print(sql)
        self.db_execute(sql)
        
        
    def get_report_filter_selected(self, report_id):
        
        
        sql =  f"""
                    SELECT 
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.ATTRIBUTE_VALUE} 
                    FROM {DBTableName.REPORT_FILTER_FIELDS} 
                    INNER JOIN `{DBTableName.ATTRIBUTES}` ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} =  {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                    ORDER BY {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}

                """
        out = {}
        rows = self.db_query(sql)
        if (rows):
            for row in rows:
                attr_accesor = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                attr_value = row[DBTableFields.ATTRIBUTE_VALUE]
                
                try:
                    unused = out[attr_accesor]
                except KeyError:                
                    out[attr_accesor] = []
                    
                
                
                tmp =  {"label":attr_value, "value": attr_value}
                if tmp not in out[attr_accesor]:
                    if(attr_value):                
                        out[attr_accesor].append(tmp)
                
        return out
    
    
    def get_report_filters(self, report_id):
        
        sql =  f"""
                    SELECT 
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER},
                        {DBTableName.ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_VALUE}
                    FROM {DBTableName.REPORT_FILTER_FIELDS} 
                    INNER JOIN `{DBTableName.ATTRIBUTES}` ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} =  {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.ATTRIBUTE_ID}
                    INNER JOIN `{DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}` ON {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_ID} =  {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.ATTRIBUTE_ID}
                    INNER JOIN `{DBTableName.ATTRIBUTE_VALUES}` ON {DBTableName.ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_VALUE_ID} =  {DBTableName.EMPLOYEE_ATTRIBUTE_VALUES}.{DBTableFields.ATTRIBUTE_VALUE_ID}
                    WHERE {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                    ORDER BY {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}

                """
        out = {}
        print(sql)
        rows = self.db_query(sql)
        if (rows):
            for row in rows:
                attr_accesor = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                attr_value = row[DBTableFields.ATTRIBUTE_VALUE]                
                try:
                    unused = out[attr_accesor]
                except KeyError:
                    out[attr_accesor] = []
                
                if attr_value:
                    tmp = {"label":attr_value, "value": attr_value}
                    if tmp not in out[attr_accesor]:
                        out[attr_accesor].append(tmp)
        return out
    
    def get_report_table_columns(self, report_id):
        sql =  f"""
                    SELECT 
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                        {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                    FROM {DBTableName.REPORT_DISPLAY_FIELDS}
                    INNER JOIN {DBTableName.ATTRIBUTES} 
                    ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.REPORT_DISPLAY_FIELDS}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.REPORT_DISPLAY_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                    ORDER BY {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                """
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
               out.append({
                   "id": row[DBTableFields.ATTRIBUTE_ID],
                   "name": row[DBTableFields.ATTRIBUTE_NAME],
                   "accessor": row[DBTableFields.ATTRIBUTE_ACCESSOR],
                   "order": row[DBTableFields.ATTRIBUTE_ORDER],
               }) 
               
        return out
    
    def get_report_table_rows(self, cols, filters, attr_mapping, is_get_by_name = None):
        list_cols = [x["accessor"] for x in cols if cols ]
        str_cols = ", ".join(list_cols) if list_cols else ""
        
        list_filters = []
        for filter_key in filters:
                
            if int(filter_key) in attr_mapping:

                att_accessor = attr_mapping[int(filter_key)] 

                filter_items = []
                for val in filters[filter_key]:
                    if val['value']:
                        filter_items.append(f'''{att_accessor}="{val['value']}"''')
                if filter_items:
                    tmp = f'''({" OR ".join(filter_items)})'''
                    list_filters.append(tmp)
                
        where_conditions = ""
        if len(list_filters):      
            str_filters = " AND ".join(list_filters)
            where_conditions = f"WHERE {str_filters}"

        
        sql =  f"""
                    SELECT 
                       {str_cols}
                    FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}                   
                    {where_conditions}

                """
        print(sql)
        rows = self.db_query(sql)
        
        out = []
        if rows:
            for row in rows:
                item = {}
                
                if not is_get_by_name:
                    for col in list_cols:
                        item[col] = row[col]
                else:
                    for col in cols:
                        item[col['name']] = row[col['accessor']]
                out.append(item )                
        return out
            
    def get_report_field_list(self, report_id):
            sql =  f"""
                        SELECT 
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_NAME},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR},
                            {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                        FROM {DBTableName.REPORT_DISPLAY_FIELDS}
                        INNER JOIN {DBTableName.ATTRIBUTES} 
                        ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.REPORT_DISPLAY_FIELDS}.{DBTableFields.ATTRIBUTE_ID}
                        WHERE {DBTableName.REPORT_DISPLAY_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                        ORDER BY {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ORDER}
                    """
            rows = self.db_query(sql)
            out = []
            if rows:
                for row in rows:
                    out.append({

                        "label": row[DBTableFields.ATTRIBUTE_NAME],
                        "value": row[DBTableFields.ATTRIBUTE_ID],            
                    }) 
                
            return out
            
    def add_report_chart_type(self, report_id, chart_type):
        sql =  f"""
                    INSERT INTO {DBTableName.REPORT_CHART_TYPE}
                        ({DBTableFields.REPORT_ID}, {DBTableFields.CHART_TYPE}) 
                    VALUES
                        ({report_id}, "{chart_type}")
                """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    
    def update_chart_type(self, report_id, chart_type):
        sql =  f"""
                    UPDATE {DBTableName.REPORT_CHART_TYPE}
                    SET {DBTableFields.CHART_TYPE} = "{chart_type}"
                    WHERE {DBTableFields.REPORT_ID} = {report_id} 
                """
        self.db_execute(sql)
        

    def get_report_base_info(self, report_id):
        sql =  f"""
                    SELECT 
                        `{DBTableName.REPORTS}`.`{DBTableFields.REPORT_ID}`,
                        `{DBTableName.REPORTS}`.`{DBTableFields.REPORT_NAME}`,
                        `{DBTableName.REPORTS}`.`{DBTableFields.IS_PUBLIC}`,
                        `{DBTableName.FOLDERS}`.`{DBTableFields.FOLDER_ID}`,
                        `{DBTableName.FOLDERS}`.`{DBTableFields.FOLDER_NAME}` 
                    FROM {DBTableName.REPORT_FOLDERS}  
                    INNER JOIN {DBTableName.FOLDERS} ON {DBTableName.FOLDERS}.{DBTableFields.FOLDER_ID} = {DBTableName.REPORT_FOLDERS}.{DBTableFields.FOLDER_ID} 
                    INNER JOIN {DBTableName.REPORTS} ON {DBTableName.REPORTS}.{DBTableFields.REPORT_ID} = {DBTableName.REPORT_FOLDERS}.{DBTableFields.REPORT_ID} 
                    WHERE  {DBTableName.REPORT_FOLDERS}.{DBTableFields.REPORT_ID} = {report_id}
                """
        rows = self.db_query(sql)
        out = {}
        if (rows):
            for row in rows:
                 out[CommonKeys.ID] = row[DBTableFields.REPORT_ID]
                 out[CommonKeys.NAME] = row[DBTableFields.REPORT_NAME]
                 out['isPublic'] = row[DBTableFields.IS_PUBLIC]
                 out['folderId'] = row[DBTableFields.FOLDER_ID]
                 out['folderName'] = row[DBTableFields.FOLDER_NAME]
        return out
    
    def get_report_selected_filter_fields(self, report_id):
        sql =  f"""
                    SELECT 
                        `{DBTableName.REPORT_FILTER_FIELDS}`.`{DBTableFields.ATTRIBUTE_ID}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_ACCESSOR}`,
                        `{DBTableName.REPORT_FILTER_FIELDS}`.`{DBTableFields.ATTRIBUTE_VALUE}`                  
                    FROM {DBTableName.REPORT_FILTER_FIELDS}  
                    INNER JOIN   {DBTableName.ATTRIBUTES} ON {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} =      {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.ATTRIBUTE_ID}             
                    WHERE  {DBTableName.REPORT_FILTER_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                """
        out = {}
        rows = self.db_query(sql)
        if (rows):
            for row in rows:
                att_id = row[DBTableFields.ATTRIBUTE_ID]
                try:
                    tmp = out[att_id]
                except KeyError:
                    out[att_id] = []
                if (row[DBTableFields.ATTRIBUTE_VALUE]):

                    attr_value = {
                        "label":  row[DBTableFields.ATTRIBUTE_VALUE],
                        "value":  row[DBTableFields.ATTRIBUTE_VALUE]
                    }
                    
                    if attr_value not in out[att_id]:
                        out[att_id].append(attr_value)
                
        return out
                
    def get_report_selected_display_fields(self, report_id):
        sql =  f"""
                    SELECT 
                        `{DBTableName.REPORT_DISPLAY_FIELDS}`.`{DBTableFields.ATTRIBUTE_ID}`
                    FROM {DBTableName.REPORT_DISPLAY_FIELDS}                     
                    WHERE  {DBTableName.REPORT_DISPLAY_FIELDS}.{DBTableFields.REPORT_ID} = {report_id}
                """
        out = []
        rows = self.db_query(sql)
        if (rows):
            for row in rows:
                 out.append( row[DBTableFields.ATTRIBUTE_ID])                 
        return out 
    
    
       
    def get_report_chart_type(self, report_id):
        sql =  f"""
                    SELECT 
                        `{DBTableName.REPORT_CHART_TYPE}`.`{DBTableFields.CHART_TYPE}`
                    FROM {DBTableName.REPORT_CHART_TYPE}                     
                    WHERE  {DBTableName.REPORT_CHART_TYPE}.{DBTableFields.REPORT_ID} = {report_id}
                """

        rows = self.db_query(sql)
        if (rows):
            return rows[0][DBTableFields.CHART_TYPE]               
        return None     

    def get_available_display_groups(self):
        sql =  f"""
                    SELECT 
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_ID}`,
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_NAME}`,
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_ACCESSOR}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_ID}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_ACCESSOR}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_NAME}`
                    FROM {DBTableName.GROUP_ATTRIBUTES}
                    INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID} = {DBTableName.GROUPS}.{DBTableFields.GROUP_ID}
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.GROUPS}.{DBTableFields.SHOW_ON_REPORT_ANALYSIS} = 1
                    AND {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ACCESSOR} != "{DBTableFields.IMAGE_URL}"
                """
        rows = self.db_query(sql)
        dict_group = {}
        if rows:
            for row in rows:
                group_accessor = row[DBTableFields.GROUP_ACCESSOR]
                
                try:
                    tmp =dict_group[group_accessor]
                except KeyError:
                    dict_group[group_accessor] =  {}
                    dict_group[group_accessor]['id'] =  row[DBTableFields.GROUP_ID]
                    dict_group[group_accessor]['name']  = row[DBTableFields.GROUP_NAME]
                    dict_group[group_accessor]['accessor']  = row[DBTableFields.GROUP_ACCESSOR]
                    dict_group[group_accessor]['fields']=  []
                    
                field =  {
                    "id": row[DBTableFields.ATTRIBUTE_ID],
                    "name": row[DBTableFields.ATTRIBUTE_NAME],
                    "accessor": row[DBTableFields.ATTRIBUTE_ACCESSOR],
                    "canGroupBy": 1,
                    "selectedByDefault": 0
                }
                
                if (field not in dict_group[group_accessor]['fields']):
                    dict_group[group_accessor]['fields'].append(field)
        return dict_group
    
    def get_available_filter_groups(self):
        sql =  f"""
                    SELECT 
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_ID}`,
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_NAME}`,
                        `{DBTableName.GROUPS}`.`{DBTableFields.GROUP_ACCESSOR}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_ID}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_ACCESSOR}`,
                        `{DBTableName.ATTRIBUTES}`.`{DBTableFields.ATTRIBUTE_NAME}`
                    FROM {DBTableName.GROUP_ATTRIBUTES}
                    INNER JOIN {DBTableName.GROUPS} ON {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.GROUP_ID} = {DBTableName.GROUPS}.{DBTableFields.GROUP_ID}
                    INNER JOIN {DBTableName.ATTRIBUTES} ON {DBTableName.GROUP_ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID} = {DBTableName.ATTRIBUTES}.{DBTableFields.ATTRIBUTE_ID}
                    WHERE {DBTableName.GROUPS}.{DBTableFields.SHOW_ON_REPORT_ANALYSIS} = 1
                """
        rows = self.db_query(sql)
        dict_group = {}
        if rows:
            for row in rows:
                group_accessor = row[DBTableFields.GROUP_ACCESSOR]
                
                try:
                    tmp =dict_group[group_accessor]
                except KeyError:
                    dict_group[group_accessor] =  {}
                    dict_group[group_accessor]['id'] =  row[DBTableFields.GROUP_ID]
                    dict_group[group_accessor]['name']  = row[DBTableFields.GROUP_NAME]
                    dict_group[group_accessor]['accessor']  = row[DBTableFields.GROUP_ACCESSOR]
                    
        return dict_group
    
    
                
    def get_available_filters(self):
        sql =  f"""
            SELECT 
                `{DBTableFields.GROUP_ID}`,
                `{DBTableFields.GROUP_NAME}`,
                `{DBTableFields.GROUP_ACCESSOR}`,
                `{DBTableFields.ATTRIBUTE_ID}`,
                `{DBTableFields.ATTRIBUTE_ACCESSOR}`,
                `{DBTableFields.ATTRIBUTE_NAME}`,
                `{DBTableFields.ATTRIBUTE_VALUE}`
            FROM {DBViewName.VIEW_GROUP_ATTRIBUTE_VALUE}
            WHERE  {DBTableFields.ATTRIBUTE_ACCESSOR} != "{DBTableFields.IMAGE_URL}"
            """
        rows = self.db_query(sql)
        dict_attributes = {}
        if rows:
            for row in rows:
                attr_accessor = row[DBTableFields.ATTRIBUTE_ACCESSOR]
                attr_value = row[DBTableFields.ATTRIBUTE_VALUE]
                try:
                    tmp =dict_attributes[attr_accessor]
                except KeyError:
                    dict_attributes[attr_accessor] = {}
                    
                try:
                    tmp =dict_attributes[attr_accessor]['groupId']
                except KeyError:
                    dict_attributes[attr_accessor]['groupId'] = row[DBTableFields.GROUP_ID]
                    
                try:
                    tmp =dict_attributes[attr_accessor]['id']
                except KeyError:
                    dict_attributes[attr_accessor]['id'] = row[DBTableFields.ATTRIBUTE_ID]
                
                try:
                    tmp =dict_attributes[attr_accessor]['name']
                except KeyError:
                    dict_attributes[attr_accessor]['name'] = row[DBTableFields.ATTRIBUTE_NAME]
                    
                try:
                    tmp =dict_attributes[attr_accessor]['choices']
                except KeyError:
                    dict_attributes[attr_accessor]['choices'] = []
                    
                if(attr_value):
                    attr_option = {"label": attr_value, "value": attr_value}
                    if attr_option not in dict_attributes[attr_accessor]['choices']:
                        dict_attributes[attr_accessor]['choices'].append(attr_option)
        return dict_attributes
                
                
    def get_modules(self):
        sql =  f"""
                    SELECT {DBTableFields.REPORT_ID}, {DBTableFields.REPORT_NAME} 
                    FROM {DBTableName.REPORTS} 
                """
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                out.append(row[DBTableFields.REPORT_NAME])
        return out
    
    
    # Handle  remove report 
    def delete_report_folder(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_FOLDERS} 
                  WHERE {DBTableFields.REPORT_ID} = {report_id} """
        self.db_execute(sql)
        
    # Handle  remove report 
    def delete_report_filter(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_FILTER_FIELDS} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
    
    # Handle  remove report 
    def delete_report_display(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_DISPLAY_FIELDS} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
    # Handle  remove report 
    def delete_report_chart(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_CHART_TYPE} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
        
    # Handle  remove report 
    def delete_report_group_by(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_GROUP_BY_FIELDS} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
    # Handle  remove report 
    def delete_report(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORTS} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
    def delete_chart(self, report_id):
        sql = f"""DELETE FROM {DBTableName.REPORT_CHART_TYPE} WHERE {DBTableFields.REPORT_ID} = {report_id}"""
        self.db_execute(sql)
        
    def get_attribute_mapping(self, list_attribute_id):
        
        list_conditions = [f"{DBTableFields.ATTRIBUTE_ID}={item}" for item in list_attribute_id ]
        if list_conditions:
            str_condition = " WHERE " + " OR ".join(list_conditions)
        else:
            str_condition = ""
        
        sql =  f"""
                    SELECT
                        {DBTableFields.ATTRIBUTE_ID},
                        {DBTableFields.ATTRIBUTE_ACCESSOR}
                    FROM {DBTableName.ATTRIBUTES}
                    {str_condition}                 
                """
                
        print(sql)
                
        rows = self.db_query(sql)
        out = {}
        if rows:
            for row in rows:
                out[row[DBTableFields.ATTRIBUTE_ID]] = row[DBTableFields.ATTRIBUTE_ACCESSOR]
        return out
    

    
    
    
    ############################################################
    # REPORT GROUP BY METHOD
    ############################################################
    
    def get_report_group_by_fields(self, report_id):
        sql =  f"""
                    SELECT 
                        {DBTableFields.REPORT_GROUP_BY_ID},
                        {DBTableFields.REPORT_ID},
                        {DBTableFields.ATTRIBUTE_ID},
                        {DBTableFields.GROUP_BY_TYPE}
                    FROM {DBTableName.REPORT_GROUP_BY_FIELDS}
                    WHERE {DBTableFields.REPORT_ID} = {report_id}
                    ORDER BY {DBTableFields.GROUP_BY_TYPE}
                """
        rows = self.db_query(sql)
        out = []
        if rows:
            for row in rows:
                out.append({
                    "id": row[DBTableFields.REPORT_GROUP_BY_ID],
                    "attributeId": row[DBTableFields.ATTRIBUTE_ID],
                    "type": row[DBTableFields.GROUP_BY_TYPE],
                })
        return out
    
    def add_report_group_by_field(self, report_id, attribute_id, group_by_type, order_number):
        sql =  f"""
                    INSERT INTO {DBTableName.REPORT_GROUP_BY_FIELDS}
                        ({DBTableFields.REPORT_ID}, {DBTableFields.ATTRIBUTE_ID}, {DBTableFields.GROUP_BY_TYPE}, {DBTableFields.GROUP_BY_ORDER}) 
                    VALUES
                        ({report_id}, "{attribute_id}", "{group_by_type}", "{order_number}")
                """
        new_id = self.db_execute_return_id(sql)
        return new_id
    
    def update_report_group_by_field(self,  report_group_by_id, report_id,  attribute_id, group_by_type, order_number):
        sql =  f"""
                    UPDATE {DBTableName.REPORT_GROUP_BY_FIELDS}
                    SET {DBTableFields.REPORT_ID} = {report_id},
                        {DBTableFields.ATTRIBUTE_ID} = {attribute_id},
                        {DBTableFields.GROUP_BY_TYPE} = "{group_by_type}",
                        {DBTableFields.GROUP_BY_ORDER} = "{order_number}"
                    WHERE {DBTableFields.REPORT_GROUP_BY_ID} = {report_group_by_id}
                   
                """
        self.db_execute(sql)
    
    def update_report_group_by_field_order(self,  report_group_by_id, order_number):
        sql =  f"""
                    UPDATE {DBTableName.REPORT_GROUP_BY_FIELDS}
                    SET {DBTableFields.GROUP_BY_ORDER} = {order_number}                       
                    WHERE {DBTableFields.REPORT_GROUP_BY_ID} = {report_group_by_id}
                   
                """
        self.db_execute(sql)
        
    def delete_report_group_by_field(self, report_group_by_id):
        sql =  f"""
                    DELETE FROM  {DBTableName.REPORT_GROUP_BY_FIELDS}                
                    WHERE {DBTableFields.REPORT_GROUP_BY_ID} = {report_group_by_id}                                   
                """
        print(sql)
        self.db_execute(sql)
        
    def delete_all_report_group_by_field_by_report_id(self, report_id):
        sql =  f"""
                    DELETE FROM {DBTableName.REPORT_GROUP_BY_FIELDS} 
                    WHERE {DBTableFields.REPORT_ID} = {report_id}
                """
        print(sql)
        self.db_execute(sql)
        
                
                    
                
                
        
                
                    
                
    
                
                
                
                
        
                    
                
            
    
    
from flask import request
from src.common.utils import group_data_by_field, handle_log, convert_to_pivot_table_records
from src.common.db_enum import DBTableName, DBTableFields, DBViewName

class ReportAnalyticController():
    def __init__(self,):
        pass
    
    def get_reports(self):
        current_user = request.current_user 
        user_id = current_user.get("user_id", None)
        
        data = self.model.get_reports(user_id=user_id)
        return data
    
    def delete_report(self, report_id):
        # delete report folders
        self.model.delete_report_folder(report_id)
        
        # delete report filters
        self.model.delete_report_filter(report_id)
        
        # delete retport  display
        self.model.delete_report_display(report_id)
        
        # delete report chart
        self.model.delete_report_chart(report_id)
        
        # delete report group by
        self.model.delete_report_group_by(report_id)
        
        # delete report 
        self.model.delete_report(report_id)
        
        return {"id": report_id}
    
    
    
    def get_group_attribute_values(self):
        data = self.model.get_group_attribute_values()
        return data
    
    def get_folders(self):
        data = self.model.get_folders()
        return data
    
    def add_folder(self, payload):
        folder_name = payload.get('folderName')
        folder_id = self.model.add_folder(folder_name)
        return {"id": folder_id, "name": folder_name}
    
    def update_folder(self, payload):
        folder_id = payload.get('id')
        folder_name = payload.get('folderName')
        self.model.update_folder(folder_id, folder_name)
        return {"id": folder_id, "name": folder_name}
    
    def delete_folder(self, folder_id):
        current_user = request.current_user 
        user_id = current_user.get("user_id", None)
        # get all report of current folder to delete
        list_reports = self.model.get_reports(user_id, folder_id=folder_id)
        for report in list_reports:
            self.delete_report(report['id'])
            
        self.model.delete_folder(folder_id)            
        return {"id": folder_id}
        
    
    
    def get_modules(self):
        data = self.model.get_modules()
        return data
        
        

    def add_definition(self, payload):


        report_name = payload.get('reportName')
        folder = payload.get('folder')
        folder_id = folder.get('value')
        
        filter_items = payload.get('filters')
        display_items = payload.get('display')
       
        # Add new report
        report_id = self.model.add_report(report_name)
        
        # Add report to folder
        self.model.add_report_into_folder(folder_id,report_id )
        
        # Add report filter
        for field_id in filter_items:
            if filter_items[field_id]:
                for field_value in filter_items[field_id]:
                    value = field_value.get("value")
                    self.model.add_report_filter_field(report_id, field_id, value)
            else:
                self.model.add_report_filter_field(report_id, field_id)
            
        # Add report display
        for attr_id in display_items:
            self.model.add_report_display_field(report_id, attr_id)

        return {"reportId": report_id}
    
    
    def update_report_definition(self, payload):


        report_id = payload.get("id")
        report_name = payload.get('reportName')
        folder = payload.get('folder')
        folder_id = folder.get('value')
        
        filter_items = payload.get('filters')
        display_items = payload.get('display')
       
        # Update report name if changed
        self.model.update_report(report_id, report_name)
        
        # Clean report folder
        self.model.delete_report_folder( report_id )
        
        # Add report to folder
        self.model.add_report_into_folder(folder_id,report_id )
        
        # Cleanup report filter
        self.model.delete_report_filter_field(report_id)
        
        # Add report filter
        for field_id in filter_items:
            if filter_items[field_id]:
                for field_value in filter_items[field_id]:
                    value = field_value.get("value")
                    self.model.add_report_filter_field(report_id, field_id, value)
            else:
                self.model.add_report_filter_field(report_id, field_id)
            
            
        # Cleanup report display
        self.model.delete_report_display_field(report_id)
        
        # Add report display
        for attr_id in display_items:
            self.model.add_report_display_field(report_id, attr_id)
            
        
         # Clean report group by 
        self.model.delete_all_report_group_by_field_by_report_id(report_id)
        
        # Clean chart 
        self.model.delete_chart(report_id)
        

        return {"reportId": report_id}
    
    def get_report_filter_selected(self, report_id):
        data = self.model.get_report_filter_selected(report_id)
        return data
    
    def get_report_filters(self, report_id):
        data = self.model.get_report_filters(report_id)
        return data
    
    def get_report_field_list(self, report_id):
        data = self.model.get_report_field_list(report_id)
        return data
    
    def get_report_table_rows(self, report_id, filters):
        cols = self.model.get_report_table_columns(report_id)
        
        list_attr_id = filters.keys()
        attr_mapping = self.model.get_attribute_mapping(list_attr_id)
        
        
        rows = self.model.get_report_table_rows(cols, filters, attr_mapping)
        
        return {"cols":cols, "rows":  rows }
    
    def save_report_group_by(self, report_id, payload):
        
        group_by_results = []
        
        # add/update report chart type
        chart_type = payload.get('chartType')          
        group_by_fields = payload.get('groupBy')
    
        # Check report chart already exists
        db_chart_type =  self.model.get_report_chart_type(report_id)
        if db_chart_type is None:
            self.model.add_report_chart_type(report_id, chart_type)
        else:

            if db_chart_type == chart_type:
                pass
            else:
                
                # Update chart_type
                self.model.update_chart_type(report_id, chart_type)
                
                if  db_chart_type == 'pivot' and chart_type == 'bar' or \
                    db_chart_type == 'pivot' and chart_type == 'pie' or \
                    db_chart_type == 'bar' and chart_type == 'pivot' or \
                    db_chart_type == 'pie' and chart_type == 'pivot': 
                                            
                    # Remove all group by if switch  bar/pie chart to pivot chart otherwise
                    self.model.delete_all_report_group_by_field_by_report_id(report_id)
                    
                                   
        # Get group by field of current chart in database
        db_group_by_fields = self.model.get_report_group_by_fields(report_id)

        axis_order = 0
        legend_order = 0
        group_order = 0
        if db_group_by_fields: #Update
                   
            if chart_type != 'pivot':   
                          
                # Cleanup record exist in database but not found in current form submit
                remove_items = [item for item in db_group_by_fields if str(item["id"]) not in  {other["id"] for other in group_by_fields}]
               
                for r_item in remove_items:
                    r_report_group_by_id = r_item["id"]
                    self.model.delete_report_group_by_field(r_report_group_by_id)
            else:
                
                # Cleanup record exist in database but not found in current form submit
                # Find dictionaries in list1 whose combination of 'attribute id' and 'type' is not present in list2
                remove_items = [item for item in db_group_by_fields if (item["attributeId"], item["type"]) not in {(int(other["attributeId"]), other["type"]) for other in group_by_fields}]

                for r_item in remove_items:
                    r_report_group_by_id = r_item["id"]
                    self.model.delete_report_group_by_field(r_report_group_by_id)

            for item in group_by_fields:
                      
                if chart_type != 'pivot':
                    
                    group_order+=1 
                    
                    # Find current item exist in db
                    db_item = [dict_item for dict_item in db_group_by_fields if str(dict_item["id"]) == item['id']]
                    
                    # If exist in db
                    if db_item:
                        db_attr_id = db_item[0]["attributeId"]
                        db_group_by_type = db_item[0]["type"]
                        
                        attr_id = item["attributeId"]
                        group_by_type = item['type']
                                                
                        # Compare current value between current form submit and value in the database
                        if(db_attr_id != attr_id or db_group_by_type != group_by_type):
                                                                    
                            # update record
                            report_group_by_id = db_item[0]["id"]
                            self.model.update_report_group_by_field(report_group_by_id, report_id, attr_id, group_by_type, group_order)
                            
                            group_by_results.append({
                                "id": report_group_by_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            })   
                                
                        else:
                            report_group_by_id = db_item[0]["id"]
                            self.model.update_report_group_by_field_order(report_group_by_id, group_order)    
                            group_by_results.append({
                                "id": report_group_by_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            })                                                                                            
                    else:                                                            
                        # Add new record
                        attr_id = item["attributeId"]
                        group_by_type = item['type']
                        new_id = self.model.add_report_group_by_field(report_id, attr_id, group_by_type, group_order)
                        group_by_results.append({
                            "id": new_id,
                            "attributeId": attr_id,
                            "type": group_by_type
                        })
                else:
                    group_by_type = item['type']  
                                      
                    # handle Axis record
                    if group_by_type == 'axis':
                        
                        axis_order+=1
                        
                        # Check current item already exist in database 
                        db_item = [db_it for db_it in  db_group_by_fields if db_it["attributeId"] == item['attributeId'] and db_it["type"] == item['type']] 
                        
                        if db_item:
                            # Update value order for axis field
                            report_group_by_id = db_item[0]["id"]
                            attr_id = db_item[0]["attributeId"]    
                                                  
                            self.model.update_report_group_by_field_order(report_group_by_id, axis_order)
                            group_by_results.append({
                                "id": report_group_by_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            })                                                   
                        else:
                            # Add new group by value for axis
                            attr_id = item['attributeId']
                            new_id = self.model.add_report_group_by_field(report_id, attr_id, group_by_type, axis_order)
                            
                            group_by_results.append({
                                "id": new_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            })  
                            
                    # handle Legend record
                    if group_by_type == 'legend':
                        
                        legend_order+=1
                        
                        # Check current item already exist in database 
                        db_item = [db_it for db_it in  db_group_by_fields if db_it["attributeId"] == item['attributeId'] and db_it["type"] == item['type']] 
                        
                        if db_item:
                            # Update value order for axis field
                            report_group_by_id = db_item[0]["id"]
                            attr_id = db_item[0]["attributeId"]
                                                             
                            self.model.update_report_group_by_field_order(report_group_by_id, legend_order)    
                            
                            group_by_results.append({
                                "id": report_group_by_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            }) 
                                                                                
                        else:
                            # Add new group by value for axis
                            attr_id = item['attributeId']                            
                            new_id = self.model.add_report_group_by_field(report_id, attr_id, group_by_type, legend_order)

                            group_by_results.append({
                                "id": new_id,
                                "attributeId": attr_id,
                                "type": group_by_type
                            }) 


        else: #Add new        
            for item in group_by_fields:
                group_order +=1
                attr_id = item.get('attributeId')
                group_by_type = item.get('type')
                new_id = self.model.add_report_group_by_field(report_id, attr_id, group_by_type, group_order)
                
                group_by_results.append({
                    "id": new_id,
                    "attributeId": attr_id,
                    "type": group_by_type
                }) 
                    
        return {"groupBy":group_by_results, "chartType": chart_type}
    
    def get_summary_report(self, report_id, payload):

        filters = payload.get('selectedFilters')
        list_attr_id_group_by  = payload.get('selectedGroupByFields')
        
        chart_type =self.model.get_report_chart_type(report_id)
        
        cols = self.model.get_report_table_columns(report_id)
        list_attr_id = filters.keys()
        # attr_mapping used to apply  filter to query
        attr_mapping = self.model.get_attribute_mapping(list_attr_id)

        list_views = []
        
        if(chart_type != 'pivot'):
            rows = self.model.get_report_table_rows(cols, filters, attr_mapping)
            
            # get list accessor from attribute id
            list_fields = []            
            for item in list_attr_id_group_by:
                attr_id = item['attributeId']
                attribute = self.model.get_attribute_by_id(attr_id)
                accessor = attribute['accessor'] if 'accessor' in attribute else None
                
                if accessor:
                    list_fields.append(accessor)
                    list_views.append({
                        "id": attribute['id'],
                        "name": attribute['name'],
                        "accessor": attribute['accessor'],
                    })
                    
                    
                else:
                    handle_log(f"Not found accessor for attribute {attr_id}", "error")
            
            data = group_data_by_field(list_fields, rows)
            
        else:
            
            rows = self.model.get_report_table_rows(cols, filters, attr_mapping, is_get_by_name=True)
            
            for item in list_attr_id_group_by:
                attr_id = item['attributeId']
                attribute = self.model.get_attribute_by_id(attr_id)
                list_views.append({
                        "id": attribute['id'],
                        "name": attribute['name'],
                        "accessor": attribute['accessor'],
                    })
            data = rows

        # get chart type        
        return {"records": data, 
                "headers": list_views, 
                "chartType": chart_type if chart_type is not None else chart_type
                }
        
        
    def get_report_definition(self, report_id):
        data = {}
        meta= {} 
        
        if report_id != "-1" and report_id != -1:
            data = self.model.get_report_base_info(report_id)
            data['selectedFilters'] = self.model.get_report_selected_filter_fields(report_id)
            data['selectedDisplayFields'] = self.model.get_report_selected_display_fields(report_id)
            data['selectedGroupByFields'] = self.model.get_report_group_by_fields(report_id)
            data['chartType'] = self.model.get_report_chart_type(report_id)
        else:
            data['currentId'] = -1
            data['folderId'] = None
            data['reportName'] = ""            
            data['selectedFilters'] = []
            data['selectedDisplayFields'] = []
            data['selectedGroupByFields'] = []
            data['chartType'] = ""
        
               
        meta['availableDisplayGroups'] = self.model.get_available_display_groups()
        meta['availableFilterGroups'] = self.model.get_available_filter_groups()
        meta['availableFilters'] = self.model.get_available_filters()
        meta['folders'] = self.model.get_folders()
        # meta['folders'] = self.model.get_reports()
             
        return data, meta
    
    def delete_chart(self, report_id):
        # Clean report group by 
        self.model.delete_all_report_group_by_field_by_report_id(report_id)
        
        # Clean chart 
        self.model.delete_chart(report_id)
        
        return {"id": report_id}
    
    def public_report(self, report_id, is_public):
        is_public = 1 if is_public == "true" else 0
        
        # active/de-active report
        self.model.public_report(report_id, is_public)
        
        return {"id": report_id, "isPublic": is_public}
        
        
        
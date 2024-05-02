# sql = f"""
            # WITH RECURSIVE Subordinates AS (
            #     SELECT
            #         {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
            #         {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},                    
            #         {col_selected}
            #     FROM  {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}
                
                
            #     LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1                 
            #     LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                
            #     WHERE {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} = {user_id}
            #     UNION ALL
            #     SELECT  {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
            #             {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
            #             {col_selected}
            #     FROM {DBTableName.ASSIGNED}
                
            #     JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID} =  {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID}
                
            #     JOIN Subordinates ON {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID} = Subordinates.{DBTableFields.EMPLOYEE_ID} 
                
            #     LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} = Subordinates.{DBTableFields.EMPLOYEE_ID}        
            #     LEFT JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID}
                
            #     )
            #     SELECT *,
            #     (SELECT COUNT({DBTableFields.EMPLOYEE_ID}) FROM {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} WHERE  {DBTableFields.EMPLOYEE_ID} != {user_id}) AS count
            #     FROM Subordinates
            #     WHERE Subordinates.{DBTableFields.EMPLOYEE_ID} != {user_id}
            #     {limit_condition} 
            # """
            
           
            
            
            
            # sql = f"""
            #         SELECT @pv:={DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID} AS
            #             {DBTableFields.SUPERVISOR_ID},
            #             {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID},
            #             {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
            #             {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
            #             (SELECT COUNT(*) FROM {DBTableName.ASSIGNED}  WHERE {DBTableFields.SUPERVISOR_ID} = @pv) AS count,
            #             {col_selected}
            #         FROM {DBTableName.ASSIGNED}                    
            #         JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}                    
            #         LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} ={DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1
            #         JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID} 
            #         WHERE {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID}={user_id}
            #         UNION ALL
                    
            #         SELECT @pv:={DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID} AS
            #             {DBTableFields.SUPERVISOR_ID},
            #             {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID},
            #             {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID},
            #             {DBTableName.AVATARS}.{DBTableFields.AVATAR_URL},
            #             (SELECT COUNT(*) FROM {DBTableName.ASSIGNED}  WHERE {DBTableFields.SUPERVISOR_ID} = @pv) AS count,
            #             {col_selected}
            #         FROM {DBTableName.ASSIGNED}                    
            #         JOIN {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE} ON {DBViewName.VIEW_EMPLOYEE_ATTRIBUTE}.{DBTableFields.EMPLOYEE_ID} =  {DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID}                    
            #         LEFT JOIN {DBTableName.EMPLOYEE_AVATAR} ON {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.EMPLOYEE_ID} ={DBTableName.ASSIGNED}.{DBTableFields.SUBORDINATE_ID} AND {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.IS_ACTIVE} = 1
            #         JOIN {DBTableName.AVATARS} ON {DBTableName.AVATARS}.{DBTableFields.AVATAR_ID} = {DBTableName.EMPLOYEE_AVATAR}.{DBTableFields.AVATAR_ID} 
                    
            #         JOIN (SELECT @pv:={user_id}) tmp ON 1=1
            #         JOIN 
            #         (SELECT * FROM {DBTableName.ASSIGNED} WHERE {DBTableFields.SUPERVISOR_ID}=@pv) AS sub 
            #             ON {DBTableName.ASSIGNED}.{DBTableFields.SUPERVISOR_ID} = sub.{DBTableFields.SUBORDINATE_ID}
            #         {limit_condition}

            #         """
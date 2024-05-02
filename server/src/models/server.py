import os
import pymysql
from flask import g
from pymysql.constants import CLIENT
from src.common.utils import handle_log
import config

class DbConnection:
    def __init__(self):
        self.db_name = config.DB_NAME
        self.db_host = config.DB_HOST
        self.db_user = config.DB_USER
        self.db_port = config.DB_PORT
        self.db_password = config.DB_PASS
        self.db_char_set = 'utf8mb4'
        self.cusror_type = pymysql.cursors.DictCursor

    def set_attr(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def create_connection(self):
        """ create a database connection to the MYSQL database
        specified by db_file
        :param : None
        :return: Connection object or None
        """
        connection = None
        try:
            connection = pymysql.connect(host=self.db_host,
                                         port=self.db_port,
                                         user=self.db_user,
                                         password=self.db_password,
                                         db=self.db_name,
                                         charset=self.db_char_set,
                                         cursorclass=self.cusror_type,
                                         client_flag=CLIENT.MULTI_STATEMENTS
                                         )
            return connection
        except Exception as e:
            print(e)
        return connection

    def db_execute(self, query, shareable=True):
        """ Execute MySQL query for insert/update/delete database
        :param : query - text
        :return: None
        """
        try:
            handle_log(query,  'debug')
            connection = self.create_connection()
            cursor = connection.cursor()
            cursor.execute(query)
            connection.commit()
        except Exception as e:
            raise Exception(e)
        finally:
            connection.close()

    def db_execute_return_id(self, query, shareable=True):
        """ Execute MySQL query for insert
        :param : query - text
        :return: insert_id
        """
        try:
            handle_log(query,  'debug')
            connection = self.create_connection()
            cursor = connection.cursor()
            cursor.execute(query)
            connection.commit()
            return cursor.lastrowid
        except Exception as e:

            raise Exception(e)
        finally:
            connection.close()

    def db_query(self, query, factory=True, shareable=True):
        """ Execute MySQL query for select database
        :param : query - text 
        :return: all rows
        """
        try:
            handle_log(query, 'debug')
            connection = self.create_connection()
            cursor = connection.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            if rows:
                return rows
            else:
                return None
        except Exception as e:
            raise Exception(e)
        finally:
            connection.close()

    def db_executescript(self, query, shareable=True):
        """ Execute sql script
        :param : query - text 
        :return: all rows
        """
        try:
            handle_log(query, 'debug')
            connection = g.pool_conn.connection(shareable)
            cursor = connection.cursor()
            cursor.executescript(query)
            connection.commit()
        except Exception as e:
            raise Exception(e)
        finally:
            connection.close()

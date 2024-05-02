import json
from pprint import pprint
from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from office365.runtime.http.request_options import RequestOptions
from office365.runtime.http.http_method import HttpMethod


username="test_it@savarti.com"
password="svi@2023!"



# SharePoint site URL
site_url = "https://savarti.sharepoint.com"


import sys
from urllib.parse import quote
from datetime import datetime, timedelta

# Get the current datetime
current_datetime = datetime.now()

def dict_to_url_params(params):
    """
    Convert a dictionary of parameters to URL parameters.

    Parameters:
    - params (dict): Dictionary of parameters.

    Returns:
    - str: URL parameters in the form "key1=value1&key2=value2&..."
    """
    # Convert each key-value pair to a string, ensuring proper encoding
    param_strings = [f"${quote(str(key))}={quote(str(value), safe=',')}" for key, value in params.items()]

    # Join the key-value pairs with "&" to form the final URL parameters
    return "&".join(param_strings)


# Function to authenticate and get timesheet data
def get_timesheet_data():

    ctx = ClientContext(site_url).with_credentials(UserCredential(username, password))

    print(ctx)

    # url = "{0}/_api/web/Lists(guid'9edb2fd9-46d0-417e-b516-3ba4cfde9bd2')/Items?".format(site_url)
    # url = "{0}/_api/web/Lists(guid'f6dbbe0b-017f-4764-a392-2a574cc6a64f')/Items?".format(site_url)
    # url = "{0}/_api/web/SiteUsers".format(site_url)
    url = "{0}/timesheet/Time-OffManagerPro/_api/web/Departments?$select=Id,Value&$orderby=Value%20asc".format(site_url)
    # url = "{0}/timesheet/Time-OffManagerPro/_api/web/Lists(guid'9edb2fd9-46d0-417e-b516-3ba4cfde9bd2')/Items?".format(site_url)
    # url = "https://savarti-107ad43d5f8cf1.sharepoint.com/timesheet/Time-OffManagerPro/_api/Web/SiteUserInfoList/Items(12)/Properties"
    # url = "{0}/_api/web/GetUserById(245)/Alerts".format(site_url)
    
  
    



    # # Format the datetime as "2024-01-09T00:00:00"
    # current = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

    # # Calculate the datetime for the previous 6 months
    # prev_datetime = current_datetime - timedelta(days=185) # Assuming 30 days per month
    # prev_six_month = prev_datetime.strftime("%Y-%m-%dT%H:%M:%S")

    # param_dict = {

    #     "filter": f"Email eq 'nhuanhoang@savarti.com'",
    #     "inlinecount": "allpages",
    #     # "orderby": "StartDate asc",
    #     "select": "Id,Email",
    #     "skip": 0,
    #     "top": 10,

    # }


    # url_parameters = dict_to_url_params(param_dict)
    # url+=url_parameters

    request = RequestOptions(url)
    print (url)


    request.method = HttpMethod.Get

    response = ctx.pending_request().execute_request_direct(request)

    if (response.status_code == 200):

        data = json.loads(response.content)
        pprint(len(data))
        pprint(data['d'])

    else:
        print(response.text)




if __name__ == "__main__":
    get_timesheet_data()
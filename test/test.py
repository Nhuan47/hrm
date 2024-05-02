import json
from pprint import pprint
from office365.runtime.auth.user_credential import UserCredential
from office365.sharepoint.client_context import ClientContext
from office365.runtime.http.request_options import RequestOptions
from office365.runtime.http.http_method import HttpMethod

username="test_it@savarti.com"
password="svi@2023!"


# SharePoint site URL
site_url = "https://savarti.sharepoint.com/timesheet/Time-OffManagerPro"


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

    # Get the current user's login name
    # current_user = ctx.web.current_user
    # ctx.load(current_user)
    # ctx.execute_query()

    # # Get the avatar URL
    # avatar_url = f"{site_url}/_layouts/15/userphoto.aspx?size=S&accountname={current_user.properties['LoginName']}"
    # print("Avatar URL:", avatar_url)

    # sys.exit()

    url = "{0}/_api/web/Lists(guid'9edb2fd9-46d0-417e-b516-3ba4cfde9bd2')/Items?".format(site_url)



    # Format the datetime as "2024-01-09T00:00:00"
    current = current_datetime.strftime("%Y-%m-%dT%H:%M:%S")

    # Calculate the datetime for the previous 6 months
    prev_datetime = current_datetime - timedelta(days=185) # Assuming 30 days per month
    prev_six_month = prev_datetime.strftime("%Y-%m-%dT%H:%M:%S")

    param_dict = {

        "filter": f"Id gt 9384 and (EndDate ge datetime'{current}'  or EndDate ge datetime'{prev_six_month}') and (Status eq 'Approved'  or Status eq 'Pending Approval')",
        "inlinecount": "allpages",
        "orderby": "StartDate asc",
        # "select": "Id,Status,TypeName,Created,StartDate,EndDate,WorkDays,Reason,Status,RequesterName,DepartmentName,Hours,Email",
        "skip": 0,
        "top": 10000,
        "_": 1704783330948
    }


    url_parameters = dict_to_url_params(param_dict)
    url+=url_parameters

    request = RequestOptions(url)
    print (url)


    request.method = HttpMethod.Get

    response = ctx.pending_request().execute_request_direct(request)

    if (response.status_code == 200):

        data = json.loads(response.content)
        pprint(len(data['d']['results']))
        pprint(data['d']['results'])

    else:
        print(response.text)




if __name__ == "__main__":
    get_timesheet_data()
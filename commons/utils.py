from datetime import datetime

def generate_mera_data_update_payload(requestId, dataId, date, variable, status, s3Keys=None, expirationTime=None):
    data = {'dataId': dataId, 'date': date, 'variable': variable, 'status': status}
    if expirationTime is not None:
        data['expirationTime'] = str(expirationTime)
    if s3Keys is not None:
        data['dataS3Key'] = s3Keys
    return data

def generate_result_payload(request_id, status, comments, results_s3_key=None):
    data = {"requestId": request_id, "status": status, "comments": comments}
    if results_s3_key is not None:
        data["resultS3Key"] = results_s3_key
    return generate_payload(request_id, data)

def generate_payload(request_id, data):
    return {
        "specversion":     '1.0',
        "type":            'elves.ingestor.getdata',
        "source":          'ingestor',
        "subject":         'ingestor.getdata',
        "id":              request_id,
        "time":            str(int(datetime.now().timestamp())),
        "datacontenttype": 'application/json',
        "data":            data
        }

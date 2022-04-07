import base64
import os

from flask import Blueprint, jsonify

from services.s3_services import S3Service

import logging

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s {%(pathname)s:%(lineno)d}: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

simple_page = Blueprint('simple_page', __name__, template_folder='templates')

s3Service = S3Service(os.getenv('nexrad_results_bucket') or 'results')

@simple_page.route("/image/<s3Key>", methods=['GET'])
def download_image(s3Key):
    download_path = './{}'.format(s3Key)
    f = None
    try:
        s3Service.download_file(s3Key, download_path)
        log.info('successfully downloaded {} from s3 to {}'.format(s3Key, download_path))
        pic_hash = base64.b64encode(open(download_path, "rb").read())
        str_pic_hash = str(pic_hash)
        str_pic_hash = str_pic_hash[2:len(str_pic_hash) - 1]
        return jsonify({'image': str_pic_hash})
    except Exception as e:
        errorMessage = 'error while downloading file {} from s3: {}'.format(s3Key, e)
        log.error(errorMessage)
        log.critical(e, exc_info=True)
        return jsonify({'error': errorMessage}), 500
    finally:
        if f is not None:
            f.close()
        if os.path.exists(download_path):
            os.remove(download_path)

import logging
import os

from pottery import Redlock
from redis import Redis

logging.basicConfig(level=logging.CRITICAL, format='%(asctime)s  %(name)s  %(levelname)s: %(message)s')

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

class RedisService:
    def __init__(self):
        redis_host, redis_port = os.getenv('redis_host') or 'localhost', os.getenv('redis_port') or '6379'
        redis_url = 'redis://{}:{}/1'.format(redis_host, redis_port)
        self.redis = Redis.from_url(redis_url)
        log.info('successfully connected to redis on {}'.format(redis_url))
        self.auto_release_time = int(os.getenv('nexrad_lock_duration') or '20')

    def __acquire_lock(self, resourceName, auto_release_time):
        lock = Redlock(key=resourceName, masters={self.redis}, auto_release_time=max(auto_release_time, self.auto_release_time))
        log.info('trying to acquire lock on {}'.format(resourceName))
        lock.acquire()
        log.info('successfully acquired lock on {}'.format(resourceName))
        return lock

    def acquire_nexrad_lock(self, startTime, endTime, radarName, auto_release_time=10):
        resourceName = '{}-{}-{}'.format(startTime, endTime, radarName)
        return self.__acquire_lock(resourceName, auto_release_time)

    def acquire_mera_lock(self, date, varName, auto_release_time=10):
        resourceName = '{}-{}'.format(date, varName)
        return self.__acquire_lock(resourceName, auto_release_time)

    def release_lock(self, lock: Redlock):
        if lock.locked() > 0:
            lock.release()
        log.info('successfully released lock on resource: {}'.format(lock.key))

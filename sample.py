from redis import Redis
from pottery import Redlock

redis = Redis.from_url('redis://149.165.157.38:30011/1')
redis_instances = [{'host': '149.165.157.38', 'port': 30011, 'db': 1}]

resourceName = 'sample-resource'
lock = Redlock(key=resourceName, masters={redis}, auto_release_time=2)
if lock.acquire():
    print('lock acquired')
lock.release()
another_lock = Redlock(key=resourceName, masters={redis}, auto_release_time=10)
if another_lock.acquire():
    print('failed to acquire same lock again')
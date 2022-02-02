import nexradaws
conn = nexradaws.NexradAwsInterface()
years = conn.get_avail_years()


radars = conn.get_avail_radars('2021','12','31')
print(len(radars))
print(radars)
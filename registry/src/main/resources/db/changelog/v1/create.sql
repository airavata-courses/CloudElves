create table UserDetails(user_id text, user_email text, user_name text, register_timestamp timestamp, active boolean, primary key(user_id));
create table AppLog(id text, user_id text, service_id text, action text, log_timestamp timestamp, status integer, comments text, foreign key(user_id) references userdetails(user_id));
create table plots(id text, image text, primary key(id));
--create table UserDetails(user_id text, user_email text, user_name text, register_timestamp timestamp, active boolean, primary key(user_id));
--create table AppLog(id text, user_id text, service_id text, action text, log_timestamp timestamp, status integer, comments text, foreign key(user_id) references userdetails(user_id));
--create table plots(id text, image text, primary key(id));

create table userdetails (user_id text, name text not null, email text not null,
                          first_login_timestamp timestamp not null, primary key(user_id));

create table usereventlog (event_id text, user_id text not null, event_name text not null, event_timestamp timestamp not null,
                            primary key(event_id), foreign key(user_id) references userdetails(user_id));

create table requests (request_id text not null, user_id text not null, data_source text not null,
                        parameters text not null, status int not null, result_s3_key text, comments text,
                        request_timestamp timestamp not null, primary key(request_id),
                        foreign key(user_id) references userdetails(user_id));

create table nexraddata(nexrad_data_id text not null, start_time timestamp not null, end_time timestamp not null,
                        radar text not null, expiration_time timestamp, status int not null,
                        last_access_time timestamp not null, data_s3_key text);

create table meradata(mera_data_id text not null, date1 text not null, variable text not null,
                        expiration_time timestamp, last_access_time timestamp not null,
                        status int not null, data_s3_key text);
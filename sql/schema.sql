CREATE TABLE tokens
(
    id serial primary key,
    token varchar(300)
);

CREATE TABLE events
(
    id serial primary key,
    name varchar(200),
    venue varchar(100),
    event_date varchar(20),
    event_time varchar(20),
    token_id INT,
    foreign key(token_id) references tokens(id)
);
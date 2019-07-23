CREATE TABLE users
(
    id serial primary key,
    username varchar(100)
);

CREATE TABLE artists
(
    id serial primary key,
    name varchar(100)
);

CREATE TABLE artistusers
(
    id serial primary key,
    user_id INT,
    artist_id INT,
    foreign key(user_id) references users(id),
    foreign key(artist_id) references artists(id)
);

CREATE TABLE events
(
    id serial primary key,
    eventname varchar(100),
    venue varchar(100),
    day DATE,
    hour TIME,
    zip INT
);

CREATE TABLE userevents
(
    id serial primary key,
    user_id INT,
    event_id INT,
    foreign key(user_id) references users(id),
    foreign key(event_id) references events(id)
);
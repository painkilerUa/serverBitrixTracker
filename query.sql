CREATE DATABASE bitrix_tracker CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE work_time (
id INT(11) NOT NULL AUTO_INCREMENT,
user_id INT(11) NOT NULL,
group_id INT(11) UNSIGNED NOT NULL,
task_id INT(11) UNSIGNED NOT NULL,
time_start BIGINT(13) UNSIGNED DEFAULT NULL,
t_time ENUM('START', 'STOP'),
PRIMARY KEY(id),
FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE users (
id INT(11) NOT NULL AUTO_INCREMENT,
bitrix_user_id INT(9) NOT NULL,
bitrix_user_token VARCHAR(255),
bitrix_service_hash VARCHAR(255),
PRIMARY KEY(id),
UNIQUE (bitrix_user_id)
);

INSERT INTO workhours (UserId, groupId, taskId, time_start, t_time) VALUES (111, 125, 99, 1499696277821, 'START');

CREATE DATABASE bitrix_tracker_test CHARACTER SET utf8 COLLATE utf8_general_ci;

INSERT INTO users (bitrix_user_id, bitrix_user_token, bitrix_service_hash) VALUES (486, 'token123456789', 'hash937157595');
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE user_data
(username text, area text, sessionid text, url text, return_url text, lastupd date);
INSERT INTO "user_data" VALUES('OASYS_ADMIN','ESSEX','123456','http://amazon.co.uk','http://192.168.56.21:8080/ords/f?p=109:2:3838300386571:::::','2023-05-24 14:36:14');
INSERT INTO "user_data" VALUES('OASYS_ADMIN','KENT','987654','http://yahoo.com',NULL,'2023-05-24 08:52:51');
CREATE TRIGGER user_data_upd after update on user_data
begin
update user_data set lastupd = datetime('now') where username = NEW.username and area = NEW.area;
end;
CREATE TRIGGER user_data_ins after insert on user_data
begin
update user_data set lastupd = datetime('now') where username = NEW.username and area = NEW.area;
end;
COMMIT;


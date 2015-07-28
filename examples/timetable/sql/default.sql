CREATE TABLE htt_login (
  id char(7) default NULL,
  timestamp timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
);
CREATE TABLE htt_board (
  uid int(10) NOT NULL auto_increment,
  fid int(10) NOT NULL default '0',
  sort varchar(30) NOT NULL default '',
  isSurvive bigint(1) NOT NULL default '0',
  id varchar(10) NOT NULL default '',
  subject varchar(60) NOT NULL default '',
  memo text NOT NULL,
  ip varchar(15) NOT NULL default '',
  timestamp varbinary(19) default NULL,
  hit int(10) NOT NULL default '0',
  depth varchar(4) NOT NULL default '',
  PRIMARY KEY  (uid)
);
CREATE TABLE htt_member (
  id char(7) NOT NULL,
  name varchar(100) NOT NULL,
  PRIMARY KEY  (id)
);
CREATE TABLE htt_table (
  id char(7) NOT NULL,
  uid int(11) NOT NULL auto_increment,
  timestamp timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (uid)
);
CREATE TABLE htt_table_code (
  uid int(11) NOT NULL auto_increment,
  code char(7) NOT NULL,
  divide char(1) NOT NULL,
  PRIMARY KEY  (uid,code)
);
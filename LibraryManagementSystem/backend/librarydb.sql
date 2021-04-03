CREATE DATABASE librarydb;
use librarydb;

CREATE TABLE IF NOT EXISTS `books` (
  `id` int NOT NULL AUTO_INCREMENT ,
  `name` varchar(50) NOT NULL,
  `author` varchar(50) NOT NULL,
  `publish` varchar(50) NOT NULL ,
  `pubDate` DateTime NOT NULL,
  `price` int NOT NULL ,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `books` ( `name`,`author`, `publish`,`pubDate`,`price`,`quantity`) VALUES
( 'Java','Villiam','Sun Shine','2018-02-10',120,3 ),
( 'Data Structure','flip Brian','Sun Shine','2017-02-10',100,5 );


CREATE TABLE IF NOT EXISTS `members` (
  `id` int NOT NULL AUTO_INCREMENT ,
  `name` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `address`  varchar(100) NOT NULL,
  PRIMARY KEY (`id`));
   
  
INSERT INTO `members` ( `name`,`phone`, `email`,`address`) VALUES
( 'Daniel Vanda','5145552345','daniel@gmail.com','2900 Kildare, Montreal'),
( 'Kasia Dutin','4382451345','Kasia@yahoo.com','7800 Roissy, Laval');


CREATE TABLE IF NOT EXISTS `borrows` (
  `id` int NOT NULL AUTO_INCREMENT ,
  `memberId` int NOT NULL,
  `bookId` int NOT NULL,
  `issueDate` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `returnDate` datetime NULL ,
  PRIMARY KEY (`id`));
  
ALTER TABLE `borrows` 
ADD CONSTRAINT `memberId`
  FOREIGN KEY (`memberId`)
  REFERENCES `members` (`id`);
  
  ALTER TABLE `borrows` 
ADD CONSTRAINT `bookId`
  FOREIGN KEY (`bookId`)
  REFERENCES `books` (`id`);
  
INSERT INTO `borrows` ( `memberId`,`bookId`, `issueDate`,`returnDate`) VALUES
(1,2,'2021-02-10',null),
(1,1,'2020-02-10','2021-02-10' );

select b.name,b.author,d.issueDate,d.returnDate from borrows as d inner join members as m on d.memberId=m.id inner join books as b on d.bookId=b.id where d.memberId=1 and d.returnDate is null order by b.name ;
select b.name as 'book name',b.author,m.name as 'member name',bo.issueDate from borrows as bo inner join books as b on bo.bookId=b.id inner join members as m on bo.memberId=m.id where bo.returnDate is null ;

select b.name as 'book name',b.author,m.name as 'member name',DATE_FORMAT(bo.issueDate, '%d %M, %Y') as 'issueDate' from borrows as bo inner join books as b on bo.bookId=b.id inner join members as m on bo.memberId=m.id where bo.returnDate is null order by b.name;
select * from borrows;
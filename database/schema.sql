-- MySQL Script generated by MySQL Workbench
-- lun. 02 janv. 2017 10:46:23 CET
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema hours_count
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `hours_count` ;

-- -----------------------------------------------------
-- Schema hours_count
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `hours_count` DEFAULT CHARACTER SET utf8 ;
USE `hours_count` ;

-- -----------------------------------------------------
-- Table `hours_count`.`client`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `hours_count`.`client` ;

CREATE TABLE IF NOT EXISTS `hours_count`.`client` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `hours_count`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `hours_count`.`project` ;

CREATE TABLE IF NOT EXISTS `hours_count`.`project` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `client` INT NOT NULL,
  `provisioned_hours` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_project_client1_idx` (`client` ASC),
  CONSTRAINT `fk_project_client1`
    FOREIGN KEY (`client`)
    REFERENCES `hours_count`.`client` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `hours_count`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `hours_count`.`user` ;

CREATE TABLE IF NOT EXISTS `hours_count`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `hours_count`.`hour`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `hours_count`.`hour` ;

CREATE TABLE IF NOT EXISTS `hours_count`.`hour` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `issue` VARCHAR(45) NOT NULL,
  `started_at` DATETIME NOT NULL,
  `minutes` INT NOT NULL,
  `comments` VARCHAR(255) NULL,
  `project` INT NOT NULL,
  `affected_to` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_hour_project_idx` (`project` ASC),
  INDEX `fk_hour_user1_idx` (`affected_to` ASC),
  CONSTRAINT `fk_hour_project`
    FOREIGN KEY (`project`)
    REFERENCES `hours_count`.`project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_hour_user1`
    FOREIGN KEY (`affected_to`)
    REFERENCES `hours_count`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `hours_count`.`project_assignements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `hours_count`.`project_assignements` ;

CREATE TABLE IF NOT EXISTS `hours_count`.`project_assignements` (
  `project` INT NOT NULL,
  `user` INT NOT NULL,
  PRIMARY KEY (`project`, `user`),
  INDEX `fk_project_has_user_user1_idx` (`user` ASC),
  INDEX `fk_project_has_user_project1_idx` (`project` ASC),
  CONSTRAINT `fk_project_has_user_project1`
    FOREIGN KEY (`project`)
    REFERENCES `hours_count`.`project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_has_user_user1`
    FOREIGN KEY (`user`)
    REFERENCES `hours_count`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `hours_count` ;

-- -----------------------------------------------------
-- Placeholder table for view `hours_count`.`hour_extended`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hours_count`.`hour_extended` (`id` INT);

-- -----------------------------------------------------
-- View `hours_count`.`hour_extended`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `hours_count`.`hour_extended` ;
DROP TABLE IF EXISTS `hours_count`.`hour_extended`;
USE `hours_count`;
CREATE OR REPLACE VIEW hour_extended 
AS
(
    SELECT 
    sub_1.id, 
    sub_1.issue, 
    sub_1.started_at, 
    sub_1.minutes, 
    sub_1.comments,
    (sub_1.`project.provisioned_hours` - sub_2.`consumed`) AS 'project.hours_left',
    sub_1.`affected_to.id` , 
    sub_1.`affected_to.email` , 
    sub_1.`affected_to.name`,
    sub_1.`project.id` , 
    sub_1.`project.name`, 
    sub_1.`project.client.id`, 
    sub_1.`project.client.name`
    FROM
    (
        SELECT 
        H.id, 
        H.issue, 
        H.started_at, 
        H.minutes, 
        H.comments, 
        P.provisioned_hours AS 'project.provisioned_hours', 
        U.id AS 'affected_to.id' , 
        U.email AS 'affected_to.email',
        U.name AS 'affected_to.name' ,
        P.id AS 'project.id' , 
        P.name AS 'project.name',
        C.id AS 'project.client.id' , 
        C.name AS 'project.client.name'
        FROM hour H 
        JOIN project P 
        ON H.project = P.id
        JOIN user U 
        ON H.affected_to = U.id
        JOIN client C
        ON P.client = C.id
    ) AS sub_1
    LEFT JOIN
    (
        SELECT 
        H.project AS 'project.id',
        SUM(H.minutes / 60) AS 'consumed'
        FROM hour H
        GROUP BY H.project
    ) AS sub_2
    ON sub_1. `project.id` = sub_2.`project.id`
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `hours_count`.`client`
-- -----------------------------------------------------
START TRANSACTION;
USE `hours_count`;
INSERT INTO `hours_count`.`client` (`id`, `name`) VALUES (1, 'G Cloud');

COMMIT;


-- -----------------------------------------------------
-- Data for table `hours_count`.`project`
-- -----------------------------------------------------
START TRANSACTION;
USE `hours_count`;
INSERT INTO `hours_count`.`project` (`id`, `name`, `client`, `provisioned_hours`) VALUES (1, 'Interne', 1, DEFAULT);
INSERT INTO `hours_count`.`project` (`id`, `name`, `client`, `provisioned_hours`) VALUES (2, 'WSR', 1, DEFAULT);

COMMIT;


-- -----------------------------------------------------
-- Data for table `hours_count`.`user`
-- -----------------------------------------------------
START TRANSACTION;
USE `hours_count`;
INSERT INTO `hours_count`.`user` (`id`, `email`, `name`) VALUES (1, 'klambert@gpartner.eu', 'Kévin LAMBERT');
INSERT INTO `hours_count`.`user` (`id`, `email`, `name`) VALUES (2, 'ftabary@gpartner.eu', 'Fabien TABARY');

COMMIT;


-- -----------------------------------------------------
-- Data for table `hours_count`.`hour`
-- -----------------------------------------------------
START TRANSACTION;
USE `hours_count`;
INSERT INTO `hours_count`.`hour` (`id`, `issue`, `started_at`, `minutes`, `comments`, `project`, `affected_to`) VALUES (1, 'test issue', '25-09-2016', 5, 'Awesome commebt', 1, 1);

COMMIT;


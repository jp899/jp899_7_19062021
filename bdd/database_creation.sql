/* Création de la base de données */
DROP DATABASE IF EXISTS groupomania;
CREATE DATABASE IF NOT EXISTS groupomania CHARACTER SET 'UTF8MB4';
USE groupomania;


/* Création table des utilisateurs */
CREATE TABLE Users (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    -- Création d'un index avec unicité sur le username qui sera l'identifiant de connection
    userName VARCHAR(50) UNIQUE NOT NULL,
    -- Longueur maximale hash Bcrypt d'environ 72 caractères
    passwordHash VARCHAR(100) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0,
    -- Longeur cryptage AES 256-bits soit à priori 64 caractères
    emailEncrypted VARCHAR(100) NOT NULL,
    imageUrl VARCHAR(255),
    -- Dates de création/MAJ sous le nom utilisé par Sequelize
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;


/* Création table des Articles postés par les utilisateurs*/
CREATE TABLE Articles (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    userId SMALLINT UNSIGNED NOT NULL,
    title VARCHAR(50) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;


/* Création table des likes/dislikes des articles par les utilisateurs  */
CREATE TABLE Likes (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    userId SMALLINT UNSIGNED NOT NULL,
    articleId SMALLINT UNSIGNED NOT NULL,
    liked TINYINT DEFAULT 0,
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    PRIMARY KEY (id),
    UNIQUE ind_uni_userId_articleId (userId, articleId)
) ENGINE = InnoDB ;


/* Création table des commentaires postés par les utilisateurs sur les articles */
CREATE TABLE Comments (
    id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    userId SMALLINT UNSIGNED NOT NULL,
    articleId SMALLINT UNSIGNED NOT NULL,
    content VARCHAR(1000) NOT NULL,
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB ;

   
/* Mise en place de clés étrangères */
ALTER TABLE Articles ADD CONSTRAINT fk_articles_users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Likes ADD CONSTRAINT fk_likes_articles FOREIGN KEY (articleId) REFERENCES Articles(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Likes ADD CONSTRAINT fk_likes_users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Comments ADD CONSTRAINT fk_comments_articles FOREIGN KEY (articleId) REFERENCES Articles(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Comments ADD CONSTRAINT fk_comments_users FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;


/* Application contraintes sur valeurs des likes */

DELIMITER // 
CREATE TRIGGER trigger_insert_likes 
BEFORE INSERT ON Likes 
FOR EACH ROW
BEGIN
    IF (NEW.liked NOT IN (-1, 0, 1) ) THEN
        SIGNAL sqlstate '45000' SET MESSAGE_TEXT = 'INVALID VALUE FOR COLUMN liked OF TABLE Likes';
    END IF;
END//
DELIMITER ;

DELIMITER // 
CREATE TRIGGER trigger_updates_likes 
BEFORE UPDATE ON Likes 
FOR EACH ROW
BEGIN
    IF (NEW.liked NOT IN (-1, 0, 1) ) THEN
        SIGNAL sqlstate '45000' SET MESSAGE_TEXT = 'INVALID VALUE FOR COLUMN liked OF TABLE Likes';
    END IF;
END//
DELIMITER ;


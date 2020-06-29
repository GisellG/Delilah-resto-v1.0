-- =================================================================
-- ====== C O N F I G U R A C I Ó N - D E - D A T A - B A S E ======
-- =================================================================

-- ------ C R E A C I Ó N - D E - U S U A R I O ------
CREATE USER IF NOT EXISTS 'delilahresto_db_user'@'localhost' IDENTIFIED BY 'delilahresto_db_pass';

-- ------ C R E A C I Ó N - D A T A - B A S E ------
DROP DATABASE IF EXISTS admin_delilahresto;
CREATE DATABASE admin_delilahresto;

-- ------ O T O R G A N D O - S E R V I C I O S ------
GRANT ALL PRIVILEGES ON delilahresto. * TO 'delilahresto_db_user'@'localhost';

-- =================================================
-- ====== C R E A C I Ó N - D E - T A B L A S ======
-- =================================================

USE admin_delilahresto;

-- ------ C R E A N D O - L A - T A B L A - D E - P R O D U C T O S ------
CREATE TABLE product (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100),
    `photo` VARCHAR(250),
    price FLOAT UNSIGNED NOT NULL
);

-- ------ C R E A N D O - L A - T A B L A - D E - U S U A R I O S ------
CREATE TABLE `user` (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(50) NOT NULL,
    username VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(25) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    adress VARCHAR(100) NOT NULL,
    `password` VARCHAR(25) NOT NULL,
    `admin` BOOLEAN NOT NULL
);

-- ------ C R E A N D O - L A - T A B L A - D E - P E D I D O S ------
CREATE TABLE orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `description` VARCHAR(50),
    total FLOAT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    `date` DATETIME NOT NULL,
    payment ENUM('Efectivo', 'Débito', 'Crédito') NOT NULL,
    state ENUM('Nuevo', 'Confirmado', 'Preparando', 'Enviando', 'Entregado', 'Cancelado') NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES `user` (id)
        ON DELETE NO ACTION ON UPDATE CASCADE
);

-- ------ C R E A N D O - L A - T A B L A - P R O D U C T O S - P O R - P E D I D O ------

CREATE TABLE order_products (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    order_id INT UNSIGNED NOT NULL,
    product_quantity INT UNSIGNED NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order FOREIGN KEY (order_id)
        REFERENCES orders (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

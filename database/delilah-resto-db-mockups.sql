-- ===================================
-- ====== M O C K U P - D A T A ======
-- ===================================

-- ------ I N S E R C I Ó N - D E -  U S U A R I O S ------
INSERT INTO `user`(fullname, username, email, phone, adress, `password`, `admin`)
	values ('DelRes Admin', 'DelRes-admin', 'admin@delilahresto.dr', '+00 5005050', 'Local', 'D3lilahR3st0', 1);
INSERT INTO `user`(fullname, username, email, phone, adress, `password`, `admin`)
	values ('DelRes TestUser', 'DelRes-Test', 'tester@delilahresto.dr', '+00 6006060', 'Local', 'T3st3rUs3r', 0);
INSERT INTO `user`(fullname, username, email, phone, adress, `password`, `admin`)
	values ('Real User', 'real-user', 'realuser@delilahresto.dr', '+00 1001010', 'P.Sherman Wallaby Way 42, Sydney', 'R3alUs3r', 0);
    
-- ------ I N S E R C I Ó N - D E -  P R O D U C T O S ------
INSERT INTO product (`name`, `description`, photo, price)
	values ('Bagel de Salmón', 'Delicioso bagel, ideal para la hora de la cena.', 'http://dummyimage.com/200x247.bmp/5fa2dd/ffffff', 425);
INSERT INTO product (`name`, `description`, photo, price)
	values ('Hamburguesa Clásica', 'Deliciosa hamburguesa, ideal para la hora de la cena.', 'http://dummyimage.com/200x247.bmp/5fa2dd/ffffff', 350);
INSERT INTO product (`name`, `description`, photo, price)
	values ('Sandwich veggie', 'Delicioso sandwich, ideal para la hora de la cena.', 'http://dummyimage.com/200x247.bmp/5fa2dd/ffffff', 310);

-- ------ I N S E R C I Ó N - D E -  O R D E N E S ------
INSERT INTO orders(description, total, user_id, payment, state, `date`)
	values ('1xHamClas, 1xSandVeg', 660, 3, 'Efectivo', 'Nuevo','2020-05-15 16:04:50');
INSERT INTO orders(description, total, user_id, payment, state, `date`)
	values ('6xHamClas, 6xcerSLATA, 1xVerde', 2520, 2, 'Credito', 'Preparando','2020-05-15 13:10:26');
INSERT INTO orders(description, total, user_id, payment, state, `date`)
	values ('2xFocaccia', 690, 3, 'Efectivo', 'Entregado','2020-05-12 19:50:42');
    
-- ------ I N S E R C I Ó N - D E -  P R O D U C T O S - P O R - P E D I D O------
INSERT INTO order_products(product_id, order_id, product_quantity)
	values (1, 1, 1);
INSERT INTO order_products(product_id, order_id, product_quantity)
	values (1, 2, 2);
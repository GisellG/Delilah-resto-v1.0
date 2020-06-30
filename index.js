// ------------------ D E P E N D E N C I A S

const bodyParser = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const { response } = require('express');


// ------------------ V A R I A B L E S - G L O B A L E S

const sql = new Sequelize('mysql://delilahresto_db_user:delilahresto_db_pass@localhost:3306/admin_delilahresto');
const appSign = 'AppS3cre3t';


// ------------------ C O N F I G U R A C I O N E S

//Inicializar módulos
const app = express();

// Selección del puerto
app.set('port', process.env.PORT || 4000);

// Conexión a la base de datos
sql.authenticate()
    .then(async () =>{
        try {
            console.log('¡Bravó! La conexión con la base de datos de Dellilah Restó ha sido exitosa.');
        } catch (err) {
            console.error('No ha sido posible conectar con la base de datos', err);
            
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Opps! La conexion con la base de datos fue cerrada');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Opps! La base de datos tiene demasiadas conexiones');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Opps! La conexion a la base de datos fue rechazada');
            }
        }
    });

// ------------------ M I D D L E W A R E S

app.use(express.json());
app.use(bodyParser.json());

// ------------------ P E R M I S O S
// Autenticación
app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path} - ${JSON.stringify(req.query)} - ${JSON.stringify(req.body)}`)
    if (req.path === '/login' || req.path === '/register' || req.path === '/')
      next();
    else {
      try {
        const token = req.headers.authorization;
        const token_user = jwt.verify(token, appSign);
        if (token_user) {
          req.user = token_user;
          return next();
        }
      } catch (err) {
        console.error(err.message);
        res.statusCode = 401;
        res.json({error: "Su token no es válido, inicie sesión nuevamente para continuar"});
      }
    }
  });
// Autorización
const isAdmin = (req, res, next) => {
    if (req.user.admin === 1) {
        console.log('ok, funciona')
        return next();
    } else {
        res.statusCode = 403;
        res.json({error: "No tiene permisos para realizar esta operación"});
    }
  }

// ===========================================================================
// ------------------ A P L I C A C I Ó N - U S U A R I O S ------------------
// ===========================================================================
// ------------------ U S E R : I n g r e s o
app.post('/login', (req, res) => {
    sql.query('SELECT * FROM `user` WHERE (username = ? OR email = ?) AND `password` = ?',
    {
        replacements: [
            req.body.username,
            req.body.username,
            req.body.password
        ],
        type: sql.QueryTypes.SELECT
    })
    .then(user => {
        console.log(JSON.stringify(user) ? `Truly ${JSON.stringify(user)}` : `Falsy ${JSON.stringify(user)}`);
        if(user[0]){
            const token = jwt.sign(user[0], appSign);
            console.log(`Bienvenida/o a nuestra aplicación ${user[0].username}\nTu token es ${token}`);
            res.json({
                text: `Bienvenida/o de vuelta ${user[0].username},`,
                token: token
            })
        } else {
            res.statusCode = 401,
            console.log('La verificación de usuario falló.')
            res.json({
                text: '¡Ups! Algo salió mal, verifica la información que enviaste e intenta de nuevo.'
            })
        }
    })
});
// ------------------ U S E R : R e g i s t r o
app.post('/signin', (req, res) => {
    sql.query('INSERT INTO `user` (fullname, username, email, phone, adress, password, `admin`) values (?, ?, ?, ?, ?, ?, ?)',{
        replacements: [
            req.body.fullname,
            req.body.username,
            req.body.email,
            req.body.phone,
            req.body.adress,
            req.body.password,
            false
        ]
    })
    .then(response =>{
        console.log(`Usuario creado. Nuevo ID ${JSON.stringify(...response)}`);
        res.statusCode = 201;
        let user = {
            id: Number(...response),
            ...req.body
        };
        res.json({
            text: "¡Genial! Se ha creado un usuario nuevo.",
            user: {
                id: Number(...response),
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.adress
            },
            token: jwt.sign(user, appSign)
        });
    })
    .catch(err => {
        res.statusCode = 400;
        console.err(`${err.message}\nLa creación de usuario falló.`);
        res.json({
            error: '¡Ups! Algo salió mal, verifica la información que enviaste e intenta de nuevo.'
        })
    })
});

// ===========================================================================
// ------------------ A P L I C A C I Ó N - P R O D U C T O S ----------------
// ===========================================================================
// ------------------ P R O D U C T : C o n s u l t a - g e n e r a l
app.get('/product', (req, res) => {
    sql.query('SELECT * FROM product', {
        type: sql.QueryTypes.SELECT
    })
    .then (products => {
        if(products.length === 0) {
            console.log('No hay productos en la lista.');
            res.json({
                text: `¡Ups! No encontramos productos disponibles`,
                products: []
            })
        } else {
            console.log(`Estos son los productos que se encontraron: ${JSON.stringify(products)}`);
            res.json({
                text: '¡Que bien! Estos son los productos que encontramos:',
                products: products
            })
        }
    })
});

// ------------------ P R O D U C T : C o n s u l t a - p o r - I D
app.get('/product/:id', (req, res) => {
    sql.query('SELECT * FROM product WHERE id = ?',
    {
        replacements: [req.params.id],
        type: sql.QueryTypes.SELECT
    })
    .then(products => {
        if(products.length === 0){
            res.statusCode = 404,
            console.log(`El producto no existe.`);
            res.json({
                error: '¡Ups! El producto que buscas no lo encontramos.'
            })
        } else {
            console.log(`Información del producto ${products[0].id}: ${JSON.stringify(products[0])}`);
            res.json({
                text: '¡Que bien! Encontramos la información del producto que solicitaste:',
                products: products[0] 
            })
        }
    })
});

// ------------------ P R O D U C T : C r e a c i ó n
app.post('/product', isAdmin, (req, res) => {
    sql.query('INSERT INTO product (`name`, `description`, `photo`, price) values (?, ?, ?, ?)',
    {
        replacements: [
            req.body.name,
            req.body.description,
            req.body.photo,
            req.body.price
        ]
    })
    .then(response => {
        console.log(`Producto creado. ID ${response}`);
        res.statusCode = 201;
        res.json({
            text: '¡Genial! El producto ha sido creado.',
            products:{
                id: Number(...response),
                ...req.body
            }
        });
    })
    .catch(err => {
        res.statusCode = 400;
        console.error(`${err.message}\nLa creación de producto falló.`);
        res.json({
            text: '¡Ups! Algo salió mal y el producto no pudo ser creado.'
        })
    })
});

// ------------------ P R O D U C T : E d i c i ó n
app.put('/product/:id', isAdmin, (req, res) => {
    sql.query('UPDATE product SET `name` = ?, `description` = ?, `photo` = ?, price = ? WHERE id = ?',
        {
            replacements: [
                req.body.name,
                req.body.description,
                req.body.photo,
                req.body.price,
                req.params.id
            ]
        }
    )
    .then(() => {
        console.log(`El producto ha sido modificado exitosamente por ${req.user.username}`);
        res.json({
            text: `¡Genial! El producto ha sido modificado por ${req.user.username}, esta es la nueva información: `,
            products: {
                id: req.params.id,
                ...req.body
            }
        });
    })
    .catch(err => {
        req.statusCode = 400;
        console.error(`${err.message}\nLa modificación de producto falló`)
        res.json({
            text: '¡Ups! Algo salió mal y el producto no pudo ser modificado.'
        })
    })
});

// ------------------ P R O D U C T : E l i m i n a c i ó n
app.delete('/product/:id', isAdmin, (req, res) =>{
    sql.query('DELETE FROM product WHERE id = ?',
    {
        replacements: [req.params.id]
    })
    .then(() =>{
        res.statusCode = 204;
        res.json();
        console.log(`Eliminación de producto exitosa.`);
    })
});

// ===========================================================================
// ------------------ A P L I C A C I Ó N - O R D E N E S --------------------
// ===========================================================================
// ------------------ O R D E N E S : C o n s u l t a - g e n e r a l
app.get('/orders', (req, res) =>{
    if(req.user.admin === 1) {
        console.log('Solicitud de usuario administrador.')
        sql.query('SELECT * FROM `orders`', {
            type: sql.QueryTypes.SELECT
        })
        .then(ordenes => {
            if(ordenes.length === 0){
                console.log('No hay pedidos registrados.');
                res.json({
                    text: '¡Ups! Parece que aún no tenemos ordenes registradas.',
                    orders: []
                })
            } else {
                return ordenes;
            }
        })
        .then(ordenesProductosxUser)
        .then(ordenes => {
            console.log(`Estos son los productos que se encontraron: ${JSON.stringify(ordenes)}`);
            res.json({
                text: 'Este es el registro de pedidos que tenemos hasta el momento:',
                orders: ordenes
            });
        })
    } else {
        console.log('Pedido de usuario general')
        sql.query('SELECT * FROM orders WHERE user_id = ?', {
            replacements: [req.user.id],
            type: sql.QueryTypes.SELECT
        })
        .then(orden => {
            if(orden.length === 0){
                console.log('No hay pedidos registrados.');
                res.json({
                    text: `¡Ups! Parece que aún no tenemos ordenes registradas de ${req.user.username}.`,
                    orders: []
                });
            } else {
                console.log(`Resultados ${JSON.stringify(orden)}`);
                res.json({
                    text: `Este es el registro de pedidos que tenemos hasta el momento de ${req.user.username}:`,
                    orders: orden
                });
            }
        })
    }
});
// ------------------ O R D E N E S : C r e a c i ó n
app.post('/orders', (req, res) =>{

    // Ajustes para constituir la descripción y el valor total de la orden
    let description = '';
    let total = 0;
    sql.query('SELECT * FROM product WHERE id IN (:ids)', {
        replacements: {
            ids: req.body.order_products.map(
                prod => {
                    return prod.prod_id;
                }
            )
        },
        type: sql.QueryTypes.SELECT
    })
    .then(products => {
        for (let prod of req.body.order_products) {
            let product = products.find(e => prod.prod_id === e.id);
            let key_words = product.name.match(/[a-zA-Z]{4,}/g);
            key_words = key_words.map(keyw => {
                return keyw.slice(0, 3);
            })
            let reducText = String().concat('', ...key_words);
            description += `${prod.qty}x${reducText}`;
            total += product.price * prod.qty;
        }
    })
    .then(async () =>{
        let response = await sql.query('INSERT INTO orders (`description`, total, user_id, payment, state, `date`) VALUES (?, ?, ?, ?, ?, ?)',
        {
            replacements: [
                description,
                total,
                req.user.id,
                req.body.payment,
                'Nuevo',
                new Date()
            ]
        })
        for (let prod of req.body.order_products){
            await sql.query('INSERT INTO order_products (product_id, order_id, product_quantity) VALUES (?, ?, ?)',
            {
                replacements: [
                    prod.prod_id,
                    response[0],
                    prod.qty
                ]
            }
            )
        }
        return response[0];
    })
    .then(response => {
        sql.query('SELECT * FROM orders WHERE id = ?', 
        {
            replacements: [response],
            type: sql.QueryTypes.SELECT
        })
        .then (orden => {
            if (orden[0]) {
                return orden[0];
            }
        })
        .then (ordenProductosxUser)
        .then (order => {
            res.statusCode = 201;
            console.log(`Pedido creado. ID ${order.id}: ${JSON.stringify(order)}`);
            res.json({
                text: `¡Genial! Tenemos un nuevo pedido para ${req.user.username}.`, 
                order: order
            })
        })
    })
    .catch(err => {
        res.statusCode = 400;
        console.error(`${err.message}\nEl pedido no pudo ser creado.`);
        res.json({error: '¡Ups! Algo salió mal y la orden no pudo ser creada.'});
      })
})
// ------------------ O R D E N E S : C o n s u l t a - p o r - I D
app.get('/orders/:id', (req, res) =>{
    if(req.user.admin === 1){
        console.log('Solicitud de usuario administrador.')
        sql.query('SELECT * FROM orders WHERE id = ?', {
            replacements: [req.params.id],
            type: sql.QueryTypes.SELECT
        })
        .then(orden => {
            if(orden[0]) {
                return orden[0];
            }
            else {
                res.statusCode = 404;
                console.log('El pedido no existe');
                res.json({
                    error: '¡Ups! La orden que buscas no lo encontramos.'
                })
            }
        })
        .then(ordenProductosxUser)
        .then(order => {
            console.log(`Información del pedido ${order.id}: ${JSON.stringify}`);
            res.json({
                text: `¡Que bien! Encontramos la información del pedido que solicitaste:`,
                order: order
            })
        })
    }
    else {
        console.log('Pedido de usuario general')
        sql.query('SELECT * FROM orders WHERE user_id = ? AND id = ?',
        {
            replacements: [req.user.id, req.params.id],
            type: sql.QueryTypes.SELECT
        })
        .then(order => {
            if(order[0]) {
                console.log(`Información del pedido ${order.id}: ${JSON.stringify}`);
                res.json({
                    text: `¡Que bien! Encontramos la información del pedido que solicitaste:`,
                    order: order
                })
            }
            else {
                res.statusCode = 404;
                console.log('El pedido no existe');
                res.json({
                    error: '¡Ups! La orden que buscas no la encontramos.'
                })
            }
        })
    }
});
// ------------------ O R D E N E S : A c t u a l i z a c i ó n - d e - e s t a d o
app.patch('/orders/:id', isAdmin, (req, res) => {
    sql.query('UPDATE orders SET state = ? WHERE id = ?', {
        replacements: [
            req.body.state,
            req.params.id
        ]
    })
    .then(respuesta =>{
        if(respuesta[0].affectedRows === 0){
            res.statusCode = 400;
            res.json({
                text: `Estado no actualizado. Estado actual ${req.body.state}`
            });
            throw `Estado no actualizado. Estado actual ${req.body.state}`;
        }
        else {
            return respuesta;
        }
    })
    .then(() => {
        sql.query('SELECT * FROM orders WHERE id = ?',
        {
            replacements: [req.params.id],
            type: sql.QueryTypes.SELECT
        })
        .then(ordenProductosxUser)
        .then(orden => {
            console.log(`Información del pedido ${orden.id}: ${JSON.stringify(orden)}`);
            res.json({
                text: '¡Que bien! Esta es la información actual la orden:',
                order: orden
            })
        })
    })
    .catch(err =>{
        res.statusCode = 400;
        res.json({
            text: `¡Ups! Algo salió mal, el estado ${req.body.state} es erroneo.`
        });
        throw `${err.message}\nEstado no actualizado. Estado ${req.body.state} es erroneo.`;
    })
})

// ------------------ O R D E N E S : E l i m i n a c i ó n
app.delete('/orders/:id', isAdmin, (req, res) => {
    sql.query('DELETE FROM orders WHERE id = ?',
      {
          replacements: [
              req.params.id
            ]
        })
        .then(() => {
            res.statusCode = 204;
            res.json();
            console.log(`Orden eliminada exitosamente`);
      }
    )
});

// ------------------ A J U S T E S
const ordenProductosxUser = async order => {
    let productosxOrden =
        await sql.query(
            'SELECT product.id, product.name, order_products.product_quantity FROM product, orders, order_products WHERE product.id = order_products.product_id AND order_products.order_id = ? AND orders.id = ?;',
    {
        replacements: [
            order.id,
            order.id
        ]
    })
    order.products = [...productosxOrden];
    order.user = await sql.query('SELECT * FROM user WHERE id = ?',
    {
        replacements: [order.user_id],
        type: sql.QueryTypes.SELECT
    })

    return order;
};

const ordenesProductosxUser = async orders => {
    for (let i = 0; i < orders.length; i ++) {
        let productosxOrden = 
            await sql.query(
                'SELECT product.id, product.name, order_products.product_quantity FROM product, orders,order_products WHERE product.id = order_products.product_id AND order_products.order_id = ? AND orders.id = ?',
                {
                    replacements: [orders[i].id, orders[i].id],
                    type: sql.QueryTypes.SELECT
                }
        );
        orders[i].products = [...productosxOrden];
        orders[i].user = await sql.query('SELECT * FROM user WHERE id = ?', {
            replacements: [orders[i].user_id],
            type: sql.QueryTypes.SELECT
        })
    }
    return orders;
};


// Inicio del servidor
app.listen(app.get('port'), () => {
    console.log('Servidor API Delilah Restó iniciado en el puerto', app.get('port'));
});




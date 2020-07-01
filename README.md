# Delilah-resto-v1.0

Delilah Restó es un proyecto de BackEnd dedicado a la creación y funcionamiento de una RestfullAPI. Creado para Acamica DWFS-BOG-GLOB01 2020.
Potenciada por Javascript y Node.js haciendo uso de las librerias _**express, jsonwebtoken, mysql y sequelize.**_

## Comenzando 🚀

Para hacer uso del proyecto, asegurate de _clonar o descargar_ el repositorio. También pueden hacer un _clone_ desde git, así:

```
git clone https://github.com/GisellG/Delilah-resto-v1.0.git
```

### Pre-requisitos 📋

Estos son las librerias que debes instalar para el funcionamiento del proyecto

```
npm install express, body-parser, jsonwebtoken, mysql2, sequelize
```

_**Opcional:**_ Puedes instalar nodemon
```
npm install nodemon
```

E ir haciendo pruebas de sesión en tiempo real ejecutando el siguiente comando:
```
npm run dev
```
### Instalación de la base de datos🔧

Lo primero ahora será gestionar la _base de datos_, para ello requerimos del documento que se encuentra en la carpeta 📂 _**/database.**_
Existen 2 (dos) documentos:
```
  - 📃 delilah-resto-db
```

Que es quien contiene la estructura de la base de datos, y
```
  - 📃 delilah-resto-db-mockups
```

que se usa para los _inserts_ de ejemplo dentro de la base de datos.

### 📌Importante
Se gestionaron dos usuarios que tendrán un rol vital en la gestión de pruebas.
  * 👩‍🍳 **Admin User:** Cuyas referencias estarán en el mismo documento y si se utiliza [Postman](https://www.postman.com/), será clave para las pruebas que requieran autenticación.
  * 💁 **Tester User:** También tiene sus referencias en el documento y se encuentra en el campo de pruebas de [Postman](https://www.postman.com/).

## Ejecutando las pruebas ⚙️

👩‍💻 Para iniciar las pruebas, es necesario hacer uso de la librería _**express**_.

Una vez iniciado el servidor, te recordamos que es posible usar _**nodemon**_ para una visualización en tiempo real.

## Despliegue 📦

Para probar cada endpoint de la API, puedes hacer las pruebas mediante Postman.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/cebbfaf5ac43fb9b6d60#?env%5BTesting%20API%5D=W10=)

## Construido con 🛠️

* [Express](https://expressjs.com/es/)
* [Sequelize](https://sequelize.org/)
* [JSON Web Token](https://jwt.io/)

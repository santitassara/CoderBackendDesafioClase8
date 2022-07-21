const fs = require('fs');

class Contenedor {
    constructor(archivo) {
        this.archivo = archivo;
    }

    async read() {
        try {
            let data = await fs.promises.readFile(`./${this.archivo}`, `utf-8`);
            return data;

        } catch (err) {
            // throw Error(`Error al leer el archivo ${err}`);
            await fs.promises.writeFile(`./${this.archivo}`, []);
        }
    }

    async write(datos, msg) {
        try {
            await fs.promises.writeFile(`./${this.archivo}`, JSON.stringify(datos, null, 2));
            console.log(msg);
        } catch (err) {
            throw Error(`Error al escribir en el archivo ${err}`);
        }
    }

    async save(product) {
        let newId = 1;
        let newProduct = {};
        

        let data = await this.read();
       
        console.log("*****************")
        console.log(product)

        if (!data) {
            let datos = [];
            product.id = newId;
            product.title=product.title +1 ;
            // product.title = product.title[newId];
            // product.price = product.price[newId];
            // product.thumbnail = product.thumbnail[newId];
            // console.log(product);
            newProduct = product;
            datos.push(newProduct);
            await this.write(datos, `Agregado!`);
        } else {
            let datos = JSON.parse(data);
            product.id = datos.map(item => item.id).reduce((a, b) => Math.max(a, b), 0) + 1,
            product.title= product.title + (datos.length +1)  ;
            // product.title = product.title[product.id];
            // product.price = product.price[product.id];
            // product.thumbnail = product.thumbnail[product.id];
            console.log(product);
            newProduct = product;
            datos.push(newProduct);
            await this.write(datos, `Agregado!`);
        }
        

    }

    async getById(myId) {
        let data = await this.read();
        let datos = JSON.parse(data);

        let result = datos.filter(product => product.id == myId);
        return result;
    }

    async getAll() {
        let data = await this.read();
        let datos = JSON.parse(data);

        return datos;
    }

    async deleteById(myId) {
        let data = await this.read();
        let datos = JSON.parse(data);

        let product = datos.find(product => product.id == myId);
        if (product) {
            let index = datos.indexOf(product);
            console.log(index);
            datos.splice(index, 1);
            await this.write(datos, `Producto con ID: ${myId} eliminado`);
        } else {
            console.log(`Producto con ID: ${myId} no existe`);
        }
    }

    async deleteAll() {
        let data = [];
        await this.write(data, `Se eliminaron todos los productos`);
    }
}
module.exports = Contenedor;


// Si tuvieramos el array con los datos de los productos, podríamos usar lo siguiente:

// const tableros = [
//   {title:"Tablero de madera",price:5000,thumbnail:"https://comprarajedrez.com/wp-content/uploads/2020/03/81hM8ahioQL._SL1500_.jpg"},
//   {title:"Tablero de vinilo",price:2000,thumbnail:"https://www.ichess.net/wp-content/uploads/2021/07/Regulation-Tournament-Chess-Pieces-and-Chess-Board-Combo-Green.jpg"},
//   {title:"Tablero imantado",price:3000,thumbnail:"https://http2.mlstatic.com/D_NQ_NP_948013-MCO44575103545_012021-O.webp"},
//   {title:"Tablero triple",price:9000,thumbnail:"https://dejadepensar.com/wp-content/uploads/2018/01/Tablero-de-ajedrez-para-3-jugadores.jpg"},
//   {title:"Tablero con reloj",price:17000,thumbnail:"https://www.ajedrez21.com/15934-large_default/computadora-reloj-dgt-pi.jpg"},
//   {title:"Tablero de marmol",price:5000,thumbnail:"https://www.deajedrez.net/wp-content/uploads/2017/07/royaltyroute-ajedrez-de-piedra-mrmol-octangle-forma-de-piezas-y-tablero.jpg"},
//   {title:"Tablero de inteligente",price:5000,thumbnail:"https://d500.epimg.net/cincodias/imagenes/2021/04/16/gadgets/1618561045_541719_1618561401_sumario_normal.jpg"},

// ]



let contenedor = new Contenedor(`./EjercicioProductos/productos.txt`);
async function test() {

   
   
    const newProduct = {
        // title: tableros.map(item => item.title),
        // price: tableros.map(item => item.price),
        // thumbnail: tableros.map(item => item.thumbnail)
        title: `Tablero`,
        price:  Math.floor(Math.random() * 1000),
        thumbnail:  `https://comprarajedrez.com/wp-content/uploads/2020/03/81hM8ahioQL._SL1500_.jpg`
    };
    //await contenedor.save(newProduct);
    //console.log(await contenedor.getById(2));
    //console.log(await contenedor.getAll());
    //await contenedor.deleteById(7);
    //await contenedor.deleteAll();
}
test();
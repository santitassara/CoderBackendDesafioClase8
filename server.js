const express = require("express")
const {Router} = express;
const contenedor = require("./EjercicioProductos/Index.js")
const app = express()
const PORT = process.env.PORT || 8080



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`./public`))

const productosRouter = Router()
app.use(`/api/productos`,productosRouter);

let miContenedor = new contenedor(`./EjercicioProductos/productos.txt`)


/* --------------------------- // Get Productos // -------------------------- */
productosRouter.get(``, async (req,res) => {
    (async () => {
        try{
            let allProducts = await miContenedor.getAll();
            return res.json(allProducts)
        } catch(err){
            return res.status(404).json({
                error:`Error ${err}`
            })
        }
})();
})

/* --------------------------- Get productos by Id -------------------------- */
productosRouter.get(`/:id`, async (req,res) => {
    (async () => {
        try{
            let productById = await miContenedor.getById(req.params.id);
            if ( productById.length == 0 ){
                return res.status(404).json({
                    error:`No existe el producto con id ${req.params.id}`
                })
            }else{
                return res.json(productById)
            }
        } catch(err){
            return res.status(404).json({
                error:`Error ${err}`
            })
        }
})();
})

/* ------------------------------ Add Producto ------------------------------ */
productosRouter.post(``, async (req,res) => {
    (async ()=>{
        const name = req.body.nombre;
        const price = Number(req.body.precio);
        const url = req.body.url;

        const newProduct = {
            title:`${name}`,
            price:`${price}`,
            thumbnail:`${url}`
        }
        const id = await miContenedor.save(newProduct);

        return res.json(`Producto agregado con id ${newProduct.id}`)
    })()
})


/* --------------------------- Modificar Producto --------------------------- */
productosRouter.put(`/:id`, async (req,res) => {
    (async ()=>{
        const id = Number(req.params.id)
        let allProducts = await miContenedor.getAll();
        const productIndex = allProducts.findIndex(product => product.id == id);

        console.log(req.body.nombre)

        if (productIndex == 0){
            return res.status(401).json({
                error:`No existe el producto con id ${id}`
            })
        }
        
        allProducts[productIndex].title = req.body.nombre;
        allProducts[productIndex].price = Number(req.body.precio);
        allProducts[productIndex].thumbnail = req.body.url;

        console.log(req.body.nombre)

        await miContenedor.write(allProducts, `Producto modificado`);
        return res.json(`Producto con id:${id} modificado`)
    })()
})

/* ------------------------- Eliminar Producto byId ------------------------- */
productosRouter.delete(`/:id`, async (req,res) => {
    (async ()=>{
        try {
            const id = Number(req.params.id)
            await miContenedor.deleteById(id);
            return res.json(`Producto con id:${id} eliminado`)
        }catch(err){
            return res.status(404).json({
                error:`Hubo un Error ${err}`
            })
        }
    })()
})


const server = app.listen(PORT, () => {
 console.log(`Servidor corriendo en puerto : ${PORT}`)
})

server.on("Error", error=>{console.log(`Hubo un error : ${error}`)})
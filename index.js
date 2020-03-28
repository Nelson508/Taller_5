'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Product = require('./modelos/product')

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/hola',(req,res)=>{

    res.status(200).send({message:"Bienvenido"})

})

app.get('/api/product',(req,res)=>{

    Product.find({},(err,product)=>{
        if(err) return res.status(500).send({message:'Error al realizar peticion'})
        if(!product) return res.status(404).send({message:'Error el producto no existe'})

        res.status(200).send({product})
    })
    
})

app.get('/api/product/:productId',(req,res)=>{

    let ProductId = req.params.productId
    Product.findById(ProductId,(err,product)=>{
        if(err) return res.status(500).send({message:'Error al realizar peticion'})
        if(!product) return res.status(404).send({message:'Error el producto no existe'})

        res.status(200).send({product})
    })

   
})

app.post('/api/product',(req,res)=>{

    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description

    product.save((err,productStore)=>{

        if(err) res.status(500).send(`Error base de datos> ${err}`)

        res.status(200).send({product:productStore})
    })

    
})
app.put('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId
    let update = req.body

    Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
        if(err) res.status(500).send({message: `Error al actualizar el producto: ${err}`})
        
        

        res.status(200).send({ product: productUpdate })


    })

})
app.delete('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId

    Product.findById(productId, (err, product) =>{
        if(err) res.status(500).send({message: `Error al borrar el producto: ${err}`})
        if(!product) return res.status(404).send({message:'Error el producto no existe'})

        product.remove(err =>{
            if(err) res.status(500).send({message: `Error al borrar el producto: ${err}`})
            res.status(200).send({message: 'El producto ha sido eliminado'})
        })
    })

})

mongoose.connect('mongodb+srv://NelsonDominguez:10089010Do@cluster0-rd260.mongodb.net/test?retryWrites=true&w=majority',(err,res)=>{

    if(err) throw err
    console.log('Conexion establecida')

    app.listen(3000,()=>{

        console.log("Esta corriendo en puerto 3000")
    
    })
})

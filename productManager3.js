import { promises as fs } from 'fs';

class ProductManager {
  constructor() {
    this.path = './productos.txt';
  }

  //Leo TXT y lo parseo Json para poder manipularlo como array
  addProduct = async (product) => {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
 //Consulto si mi producto esta en el array que me traje
    if (products.some(prod => prod.code === product.code)) {
      console.log(`No cumple, producto con el mismo codigo: ${product.code}`);
      return;
    }
// Valido que los campos y su tipo sean distinto de vacio
    if (product.title === "" || product.description === "" || product.price === "" || product.thumbnail === "" || product.code === "" || product.stock < 0) {
      console.log("Por favor revisa que los camposno esten vacios");
      return;
    } else {
      products.push(product);
    }

    await fs.writeFile(this.path, JSON.stringify(products));
  }

  // Get Products function
  getProducts = async () => {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    console.log(products);
  }

  // Get Product By ID function
  getProductById = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const product = products.find(prod => prod.id === id);

    product ? console.log(product) : console.log(`El producto con ID : ${id} no existe, ingresa otro.`);
  }

  // Update Product function
  updateProduct = async (id, { title, description, price, thumbnail, code, stock }) => {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const index = products.findIndex(prod => prod.id === id);

    if (index !== -1) {
      const product = products[index];
      product.title = title ?? product.title;
      product.description = description ?? product.description;
      product.price = price ?? product.price;
      product.thumbnail = thumbnail ?? product.thumbnail;
      product.code = code ?? product.code;
      product.stock = stock ?? product.stock;

      await fs.writeFile(this.path, JSON.stringify(products));
    } else {
      console.log(`Product with ID: ${id} not found`);
    }
  }

  // Delete Product function
  deleteProduct = async (id) => {
    const products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
    const prods = products.filter(prod => prod.id != id);

    await fs.writeFile(this.path, JSON.stringify(prods));
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.incrementID();
  }

  static idIncrement = 0; // inicializo la variable por que siempre me daba mal jaja

  static incrementID() {
    Product.idIncrement = Product.idIncrement ? Product.idIncrement + 1 : 1; // Usamos Product.idIncrement en lugar de this.idIncrement por que es una clase. 
    return Product.idIncrement;
  }
}

const product1 = new Product("Jabon1", "Skip", 1000, "Sin imagen", "7798989", 10);
const product2 = new Product("Jabon2", "Ala", 2000, "Sin Imagen", "7796767", 20);

const productManager = new ProductManager();


/* IMPORTANTE!! TESTEAR METODO A METODO YA QUE SI SE EJECUTAN TODOS A LA VEZ FALLA, POR QUE AGREGA UN "]"
AL ARCHIVO PRODUCTOS.TXT 
PRODUCTOS.TXT SE AGREGA A MANO [] */

productManager.addProduct(product1);
productManager.addProduct(product2);
//IMPORTANTE AGREGA UN PRODUCTO Y DALE UN TIEMPO POR QUE LA ESCRITURA A DISCO ES LENTA
productManager.getProducts();

productManager.getProductById(1);
productManager.getProductById(3);

productManager.updateProduct(1, { title: "Producto actualizado", description: "Producto actualizado" });
productManager.updateProduct(5, { title: "Producto actualizado", description: "Producto actualizado" });

productManager.deleteProduct(1);

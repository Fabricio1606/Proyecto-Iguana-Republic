const Cart = require("../models/cart.js");
const CartDetail = require("../models/cartDetail.js");
const Client = require("../models/client.js");
const Delivery = require("../models/delivery.js");
const sequelize = require("../config/sequelize.js");
const Product = require("../models/product.js");
const Orders = require("../models/orders.js");

class CartService {
    async getCartByClient(idClient) {
        return await Client.findOne({ where: { ClientIdClient: idClient, stateCart: 1 }});
    }

    async showCart(idClient) {
        var cart = await Cart.findOne({
            where: {
              ClientIdClient: idClient,
              stateCart: 1
            }
          });
        
          if(cart == null) {
            cart = await Cart.create({
              stateCart: 1,
              totalPriceCart: 0,
              ClientIdClient: idClient,
            });
        }
        return cart;
    }

    async deleteProduct(idDetail) {
        await sequelize.query("CALL SP_DELETEPRODUCTCART(:idDetail)",{
            replacements: { idDetail: idDetail }});
    }

    async addToCart(idProd, priceProd, quantityProd, idClient) {
        await sequelize.query("CALL SP_ADDPRODUCTCART(:client, :idprod, :price, :quant)",{
            replacements: { client: idClient, idprod: idProd, price: priceProd, quant: quantityProd }});
    }
}

module.exports = CartService;
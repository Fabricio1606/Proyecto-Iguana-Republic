const Order = require("../models/orders");
const sequelize = require("../config/sequelize.js");

class OrderService {
    async getAllOrdersByClient(idClient) {
        return await Order.findAll({ where: { ClientIdClient: idClient }});
    }

    async getOrderDetailById(id) {
        var entityList = [];
        await sequelize.query("CALL SP_ORDERDETAILBYID(:id)",{
            replacements: { id: id },
          }).then(entities => {
              entities.forEach(entity => {
                entityList.push({ nameProd: entity.nameProd, unitPrice: entity.unitPrice,
                  quantity: entity.quantity, Subtotal: entity.Subtotal });
              });
        });  
        return entityList;
    }

    async createOrder(totalPriceCart, ClientIdClient, CartIdCart, commentDeli) {
        await sequelize.query("CALL SP_CREATEORDER(:total, :client, :cart, :comment)",{
            replacements: { total: totalPriceCart, client: ClientIdClient, cart: CartIdCart, comment: commentDeli }});
    }

    async createOrderAdmin(statusOrder, paymentMethod, clientId, dateDeli, commentDeli) {
        await sequelize.query("CALL SP_CREATEORDERADMIN(:status, :payment, :client, :date, :comment)",{
            replacements: { statusOrder: statusOrder, payment: paymentMethod, client: clientId, date: dateDeli, comment: commentDeli }});
    }

    async modifyOrder(statusOrder, paymentMethod, clientId, dateDeli, commentDeli) {
        await Orders.update({
            statusOrder: statusOrder,
            paymentMethod: paymentMethod
        }, {
            where: { ClientIdClient: clientId }
        });

        const order = await Orders.findOne({
            where: { ClientIdClient: clientId }
        });

        await Delivery.update({
            dateDeli: dateDeli,
            commentDeli: commentDeli
        }, {
            where: { OrderIdOrder: order.idOrder }
        });
    }
}

module.exports = OrderService;
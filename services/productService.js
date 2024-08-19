const Category = require("../models/category");
const producto = require("../models/product")

class ProductService {
    async getProductById(id) {
        return await producto.findByPk(id, {
            include: Category
        });
    }

    async getAllByCategory(id) {
        return await producto.findAll({ where: { CategoryIdCate : id }});
    }

    async createProduct(nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd, imgProd) {
        const category = await Category.findOne({
            where: { nomCate: cateProd }
        });
        const CategoryIdCate = category.idCate;
        await producto.create({
            nameProd,
            imgProd,
            priceProd,
            stockProd,
            shortDescProd,
            descProd,
            CategoryIdCate
        });
    }

    async modifyProduct(idProd, nameProd, priceProd, stockProd, shortDescProd, descProd, cateProd) {
        const category = await Category.findOne({ where: { nomCate: cateProd } })
        const CategoryIdCate = category.idCate;
        await producto.update({
            nameProd,
            priceProd,
            stockProd,
            shortDescProd,
            descProd,
            CategoryIdCate
        }, {
            where: { idProd: idProd }
        });
    }
}

module.exports = ProductService;
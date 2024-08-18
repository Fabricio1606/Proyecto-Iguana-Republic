const MainModel = require("../models/mainModel");
const OrderService = require("../services/orderService.js");
const orderService = new OrderService();
const UserService = require("../services/userService.js");
const userService = new UserService();
const { Country } = require("country-state-city");

class MainController {
  constructor() {
    this.model = new MainModel();
  }

  getUser(req, res) {
    res.locals.user = req.session.client;
    const user = res.locals.user;
    return user;
  }

  async getIndex(req, res, next) {
    try{
      const user = this.getUser(req, res);
      user ? res.render("index", { user: user.userClient, admin: user.adminUser })
           : res.render("index");
    } catch(ex) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = this.getUser(req, res);
      if(user) {
        const profile = await userService.getProfile(user.idClient);
        const orders = await orderService.getAllOrdersByClient(user.idClient);
        const countries = Country.getAllCountries();
        
        res.render('profile', { user: user.userClient, admin: user.adminUser, profile: profile, orders: orders, countries: countries });
      } else {
        res.redirect("login")
      }
    } catch(ex) {
      next(ex);
    }
  }

  async getOrderDetail(req, res, next) {
    try{
      const user = this.getUser(req, res);
      const id = req.params.id;

      if(user) {
        const results = await orderService.getOrderDetailById(id);
        res.render("orderDetails", { user: user.userClient, admin: user.adminUser, products: results })
      } else {
        res.redirect("/login");
      }
    } catch(ex) {
      next(ex);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { nameClient, userClient, addressClient, nationClient, mailClient, phoneClient } = req.body;
      const user = this.getUser(req, res);

      if(user) {
        const update = { nameClient: nameClient, userClient: userClient, addressClient: addressClient, nationClient: nationClient,
                        mailClient: mailClient, phoneClient: phoneClient, idClient: user.idClient }
        await userService.updateUser(update);
        res.locals.user.userClient = userClient;

        res.json({ result: 1 });
      } else {
        res.json({ result: 3 })
      }
    }catch(ex) {
      res.json({ result: 2 })
    } 
  }

  async updatePassword(req, res, next) {
    const user = this.getUser(req, res);
    const { oldPass, newPass } = req.body;

    try {
      userService.updatePassword(oldPass, newPass, user.idClient)
        ? res.json({ result: 1 })
        : res.json({ result: 2 });
    } catch(ex) {
      res.json({ result: 3 });
    }
  }
}
module.exports = MainController;
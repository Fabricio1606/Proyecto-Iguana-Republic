const pool = require("../models/db");
const consulta = require('../queries/clientQuery');

const get = (req, res) => {
    pool.query(consulta.get, (error, result) => {
        if (error) throw error;
        res.status(200).json(result);
    });
}

module.exports = {
    get
}
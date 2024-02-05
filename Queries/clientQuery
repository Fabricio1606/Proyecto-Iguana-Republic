const get = "SELECT idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, adminUser FROM Client";
const getById = "SELECT idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, adminUser FROM Client WHERE idClient = $1";
const create = "INSERT INTO Client (idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, adminUser) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
const remove = "DELETE FROM Client WHERE idClient = $1";
const update = "UPDATE Client SET nameClient=$1, mailClient=$2, nationClient=$3, phoneClient=$4, addressClient=$5, userClient=$6, passClient_hash=$7, adminUser=$8 WHERE idClient = $9";

module.exports = {
    get,
    getById,
    create,
    remove,
    update,
};

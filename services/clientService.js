const Clients = require("../models/client.js");

class ClientService {
    async createClient(nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin) {    
        const hashedPassword = bcrypt.hashSync(passClient_hash, 10);
        await Clients.create({
            nameClient,
            mailClient,
            nationClient,
            phoneClient,
            addressClient,
            userClient,
            passClient_hash: hashedPassword,
            adminUser: userAdmin
        });
    }

    async modifyClient(idClient, nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient_hash, userAdmin) {
        if(passClient_hash === undefined || passClient_hash == null || passClient_hash == "") {
            await Clients.update({
                nameClient,
                mailClient,
                nationClient,
                phoneClient,
                addressClient,
                userClient,
                adminUser: userAdmin
            }, {
                where: { idClient : idClient }
            });
        } else {
            const hashedPassword = bcrypt.hashSync(passClient_hash, 10);
            const client = await Clients.update({
                nameClient,
                mailClient,
                nationClient,
                phoneClient,
                addressClient,
                userClient,
                passClient_hash: hashedPassword,
                adminUser: userAdmin
            }, {
                where: { idClient : idClient }
            });
        }
    }
}

module.exports = ClientService;

const Client = require("../models/client");
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(nameClient, mailClient, nationClient, phoneClient, addressClient, userClient, passClient) {
        const hashedPassword = bcrypt.hashSync(passClient, 10);
        const newClient = await Client.create({
            nameClient,
            mailClient,
            nationClient,
            phoneClient,
            addressClient,
            userClient,
            passClient_hash: hashedPassword,
            adminUser: false,
        });
        return newClient;
    }
    
    async getProfile(idClient) {
        return await Client.findOne({ where: { idClient: idClient }});
    }

    async getUserByUsername(userClient) {
        return await Client.findOne({ where: { userClient } });
    }

    async getUserByEmail(mailClient) {
        return await Client.findOne({ where: { mailClient } });
    }

    async updateUser(user) {
        await Client.update({
            nameClient: user.nameClient,
            userClient: user.userClient,
            addressClient: user.addressClient,
            nationClient: user.nationClient,
            mailClient: user.mailClient,
            phoneClient: user.phoneClient
        }, {
            where: { idClient: user.idClient }
        }).catch(error => {
            throw new Error(error);
        });
    }

    async updatePassword(oldPass, newPass, idClient) {
        try {
            const client = await Client.findOne({ where: { idClient: idClient } });
        
            if (!bcrypt.compareSync(oldPass, client.passClient_hash)) {
                return false;
            } else {
                const hashedPassword = bcrypt.hashSync(newPass, 10);
                await Client.update({
                    passClient_hash: hashedPassword,
                }, {
                    where: { idClient: idClient }
                }).catch(err => {
                    throw Error("Ocurrio un error a la hora de actualizar el usuario. " + err);
                })
                return true;
            }
        } catch(ex) {
            throw Error(ex);
        }
    }
}

module.exports = UserService;
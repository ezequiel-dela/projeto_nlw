import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate{
    socket_id: string;
    user_id: string,
    admin_id?: string;
    id?: string;
}

class ConnectionsService {
    private ConnectionRepository: Repository<Connection>

    constructor(){
        this.ConnectionRepository = getCustomRepository(ConnectionsRepository);
    }

    async create({socket_id, user_id, admin_id, id}: IConnectionCreate){
        const connection = this.ConnectionRepository.create({
            socket_id,
            user_id,
            admin_id,
            id
        });

        await this.ConnectionRepository.save(connection);

        return connection;
    }

    async findByUserId(user_id: string){
        const connection = await this.ConnectionRepository.findOne({
            user_id,
        });
        return connection;
    }

    async findAllWithoutAdmin(){
        const connections = await this.ConnectionRepository.find({
            where: {admin_id: null},
            relations: ["user"],
        });

        return connections; 
    }

    async findBySocketID (socket_id: string) {
        const connection = await this.ConnectionRepository.findOne({
            socket_id,
        });

        return connection;
    }

    async updateAdminID(user_id: string, admin_id: string){
        const connections = await this.ConnectionRepository
        .createQueryBuilder().
        update(Connection)
        .set({admin_id})
        .where("user_id = :user_id", {
            user_id
        }).execute();
    }
}

export { ConnectionsService }
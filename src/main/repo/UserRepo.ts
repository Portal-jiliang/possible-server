import { getConnection, Repository } from "typeorm";
import User from "@/model/User";
import Repo from "./Repo";

class UserRepo extends Repo {
    private repo?: Repository<User>;

    getRepo() {
        this.repo = getConnection().getRepository(User);
        return this.repo;
    }
}

export default new UserRepo();

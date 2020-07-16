import User from "@/model/User";
import Repo from "./Repo";

class UserRepo extends Repo<User> {
    getRepo() {
        return this.getRepoByEntity(User);
    }
}

export default new UserRepo();

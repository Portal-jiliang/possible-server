import Repo from "./Repo";
import Ctg from "@/model/Ctg";

class CtgRepo extends Repo<Ctg> {
    getRepo() {
        return this.getRepoByEntity(Ctg);
    }
}

export default new CtgRepo();

import Repo from "./Repo";
import Story from "@/model/Story";

class StoryRepo extends Repo<Story> {
    getRepo() {
        return this.getRepoByEntity(Story);
    }
}

export default new StoryRepo();

import Repo from "./Repo";
import Comment from "@/model/Comment";

class CommentRepo extends Repo<Comment> {
    getRepo() {
        return this.getRepoByEntity(Comment);
    }
}

export default new CommentRepo();

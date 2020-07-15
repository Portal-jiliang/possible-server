import Database from "./database/Database";

export default class Repo {
    constructor() {
        Database.createConnection();
    }
}

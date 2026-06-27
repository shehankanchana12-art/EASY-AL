import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("6a3fd45f001afa08b14c");

const account = new Account(client);
const databases = new Databases(client);

// Appwrite Database & Collection Configuration
const DATABASE_ID = "default";
const COLLECTION_USERS = "users";
const COLLECTION_PLANNER = "planner";

export { client, account, databases, ID, Query, DATABASE_ID, COLLECTION_USERS, COLLECTION_PLANNER };

import App from "./app";

import { UserController } from "./controllers/users/users.controller";

const PORT = '4001';  

// ATTACHING ALL THE CONTROLLERS
const app = new App([
    new UserController()
], PORT);

// STARTING THE SERVER
app.listen();

import "dotenv/config";

import App from "./app";
import { AdminController } from "./controllers/services/services.controller";



const PORT = '4003';  

// ATTACHING ALL THE CONTROLLERS
const app = new App([new AdminController()], PORT);

// STARTING THE SERVER
app.listen();

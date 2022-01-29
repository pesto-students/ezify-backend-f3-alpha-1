import "dotenv/config";

import App from "./app";

import { VendorController } from "./controllers/vendors/vendor.controller";

const PORT = '4002';  

// ATTACHING ALL THE CONTROLLERS
const app = new App([new VendorController()], PORT);

// STARTING THE SERVER
app.listen();

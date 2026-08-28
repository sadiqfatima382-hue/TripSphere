// import app from "./app.js";
// import env from "./config/env.js";

// const PORT = env.PORT;

// app.listen(PORT, () => {
//     console.log("TripSphere is Working💫");
// });

import app from "./app.js";
import env from "./config/env.js";
import { connectDatabase } from "./utils/database.js";

const PORT = env.PORT;

async function startServer() {
    try {
        await connectDatabase();

        app.listen(PORT, () => {
            console.log(`TripSphere is Working💫`);
        });
    } catch (error) {
        console.error("❌ Failed to start TripSphere server");
        console.error(error);

        process.exit(1);
    }
}

startServer();
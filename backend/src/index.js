import "./env/env.js"
import app from "./app.js";
import connectDB from "./lib/db.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Failed to start the server", error);
    });

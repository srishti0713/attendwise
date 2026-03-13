import app from "./app.js";

const PORT = process.env.PORT || 8000;

try {
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });
} catch (error) {
    console.log("Failed to start the server", error);
}

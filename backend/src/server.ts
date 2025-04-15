import mongoose from "mongoose";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

mongoose.connect('mongodb+srv://polamarasettidurgarao00008:7997@cluster0.zfnfuny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { dbName: "todo" })
    .then(() => {
        console.log("Mongoose connected");
        app.listen(5000, () => {
            console.log("Server running on port:5000 ");
        });
}).catch(console.error);


app.use(session({
    secret: 'asjhdahdflcasjfcai[vofeaivhirubfviorwenfvoierahfbsdhfgbhfvsehgfvadjsgfdv',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://polamarasettidurgarao00008:7997@cluster0.zfnfuny.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0'
    }),
}));


app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});



app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});



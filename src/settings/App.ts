import express, { Application } from "express";
import http from "http"
import { container } from "../infrastructure/config/di/containers/Container";
import { UserRoutes } from "../interfaceAdapters/routes/AuthRoutes";
import { Tokens } from "../constants/Tokens";
import { errorHandler } from "../middlewares/ErrorHandler";
import { env } from "../infrastructure/config/env/env";
import cors from "cors"
import cookieParser from "cookie-parser"

export class Settings {
    public App: Application;
    public server: http.Server;

    constructor() {
        this.App = express();
        this.server = http.createServer(this.App)
        this.setGlobalMiddlewares();
        this.setSecurityMiddlewares();
        this.setErrorHandling();
        this.setRoutes();
    }

    private setGlobalMiddlewares(): void {
        this.App.use(cookieParser())
        this.App.use(express.json())
        this.App.use(express.urlencoded({ extended: true }))

    }
    private setSecurityMiddlewares(): void {
        // this.App.options("*", cors()); // ✅ add this
        this.App.use(cors({
            origin: env.CLIENT_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

    }

    private setErrorHandling(): void {
        this.App.use(errorHandler)
    }
    private setRoutes(): void {

        const userRoutes = container.get<UserRoutes>(Tokens.authUserRoute)
        this.App.use("/api/user", userRoutes.router)
    }
    public listen(port: number): void {
        this.server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })
    }

    public getServer(): Application {
        return this.App
    }

}
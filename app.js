import { join } from "path";
import { config } from "dotenv";

config({ path: join(__dirname, "config.env") });

import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { pageNotFoundError, errorHandler } from "./handlers/errHandler";

import { carRouter } from "./route/carRouter";
import { shopRouter } from "./route/shopRouter";
import { userRouter } from "./route/userRouter";
import { forumRouter } from "./route/forumRouter";
import { reviewRouter } from "./route/reviewRouter";
import { todoRouter } from "./route/todoRouter";

import { multerSetup } from "./utils/multerSetup";

export const app = express();

app.use(morgan("tiny"));
app.use(multerSetup().array("image"));

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.use(process.env.DEFAULT_URL + "/carRental", carRouter);
app.use(process.env.DEFAULT_URL + "/shop", shopRouter);
app.use(process.env.DEFAULT_URL + "/user", userRouter);
app.use(process.env.DEFAULT_URL + "/forum", forumRouter);
app.use(process.env.DEFAULT_URL + "/review", reviewRouter);
app.use(process.env.DEFAULT_URL + "/todo", todoRouter);

app.use(errorHandler);
app.all("*", pageNotFoundError);

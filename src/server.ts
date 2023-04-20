import express from 'express';
import cors from "cors";
import config from './helpers/config'
import myDataSource from "./data-source";
import { Routes } from "./routes"
import { Request, Response } from "express"

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
    const app = express()

    app.use(express.urlencoded({ extended: false })); //
    app.use(express.json()); //
    app.use(cors());

    // register express routes from defined application routes
    Routes.forEach(route => {
      (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
        const result = (new (route.controller as any))[route.action](req, res, next)
        if (result instanceof Promise) {
          result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

        } else if (result !== null && result !== undefined) {
          res.json(result)
        }
      })
    })


    const PORT = config.port || 3000;

    if (config.environment !== 'test') {
      app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
    }
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

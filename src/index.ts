import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import "reflect-metadata";
import { createConnection } from "typeorm";
import session from 'express-session';
import connectRedis from "connect-redis";
import cors from "cors";

import { redis } from "./redis";
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

declare module 'express-session' {
  interface SessionData {
      userId: any;
  }
}

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [MeResolver, RegisterResolver, LoginResolver],
        authChecker: ({ context: {req} }) => {
          return !!req.session.userId;
        }
    });

    const apolloServer = new ApolloServer({ 
        schema,
        context: ({ req }: any) => ({ req }),
    });

    const app = Express();

    const RedisStore = connectRedis(session); 

    app.use(
        cors({
          credentials: true,
          origin: "https://studio.apollographql.com"
        })
      );

    app.use(
        session({
          store: new RedisStore({
            client: redis as any
          }),
          name: "qid",
          secret: "aslkdfjoiq12312",
          resave: false,
          saveUninitialized: true,
          cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            sameSite: 'none'
          }
        })
      );

    app.set('trust proxy', true)

    await apolloServer.start();

    apolloServer.applyMiddleware({ 
      app, 
      cors: false
    });

    app.listen(4000, () => {
        console.log('server started on http://localhost:4000/graphql')
    });

}

main();
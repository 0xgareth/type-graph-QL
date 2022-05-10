import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import "reflect-metadata";

@Resolver()
class HelloResolver {
  
  @Query(() => String) 
  async hello() {
    return "Hello world!";
  }
}

const main = async () => {

    const schema = await buildSchema({
        resolvers: [HelloResolver],
    });

    const apolloServer = new ApolloServer({ schema });

    const app = Express();

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on http://localhost:4000/graphql')
    });

}

main();
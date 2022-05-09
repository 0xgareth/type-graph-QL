import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";

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

    apolloServer.applyMiddleware({ app });

    app.listen(4000)

}

main();
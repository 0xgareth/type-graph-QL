import { Resolver, Query, Ctx } from "type-graphql";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 5 })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session!.userId) {
      console.log(ctx.req.session);
      console.log('did not find a userId in session');
      return null;
    }

    return User.findOne(ctx.req.session!.userId);
  }
}


import { Resolver, Mutation, Arg } from "type-graphql";
// import bcrypt from "bcryptjs";

import { User } from "../../entity/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(@Arg("data") { token, password }: ChangePasswordInput): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
        return null;
    }

    // const user = await User.findOneBy({ id: parseInt(userId, 10) })
    const user = await User.findOne({});

    console.log(user);

    if (!user) {
        return null;
    }

    console.log(password);

    await redis.del(forgotPasswordPrefix + token);
    // user.password = bcrypt.hash(password, 12);
    
    await user.save();

    return user;
  }
}
import { Connection } from "typeorm";

import { gCall } from "../../../../test-utils/gCall";
import { testConn } from "../../../../test-utils/testConn";

let conn: Connection;

beforeAll(async () => {
    await testConn(); 
});

afterAll(async () => {
    await conn.close();
})

describe('Register', () => {
    it('create user', () => {
        gCall({
            source:''
        })
    })
});
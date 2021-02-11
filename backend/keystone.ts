import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { User } from './schemas/User';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';

const databaseURl = process.env.DATABASE_URL || 'mongodb://localhost/sickfits';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // How long they stay singed in?
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // Todo: add in initial roles here
    }
});

export default withAuth(
    config({
        // @ts-ignore
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true
            }
        },
        db: {
            adapter: 'mongoose',
            url: databaseURl,
            // Todo add data seeding here
        },
        lists: createSchema({
            // schema items go in here
            User
        }),
        ui: {
            // show the ui only for the people who pass this test
            isAccessAllowed: ({ session }) => {

                return !!session?.data;
            }
        },
        // Todo: add session values here
        session: withItemData(statelessSessions(sessionConfig), {
            // GraphQl query
            User: 'id name email'
        })
    })
);
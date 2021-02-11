import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';

const databaseURl = process.env.DATABASE_URL || 'mongodb://localhost/sickfits';

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // How long they stay singed in?
    secret: process.env.COOKIE_SECRET,
};

export default config({
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
    }),
    ui: {
        // Todo change this for roles
        isAccessAllowed: () => true
    },
    // Todo: add session values here
});
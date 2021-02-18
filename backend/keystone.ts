import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Prodcut';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

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
            async onConnect(keystone){
                console.log('Connected to the database')
                if(process.argv.includes('--seed-data')){
                    await insertSeedData(keystone);
                }
            }
        },
        lists: createSchema({
            // schema items go in here
            User,
            Product,
            ProductImage
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
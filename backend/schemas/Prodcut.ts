import { integer, relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Product = list({
    // Todo 
    fields: {
        name: text({ isRequired: true }),
        description: text({
            ui: {
                displayMode: 'textarea'
            }
        }),
        photo: relationship({
            ref: 'ProductImage.product',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'altText'],
                inlineCreate: { fields: ['image', 'altText'] },
                inlineEdit: { fields: ['image', 'altText'] }
            }
        }),
        status: select({
            options: [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'available', value: 'AVAILABLE' },
                { label: 'Unavailable', value: 'UNAVILABLE' },
            ],
            defaultValue: 'DRAFT',
            ui: {
                displayMode: 'segmented-control',
                createView: { fieldMode: 'hidden' }
            }
        }),
        price: integer(),
        // Todo photo
    }
});
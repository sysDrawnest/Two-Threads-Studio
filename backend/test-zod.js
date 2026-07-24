import { createProductSchema, updateProductSchema } from './src/validators/product.validator';
const payload = {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    categoryId: 'cuid-123456789012345678901234',
    images: [
        { url: 'url1', isPrimary: true, sortOrder: 0 },
        { url: 'url2', isPrimary: false, sortOrder: 1 }
    ]
};
async function test() {
    try {
        const created = await createProductSchema.parseAsync({ body: payload });
        console.log('Create Payload images:', created.body.images);
        const updated = await updateProductSchema.parseAsync({
            params: { id: 'cuid-123456789012345678901234' },
            body: payload
        });
        console.log('Update Payload images:', updated.body.images);
    }
    catch (err) {
        console.error(JSON.stringify(err, null, 2));
    }
}
test();

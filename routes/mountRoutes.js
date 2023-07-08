
// require routes
const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const brandRoute = require('./brandRoute');
const productRoute = require('./productRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');
const addressesRoute = require('./addressesRoute');
const couponRoute = require('./couponRoute');
const cartRoute = require('./cartRoute');

module.exports = (app) => {
    // mainPath
    const mainPath = "/api/v1";

    // Mount routes
    app.use(`${mainPath}/categories`,categoryRoute);
    app.use(`${mainPath}/subCategories`,subCategoryRoute);
    app.use(`${mainPath}/brands`,brandRoute);
    app.use(`${mainPath}/products`,productRoute);
    app.use(`${mainPath}/users`,userRoute);
    app.use(`${mainPath}/auth`,authRoute);
    app.use(`${mainPath}/reviews`,reviewRoute);
    app.use(`${mainPath}/wishlist`,wishlistRoute);
    app.use(`${mainPath}/addresses`,addressesRoute);
    app.use(`${mainPath}/coupons`,couponRoute);
    app.use(`${mainPath}/cart`,cartRoute);
}
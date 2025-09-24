import stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripes = new stripe(process.env.STRIPE_SECRET_KEY);

export const checkout = async (req, res, next) => {
   try {
      const { products } = req.body;

      const session = await stripes.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: products.map((product) => {
            return {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: product.title,
                     // images: [product.image],
                  },
                  unit_amount: (product.regularPrice - product.discountPrice) * 100,
               },
               quantity: product.quantity,
            }
         }),
         mode: 'payment',
         success_url: "http://localhost:3000/success",
         cancel_url: 'http://localhost:3000/cancel',
      });
      res.json({ id: session.id });
   } catch (error) {
      next(error);
   }
}
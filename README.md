# REST API Admin Shop with Express and TypeScript

This application is a REST API developed using Express and TypeScript for an example admin online shop app.

## Features
- Framework: Express.js
- Language: TypeScript
- Middleware: Body-parser, CORS, Helmet, and more
- Secure authentication with JWT and bcrypt
- Input validation using Zod
- Database access via Prisma ORM
- Rate limiting and sanitization for security
- Product management
- Order management
- Customer management
- User authentication and authorization

## Requirements
Make sure you have installed:
- [Node.js](https://nodejs.org/) (latest version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/mrizkinm/express-admin-shop.git
   cd express-admin-shop
   ```
2. Install dependencies:
   ```sh
   npm install
   # or with yarn
   yarn install
   ```
3. Contact the author to obtain the `.env` file and Prisma schema before running the application.

## Prisma Schema
The `prisma/schema.prisma` file is not included in the repository. Please contact the author to obtain it.

## Running the Server
To run the server in development mode:
```sh
npm run dev
# or with yarn
yarn dev
```

To run the server in production mode:
```sh
npm run build
npm start
# or with yarn
yarn build
yarn start
```

<!-- ## Project Structure
```
├── src/
│   ├── config/
│   ├── controllers/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   ├── seeds/
│   ├── services/
│   ├── validations/
│   ├── app.ts
│   ├── server.ts
├── prisma/
│   ├── (schema.prisma - Not included in repo)
├── .env.example
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
``` -->

<!-- ## API Endpoints
Example API endpoints:
- `GET /api/v1/products` - Fetch a list of products
- `POST /api/v1/products` - Create a new product
- `PUT /api/v1/products/:id` - Update a product by ID
- `DELETE /api/v1/products/:id` - Delete a product by ID
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/orders` - Fetch user orders
- `POST /api/v1/orders` - Create a new order -->

## Technologies Used
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Zod](https://zod.dev/) (for schema validation)
- [Helmet](https://helmetjs.github.io/) (for security)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) (for rate limiting)
- [xss-clean](https://www.npmjs.com/package/xss-clean) (to prevent XSS attacks)

## Contact
For any questions or to obtain the Prisma schema, please contact the author.

---

If you have any questions or would like to contribute, feel free to open an issue or submit a pull request!


# Century 360 Project

Century 360 is a comprehensive Next.js application integrated with Prisma ORM
and SQL Server to provide a robust platform for managing product catalogs,
variants, and related data. This project features a modular architecture with
seamless database integration, data seeding, and API connectivity, designed for
scalability and maintainability.

## Features

- **Product Catalog**: Manage products with detailed information, including
  pricing, descriptions, and categories.
- **Variant Management**: Handle multiple variants of products, supporting
  different attributes such as size, color, and pricing tiers.
- **Seeding**: Easily populate your database with initial or test data using
  built-in seeding scripts.
- **API Integration**: Connect and interact with external APIs to enrich product
  data and support dynamic content.
- **Database Management**: Utilize Prisma migrations and schema management for
  efficient database evolution.
- **Developer Tools**: Access Prisma Studio for visual database management and
  use various scripts to streamline development.

## Technology Stack

- **Next.js** – React framework for server-side rendering and static site
  generation.
- **Prisma** – Next-generation ORM for TypeScript and Node.js.
- **SQL Server** – Relational database management system.
- **TypeScript** – Typed superset of JavaScript for improved developer
  experience.
- **Fast-CSV** – CSV parsing and formatting utility for data import/export.
- **Docker** – Containerization platform (optional, for running SQL Server
  locally).

## Getting Started

### Prerequisites

- **Node.js** (v16 or newer recommended)
- **pnpm** (preferred package manager)
- **Docker** (optional, for running SQL Server locally)
- **SQL Server** instance (local or remote)

### Setting up SQL Server locally (optional)

If you do not have access to a remote SQL Server, you can run one locally using
Docker:

```bash
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourStrong!Passw0rd' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

Make sure to update your `.env` file with the correct connection string.

## Scripts

The following scripts are available via `pnpm` or `npm run`:

- `prisma:generate` – Generate Prisma client based on the schema.
- `prisma:migrate` – Create and apply migrations to the database.
- `prisma:push` – Push the Prisma schema state to the database without
  generating migrations.
- `prisma:studio` – Open Prisma Studio, a GUI for managing your database.
- `db:seed` – Seed the database with initial data.
- `db:up` – Apply all pending migrations.
- `db:down` – Roll back the last migration.
- `db:logs` – View database migration logs.
- `db:status` – Show current migration status.
- `db:sql` – Generate SQL from migrations without applying.
- `dev` – Run the Next.js development server.
- `build` – Build the Next.js production application.
- `start` – Start the Next.js production server.
- `lint` – Run ESLint to check code quality.
- `typecheck` – Run TypeScript type checking.
- `format` – Format code using Prettier.

## Development Workflow

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Set up your database**:

- Start your SQL Server instance (local or remote).
- Configure your connection string in `.env`.

3. **Generate Prisma client and run migrations**:

   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

4. **Seed the database**:

   ```bash
   pnpm db:seed
   ```

5. **Run the development server**:

   ```bash
   pnpm dev
   ```

6. **Open Prisma Studio to inspect your database**:

   ```bash
   pnpm prisma:studio
   ```

## Modules Overview

- **Pages**: Next.js pages handle routing and server-side rendering for the app.
- **Components**: Reusable React components that form the UI, including product
  listings, variant selectors, and forms.
- **Prisma Schema Models**: Define the database structure including models for
  Products, Variants, Categories, and related entities.
- **Seeding Scripts**: Scripts to populate the database with sample or initial
  data.
- **API Routes**: Backend endpoints for handling requests related to products,
  variants, and other resources.
- **Utilities**: Helper functions and integrations such as CSV parsing and
  external API connectors.

## Contributing

We welcome contributions to the Century 360 Project! Please follow these
guidelines:

- Fork the repository and create your branch from `main`.
- Write clear, concise commit messages.
- Ensure your code passes linting and type checks (`pnpm lint`,
  `pnpm typecheck`).
- Write tests for new features or bug fixes where applicable.
- Submit a pull request with a detailed description of your changes.
- Engage in code review and address feedback promptly.

## Running the Development Server

To start the development server and see the app in action, run:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the
application. The page will auto-update as you edit the source files.

---

For more information about Next.js, Prisma, and SQL Server, please refer to
their official documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Microsoft SQL Server Documentation](https://docs.microsoft.com/en-us/sql/sql-server)

Happy coding!

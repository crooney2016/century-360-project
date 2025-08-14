import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

// Create the GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [resolvers as typeof resolvers], // Use proper resolver typing
});

// Create Apollo Server instance
const server = new ApolloServer({
  schema,
  // Enable GraphQL Playground in development
  introspection: process.env.NODE_ENV !== "production",
  // Add custom plugins for logging, metrics, etc.
  plugins: [
    // You can add plugins here for:
    // - Request logging
    // - Performance monitoring
    // - Authentication
    // - Rate limiting
    {
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext: unknown) {
            // TODO: Implement proper request context typing when adding GraphQL monitoring
            if (process.env.NODE_ENV === "development") {
              console.log(
                "GraphQL Operation:",
                (requestContext as { request: { operationName: string } }).request.operationName
              );
            }
          },
          async didEncounterErrors(requestContext: unknown) {
            // TODO: Implement proper error context typing when adding GraphQL error handling
            console.error("GraphQL Errors:", (requestContext as { errors: unknown[] }).errors);
          },
        };
      },
    },
  ],
});

// Define the GraphQL context type
export interface GraphQLContext {
  req: unknown; // TODO: Implement proper Next.js request typing when adding authentication
  res: unknown; // TODO: Implement proper Next.js response typing when adding authentication
  // user?: User;
}

// Create the Next.js handler
export const handler = startServerAndCreateNextHandler(server, {
  context: async (req: unknown, res: unknown): Promise<GraphQLContext> => {
    // Add authentication context here
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // const user = await verifyToken(token);

    return {
      req,
      res,
      // user,
      // Add any other context you need
    };
  },
});

export { server };

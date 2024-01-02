require('dotenv').config();

export class AppDataBase {
  private syncUrls = {
    http: `${process.env.URL_PATH}:${process.env.GRAPHQL_PORT}/${process.env.GRAPHQL_PATH}`,
    ws: `ws://${process.env.URL_DOMAIN}:${process.env.GRAPHQL_SUBSCRIPTION_PORT}/${process.env.GRAPHQL_SUBSCRIPTION_PATH}`
  };
}
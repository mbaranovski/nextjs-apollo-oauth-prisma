import { onError } from "apollo-link-error";
import redirect from "./redirect";

export const errorLink = onError(({ graphQLErrors, networkError }) => {

  handleGraphQLErrors(graphQLErrors);

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export const handleGraphQLErrors = (graphQLErrors, res) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case "INSUFFICIENT_FACEBOOK_PERMISSIONS":
          console.log("[graphQLError]: ", err);

          if(res) redirect({res}, err.extensions.exception.rerequest);
          break;
        default:
          console.log("[graphQLError]: ", err);
      }
    }
  }
}
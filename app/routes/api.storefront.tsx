import { json, type LoaderFunctionArgs } from "@remix-run/node";

// TODO: Replace with your actual Storefront API access token from Shopify Admin
// Go to: Apps > Develop apps > Your App > Storefront API > Install & generate token
const STOREFRONT_API_TOKEN = "your-storefront-api-token-here";
const SHOP_DOMAIN = "your-shop-domain.myshopify.com";

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { action, variantId, quantity = 1, cartId } = body;

    let query: string;
    let variables: any;

    if (action === "createCart") {
      query = `
        mutation cartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      variables = {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity: quantity,
            },
          ],
        },
      };
    } else if (action === "addToCart") {
      query = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              checkoutUrl
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      variables = {
        cartId: cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity: quantity,
          },
        ],
      };
    } else {
      return json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await fetch(`https://${SHOP_DOMAIN}/api/2023-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Storefront API errors:", data.errors);
      return json({ error: "GraphQL errors", details: data.errors }, { status: 400 });
    }

    return json(data.data);
  } catch (error) {
    console.error("Storefront proxy error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}; 
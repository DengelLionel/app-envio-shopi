import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `NUEVO PRODUCTO ACTIVO 2`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
}

export default function Agregar_producto() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <ui-title-bar title="Remix app template">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <div>
              <VerticalStack gap="5">
             
                <VerticalStack gap="2">
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                 
                </VerticalStack>
                <HorizontalStack gap="3" align="end">
                  {actionData?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                    >
                      View product
                    </Button>
                  )}
                  <Button loading={isLoading} primary onClick={generateProduct}>
                    Generate a product
                  </Button>
                </HorizontalStack>
                {actionData?.product && (
                  <Box
                    padding="4"
                    background="bg-subdued"
                    borderColor="border"
                    borderWidth="1"
                    borderRadius="2"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(actionData.product, null, 2)}</code>
                    </pre>
                  </Box>
                )}
              </VerticalStack>
            </div>
          </Layout.Section>
          <Layout.Section secondary>
            <VerticalStack gap="5">
          
            
            </VerticalStack>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
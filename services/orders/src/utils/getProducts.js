const getProductsByIDS = async (productIDs) => {
    try {
        if (!productIDs || productIDs.length === 0) {
            throw new Error("No product IDs provided");
        }

        const variables = { ids: productIDs };
        const PRODUCT_SERVICE_URL = "http://localhost:8002/product";

        const response = await fetch(PRODUCT_SERVICE_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query GetProductsByIDS($ids: [ID!]!) {
                        getProductsByIDS(ids: $ids) {
                            success
                            message
                            products {
                                _id
                                price
                                inventory
                            }
                        }
                    }
                `,
                variables,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get products");
        }

        const data = await response.json();

        if (!data || !data.data || !data.data.getProductsByIDS) {
            throw new Error("Unexpected response structure from product service");
        }

        const { success, message, products } = data.data.getProductsByIDS;

        if (!success) {
            throw new Error(message || "Failed to get products");
        }

        return products;
    } catch (error) {
        throw new Error(`Error getting products: ${error.message}`);
    }
};

module.exports = { getProductsByIDS };

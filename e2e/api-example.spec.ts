import { test, expect } from '@playwright/test';

interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: object;
}

function isValidProduct(obj: any): obj is Product {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'string' &&
    typeof obj.brand === 'string' &&
    typeof obj.category === 'object'
  );
}

function validProductListResponse(response: any): string[] {
  const errors: string[] = [];

  if (!Array.isArray(response)) {
    errors.push('Response is not an array');
    return errors;
  }

  response.forEach((item, index) => {
    if (!isValidProduct(item)) errors.push(`Item ${index} is invalid`);
  });

  return errors;
}

test.only('Verify api Products List', async ({ request }) => {
  const response = await test.step('When call api get all products list', async () => {
    return await request.get('/api/productsList');
  });

  //Status Codes
  await test.step('Then api response with Status Codes 200', async () => {
    expect(response.ok()).toBeTruthy();
  });

  const productsData = await response.json();
  const products = await productsData.products;

  //Response Body
  await test.step('And api response with full product information', async () => {
    const errors = validProductListResponse(products);
    expect(errors, `Validation failed:\n${errors.join('\n')}`).toHaveLength(0);
  });

  //Headers
  //Performance
  //Edge Cases
});

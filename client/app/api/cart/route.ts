import { NextResponse } from 'next/server';

// This is a temporary mock implementation. Replace with your actual cart data storage
let mockCartItems = [
  {
    product: {
      name: "Sample Product 1",
      price: 29.99,
      discountPrice: 24.99
    },
    quantity: 2
  }
];

export async function GET() {
  try {
    // Replace this with your actual cart data fetching logic
    return NextResponse.json(mockCartItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}
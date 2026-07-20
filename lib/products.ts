import prisma from './prisma';

export interface Product {
  id: number;
  img: string;
  cat: string;
  name: string;
  original: string | null;
  sale: string;
  priceNum: number;
  badge: string;
  stock: string | null;
  desc: string;
  origin: string;
  treatment: string;
  cert: string;
}

export async function getAllProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany();
  // Map Float to number to satisfy types
  return dbProducts.map(p => ({
    ...p,
    priceNum: Number(p.priceNum)
  }));
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({
    where: { id }
  });
  if (!p) return undefined;
  return {
    ...p,
    priceNum: Number(p.priceNum)
  };
}

export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: {
      cat: {
        equals: categoryName
      }
    }
  });
  return dbProducts.map(p => ({
    ...p,
    priceNum: Number(p.priceNum)
  }));
}

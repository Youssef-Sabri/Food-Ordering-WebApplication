import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const lang = searchParams.get("lang") || "en";

  try {

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameAr: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { category: "asc" },
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحميل المنتجات" : "Failed to fetch products" }, { status: 500 });
  }
}

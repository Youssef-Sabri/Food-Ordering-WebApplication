import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authUser = getAuthenticatedUser(request);
  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { nameEn, nameAr, descriptionEn, descriptionAr, category, price, image } =
      await request.json();

    const product = await prisma.product.create({
      data: { nameEn, nameAr, descriptionEn, descriptionAr, category, price, image },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

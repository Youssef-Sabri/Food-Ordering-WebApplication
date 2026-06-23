import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const { nameEn, nameAr, descriptionEn, descriptionAr, category, price, image } =
      await request.json();

    const product = await prisma.product.create({
      data: { nameEn, nameAr, descriptionEn, descriptionAr, category, price, image },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل إنشاء المنتج" : "Failed to create product" }, { status: 500 });
  }
}

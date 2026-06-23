import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحديث المنتج" : "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل حذف المنتج" : "Failed to delete product" }, { status: 500 });
  }
}

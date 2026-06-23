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
    const { nameEn, nameAr } = await request.json();
    if (!nameEn || !nameAr) {
      return NextResponse.json({ error: lang === "ar" ? "جميع الحقول مطلوبة" : "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { nameEn } });
    if (existing) {
      return NextResponse.json({ error: lang === "ar" ? "الفئة موجودة بالفعل" : "Category already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({ data: { nameEn, nameAr } });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل إنشاء الفئة" : "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const { id, nameEn, nameAr } = await request.json();
    const category = await prisma.category.update({ where: { id }, data: { nameEn, nameAr } });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحديث الفئة" : "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل حذف الفئة" : "Failed to delete category" }, { status: 500 });
  }
}

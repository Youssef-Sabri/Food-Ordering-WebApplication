import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!requireAdmin(authUser)) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحميل الطلبات" : "Failed to fetch orders" }, { status: 500 });
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
    const { id, status } = await request.json();
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحديث الطلب" : "Failed to update order" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: lang === "ar" ? "الطلب غير موجود" : "Order not found" }, { status: 404 });
    }

    if (order.userId !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: lang === "ar" ? "فشل تحميل الطلب" : "Failed to fetch order" }, { status: 500 });
  }
}

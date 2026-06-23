import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  try {
    const { address, paymentMethod, items } = await request.json();

    if (!address || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: lang === "ar" ? "جميع الحقول مطلوبة" : "Missing required fields" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: authUser.userId,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
        totalAmount,
        items: {
          create: items.map(
            (item: { productId: string; quantity: number; price: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: lang === "ar" ? "فشل إنشاء الطلب" : "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const authUser = getAuthenticatedUser(request);
  if (!authUser) {
    return NextResponse.json({ error: lang === "ar" ? "غير مصرح" : "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: authUser.userId },
      include: {
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

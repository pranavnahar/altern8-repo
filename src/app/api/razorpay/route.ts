import {  NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const POST = async(req: Request) => {
    const body = await req.json();
    const { amount, currency, receipt } = body;
if (!amount || !currency || !receipt) {
    return NextResponse.json(
      { error: 'amount, currency, and receipt are required' },
      { status: 400 }
    );
  }
    try {
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt,
      });
      return NextResponse.json(order,{status:200})
    } catch (error) {
      return NextResponse.json(error,{status:500})
    }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const data = await request.json();

    const paymentId = data.razorpay_payment_id;
    const orderId = data.razorpay_order_id;
    const signature = data.razorpay_signature;

    if (!paymentId || !orderId || !signature) {
      return new Response(
        JSON.stringify({
          verified: false,
          error: "Missing payment details"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const secret = env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return new Response(
        JSON.stringify({
          verified: false,
          error: "Razorpay credentials are not configured"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const message = `${orderId}|${paymentId}`;

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );

    const calculatedSignature = Array.from(
      new Uint8Array(signatureBuffer)
    )
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");

    const verified = calculatedSignature === signature;

    return new Response(
      JSON.stringify({ verified }),
      {
        status: verified ? 200 : 400,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        verified: false,
        error: "Payment verification failed"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

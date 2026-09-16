export async function onRequestPost(context) {
  try {
    const { env, request } = context;

    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
      return Response.json(
        { error: "Razorpay is not configured on the server yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isInteger(amount) || amount < 100) {
      return Response.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    const receipt = `mbg_${Date.now()}`;

    const auth = btoa(
      `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`
    );

    const r = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
          receipt: receipt
        })
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return Response.json(
        {
          error:
            data?.error?.description ||
            "Could not create Razorpay order."
        },
        { status: 502 }
      );
    }

    return Response.json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      key_id: env.RAZORPAY_KEY_ID
    });

  } catch (e) {
    return Response.json(
      { error: "Server error while creating payment order." },
      { status: 500 }
    );
  }
}

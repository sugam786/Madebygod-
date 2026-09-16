export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();
    const amount = Number(data.amount);

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const keyId = env.RAZORPAY_KEY_ID;
    const keySecret = env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: "Razorpay credentials are not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const auth = btoa(`${keyId}:${keySecret}`);

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/orders",
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: "INR",
          receipt: `mbg_${Date.now()}`
        })
      }
    );

    const result = await razorpayResponse.json();

    return new Response(JSON.stringify(result), {
      status: razorpayResponse.status,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to create Razorpay order"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

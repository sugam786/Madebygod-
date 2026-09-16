function toHex(buffer) {
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return toHex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message)));
}

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    if (!env.RAZORPAY_KEY_SECRET) return Response.json({ error: 'Razorpay secret is not configured.' }, { status: 503 });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ verified: false, error: 'Missing payment verification fields.' }, { status: 400 });
    }
    const expected = await hmacHex(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
    const a = expected.toLowerCase();
    const b = String(razorpay_signature).toLowerCase();
    const verified = a.length === b.length && [...a].every((c, i) => c === b[i]);
    return Response.json({ verified });
  } catch (e) {
    return Response.json({ verified: false, error: 'Verification failed.' }, { status: 500 });
  }
}

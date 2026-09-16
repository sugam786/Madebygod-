const COLORS=["Pink","Sky Blue","Ivory","Lavender","Black","Mint Green","Peach","Red","Yellow","Beige","Navy Blue"];
const SIZES=["S","M","L","XL"];
const newPartyShrug={id:11,name:"Women Fashion Shrugs for Party Wear",desc:"Elegant net shrugs with pearl detailing, perfect for party wear and sarees.",img:"images/women-fashion-shrugs-party.png",price:750,colors:["Maroon","Black","Navy Blue","Bottle Green","Purple","Pink","Beige","Grey","Rust Orange"],sizes:["S","M","L","XL"]};
const products=[
{id:1,name:"Pink Crystal Net Shrug",desc:"Sheer embellished shrug with delicate floral details and crystal-style buttons.",img:"images/product-01-pink.png"},
{id:2,name:"Multi-Colour Shrug Collection",desc:"A versatile collection look showcasing graceful colours and occasion styling.",img:"images/product-02-colour-collection.png"},
{id:3,name:"Blush Embroidered Shrug",desc:"Elegant blush layer with refined embroidery, perfect for celebrations.",img:"images/product-03-blush.png"},
{id:4,name:"Evening Blush Shrug",desc:"Long occasion shrug with sparkling detailing for evening looks.",img:"images/product-04-evening-blush.png"},
{id:5,name:"Mustard Flowing Shrug",desc:"Flowing mustard layer with a graceful silhouette for easy styling.",img:"images/product-05-mustard.png"},
{id:6,name:"Navy Long Shrug",desc:"Classic long navy layer that pairs beautifully with festive and casual outfits.",img:"images/product-06-navy.png"},
{id:7,name:"Yellow Embellished Party Shrug",desc:"Bright embellished party style designed to make a statement.",img:"images/product-07-yellow-party.png"},
{id:8,name:"Ruby Red Party Shrug",desc:"Rich red occasion style with elegant detailing for festive wear.",img:"images/product-08-ruby.png"},
{id:9,name:"Ivory Embroidered Saree Shrug",desc:"Ivory embroidered layer made to complement sarees and special occasions.",img:"images/product-09-ivory.png"},
{id:10,name:"Ruby Red Net Shrug",desc:"Statement red net shrug with a graceful long silhouette.",img:"images/product-10-red.png"}
].map(p=>({...p,price:({1:1000,2:1500,3:1500,4:1500,5:1500,6:1500,7:1500,8:1000,9:1500,10:400}[p.id] ?? 1500),colors:[...COLORS],sizes:[...SIZES]}));
products.push(newPartyShrug);
let cart=JSON.parse(localStorage.getItem('mbg_cart')||'[]');
let selectedPayment='UPI';
let couponApplied=false;
let wallet=Number(localStorage.getItem('mbg_wallet')||0);
const money=n=>'₹'+Number(n).toLocaleString('en-IN');
const saveCart=()=>localStorage.setItem('mbg_cart',JSON.stringify(cart));
function renderProducts(list=products){const grid=document.getElementById('productGrid');grid.innerHTML=list.map(p=>`<article class="product"><div class="product-img"><img src="${p.img}" alt="${p.name}"></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div><div class="choice-label">COLOUR: <span id="colorLabel-${p.id}">Pink</span></div><div class="swatches">${p.colors.map((c,i)=>`<button class="swatch ${i===0?'selected':''}" onclick="chooseColor(${p.id},'${c}',this)">${c}</button>`).join('')}</div><div class="choice-label">SIZE: <span id="sizeLabel-${p.id}">M</span></div><div class="sizes">${p.sizes.map(s=>`<button class="size ${s==='M'?'selected':''}" onclick="chooseSize(${p.id},'${s}',this)">${s}</button>`).join('')}</div><button class="add" onclick="addToCart(${p.id})">ADD TO CART</button></div></article>`).join('');}
const choices={};
function chooseColor(id,color,el){choices[id]??={color:'Pink',size:'M'};choices[id].color=color;document.querySelectorAll(`#colorLabel-${id}`).forEach(x=>x.textContent=color);el.parentElement.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');}
function chooseSize(id,size,el){choices[id]??={color:'Pink',size:'M'};choices[id].size=size;document.getElementById(`sizeLabel-${id}`).textContent=size;el.parentElement.querySelectorAll('.size').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');}
function addToCart(id){const p=products.find(x=>x.id===id), c=choices[id]||{color:'Pink',size:'M'};cart.push({id:p.id,name:p.name,price:p.price,img:p.img,color:c.color,size:c.size});saveCart();updateCartCount();showMessage(`${p.name} added to cart ❤️`);}
function updateCartCount(){document.getElementById('cartCount').textContent=cart.length}
function openCart(){document.getElementById('cartPanel').classList.add('open');document.getElementById('overlay').classList.add('show');renderCart()}
function closeCart(){document.getElementById('cartPanel').classList.remove('open');document.getElementById('overlay').classList.remove('show')}
function renderCart(){const box=document.getElementById('cartItems');if(!cart.length){box.innerHTML='<p>Your cart is empty.</p>';document.getElementById('cartTotal').textContent=money(0);return}box.innerHTML=cart.map((p,i)=>`<div class="cart-item"><img src="${p.img}" alt=""><span><b>${p.name}</b><br><small>Colour: ${p.color} · Size: ${p.size}<br>${money(p.price)}</small></span><button onclick="removeCart(${i})">Remove</button></div>`).join('');document.getElementById('cartTotal').textContent=money(cart.reduce((s,p)=>s+p.price,0));}
function removeCart(i){cart.splice(i,1);saveCart();updateCartCount();renderCart()}
function filterProducts(){const q=document.getElementById('search').value.toLowerCase();renderProducts(products.filter(p=>(p.name+' '+p.desc+' '+p.colors.join(' ')).toLowerCase().includes(q)))}
function sortProducts(){const v=document.getElementById('sort').value;let list=[...products];if(v==='low')list.sort((a,b)=>a.price-b.price);if(v==='high')list.sort((a,b)=>b.price-a.price);renderProducts(list)}
function focusSearch(){document.getElementById('search').focus();document.getElementById('search').scrollIntoView({behavior:'smooth',block:'center'})}
function copyCoupon(){navigator.clipboard?.writeText('FIRST100');showMessage('FIRST100 copied — ₹100 off your first purchase')}
function openModal(id){document.getElementById(id).classList.add('show')}
function closeModal(id){document.getElementById(id).classList.remove('show')}
function closeAllPanels(){closeCart();['checkoutModal','accountModal','walletModal','successModal'].forEach(closeModal)}
function openCheckout(){if(!cart.length){showMessage('Your cart is empty');return}closeCart();couponApplied=false;document.getElementById('coupon').value='';document.getElementById('couponMessage').textContent='';selectPayment('UPI');renderCheckout();prefillCheckout();openModal('checkoutModal')}
function selectPayment(method){selectedPayment=method;document.querySelectorAll('.payment-options button').forEach(b=>b.classList.toggle('selected',b.dataset.method===method));renderCheckout()}
function applyCoupon(){const input=document.getElementById('coupon').value.trim().toUpperCase();const used=localStorage.getItem('mbg_first_purchase_used')==='1';if(input==='FIRST100'&&!used){couponApplied=true;document.getElementById('couponMessage').textContent='Coupon applied: ₹100 off 🎉';}else if(input==='FIRST100'&&used){couponApplied=false;document.getElementById('couponMessage').textContent='FIRST100 is available for the first purchase only.';}else{couponApplied=false;document.getElementById('couponMessage').textContent='Please enter a valid coupon code.'}renderCheckout()}
function totals(){const subtotal=cart.reduce((s,p)=>s+p.price,0);const discount=couponApplied?100:0;const shipping=100 + (selectedPayment==='COD'?30:0);return{subtotal,discount,shipping,total:Math.max(0,subtotal-discount+shipping)}}
function renderCheckout(){const t=totals();document.getElementById('checkoutSummary').innerHTML=`<div class="order-line"><span>${cart.length} item(s)</span><b>${money(t.subtotal)}</b></div>${couponApplied?`<div class="order-line"><span>FIRST100</span><b>- ${money(t.discount)}</b></div>`:''}<div class="order-line"><span>${selectedPayment==='COD'?'COD + shipping':'Shipping'}</span><b>${t.shipping?money(t.shipping):'FREE'}</b></div>`;document.getElementById('finalTotal').textContent=money(t.total)}
function loginCustomer(){
  const name=document.getElementById('loginName').value.trim(),
        email=document.getElementById('loginEmail').value.trim(),
        phone=document.getElementById('loginPhone').value.trim(),
        address=document.getElementById('loginAddress').value.trim(),
        city=document.getElementById('loginCity').value.trim(),
        state=document.getElementById('loginState').value.trim(),
        pincode=document.getElementById('loginPincode').value.trim(),
        promo=document.getElementById('promoOptIn').checked;
  if(!name||!email||!phone||!address||!city||!state||!pincode){
    showMessage('Please complete your customer details'); return;
  }
  const customer={name,email,phone,address,city,state,pincode,promoOptIn:promo};
  localStorage.setItem('mbg_customer',JSON.stringify(customer));
  prefillCheckout();
  renderAccount();
  showMessage('Customer details saved ❤️');
}
function openAccount(){closeAllPanels();renderAccount();openModal('accountModal')}
function renderAccount(){
  const c=JSON.parse(localStorage.getItem('mbg_customer')||'null');
  document.getElementById('accountState').innerHTML=c
    ? `<div class="account-card"><b>Welcome, ${c.name}</b><p>${c.email}<br>${c.phone}<br>${c.address}, ${c.city}, ${c.state} - ${c.pincode}</p><small>Promotional updates: ${c.promoOptIn?'Enabled':'Off'}</small></div>`
    : '<p class="form-note">Save your customer details once and we can prefill them at checkout.</p>';
  document.getElementById('loginName').value=c?.name||'';
  document.getElementById('loginEmail').value=c?.email||'';
  document.getElementById('loginPhone').value=c?.phone||'';
  document.getElementById('loginAddress').value=c?.address||'';
  document.getElementById('loginCity').value=c?.city||'';
  document.getElementById('loginState').value=c?.state||'';
  document.getElementById('loginPincode').value=c?.pincode||'';
  document.getElementById('promoOptIn').checked=c?.promoOptIn!==false;
}
function logoutCustomer(){localStorage.removeItem('mbg_customer');renderAccount();showMessage('Customer details cleared')}
function prefillCheckout(){
  const c=JSON.parse(localStorage.getItem('mbg_customer')||'null');
  if(!c) return;
  const name=document.getElementById('customerName');
  const phone=document.getElementById('customerPhone');
  const address=document.getElementById('customerAddress');
  if(name) name.value=c.name||'';
  if(phone) phone.value=c.phone||'';
  if(address) address.value=`${c.address||''}, ${c.city||''}, ${c.state||''} - ${c.pincode||''}`.replace(/^, |,  - $/g,'');
}
function openWallet(){closeAllPanels();document.getElementById('walletBalance').textContent=money(wallet);openModal('walletModal')}
function orderDetails(){const name=document.getElementById('customerName').value.trim(),phone=document.getElementById('customerPhone').value.trim(),address=document.getElementById('customerAddress').value.trim();if(!name||!phone||!address){showMessage('Please complete your delivery details');return null}const t=totals();const c=JSON.parse(localStorage.getItem('mbg_customer')||'null');return {name,phone,address,email:c?.email||'',promoOptIn:!!c?.promoOptIn,t};}
function finishOrder(details, paymentId=''){const {name,phone,address,email,promoOptIn,t}=details;const lines=cart.map(p=>`${p.name} | ${p.color} | ${p.size} | ${money(p.price)}`).join('\n');const subject=encodeURIComponent(`Made by God Order - ${name}`);const body=`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nPromotion consent: ${promoOptIn?'Yes':'No'}\nPayment: ${selectedPayment}\nRazorpay Payment ID: ${paymentId||'N/A'}\nItems:\n${lines}\nSubtotal: ${t.subtotal}\nDiscount: ${t.discount}\nShipping/COD charges: ${t.shipping}\nTotal: ${t.total}`;localStorage.setItem('mbg_first_purchase_used','1');localStorage.setItem('mbg_last_order',JSON.stringify({name,phone,address,method:selectedPayment,total:t.total,paymentId,date:new Date().toISOString()}));cart=[];saveCart();updateCartCount();closeModal('checkoutModal');document.getElementById('successText').textContent=paymentId?`Payment successful. We will contact you at ${phone} to confirm your order.`:`Your COD order details are ready. We will contact you at ${phone} to confirm the order.`;openModal('successModal');window.location.href=`mailto:zuckerbergme90@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;}
async function payWithRazorpay(details){if(typeof Razorpay==='undefined'){showMessage('Razorpay checkout could not load. Please try again.');return}const r=await fetch('/api/razorpay/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:Math.round(details.t.total*100)})});const data=await r.json();if(!r.ok){showMessage(data.error||'Unable to start payment');return}const options={key:data.key_id,amount:data.amount,currency:data.currency,name:'Made by God',description:'Made by God order',order_id:data.order_id,prefill:{name:details.name,email:details.email,contact:details.phone},theme:{color:'#181312'},handler:async function(response){const vr=await fetch('/api/razorpay/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(response)});const vd=await vr.json();if(!vd.verified){showMessage('Payment verification failed. Please contact us.');return}finishOrder(details,response.razorpay_payment_id)}};new Razorpay(options).open()}
function placeOrder(){const details=orderDetails();if(!details)return;if(selectedPayment==='COD'){finishOrder(details);return}payWithRazorpay(details).catch(()=>showMessage('Unable to start payment. Please try again.'))}
function showMessage(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function renderBest(){document.getElementById('bestGrid').innerHTML=[products[0],products[4],products[7],products[8]].map(p=>`<article class="best-card"><img src="${p.img}" alt="${p.name}"><div><h3>${p.name}</h3><p>${money(p.price)}</p></div></article>`).join('')}
document.getElementById('year').textContent=new Date().getFullYear();renderProducts();renderBest();updateCartCount();

<!-- Made by God UPI payment destination: 8979481407@ptyes -->

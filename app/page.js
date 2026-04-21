'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const SHOP_ID = 1

export default function Store() {
  const [products, setProducts] = useState([])
  const [shop, setShop] = useState({})

  useEffect(() => {
    async function load() {
      const { data: shopData } = await supabase.from('shops').select().eq('id', SHOP_ID).single()
      setShop(shopData || {})
      const { data: productsData } = await supabase.from('products').select().eq('shop_id', SHOP_ID).gt('stock', 0)
      setProducts(productsData || [])
    }
    load()
  }, [])

  const orderNow = async (product) => {
    const name = prompt("Apna naam:")
    const phone = prompt("WhatsApp number: 91...")
    if (!name || !phone) return alert("Naam aur number zaroori hai")
    
    const total = product.price + (shop.delivery_fee || 0)
    const msg = `Hi ${shop.name}%0AOrder: 1x ${product.name} ${product.size} ₹${product.price}%0ADelivery: ₹${shop.delivery_fee}%0ATotal: ₹${total}%0AName: ${name}`
    
    await supabase.from('orders').insert({
      shop_id: SHOP_ID, customer_phone: phone, customer_name: name,
      items: [{name: product.name, size: product.size, price: product.price}],
      total: total, status: 'new'
    })
    
    window.open(`https://wa.me/${shop.whatsapp_no}?text=${msg}`, '_blank')
    alert("Order save ho gaya! WhatsApp pe confirm karo.")
  }

  return (
    <div style={{maxWidth:480, margin:'auto', padding:16}}>
      <h1 style={{textAlign:'center', marginBottom:4}}>{shop.name || 'Loading...'}</h1>
      <p style={{textAlign:'center', color:'#666', marginTop:0}}>WhatsApp pe order karein</p>
      {products.map(p => (
        <div key={p.id} style={{background:'white', borderRadius:16, padding:16, margin:'16px 0', boxShadow:'0 1px 4px #0001'}}>
          <img src={p.photo_url} alt={p.name} style={{width:'100%', height:240, objectFit:'cover', borderRadius:12}}/>
          <h3 style={{margin:'12px 0 4px'}}>{p.name} - {p.size}</h3>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'8px 0'}}>
            <p style={{fontSize:22, fontWeight:700, margin:0}}>₹{p.price}</p>
            <p style={{color:p.stock<3?'#d00':'#090', fontSize:13, margin:0}}>Stock: {p.stock}</p>
          </div>
          <button onClick={() => orderNow(p)} style={{width:'100%', padding:14, background:'#25D366', color:'white', border:'none', borderRadius:10, fontSize:16, fontWeight:700}}>
            WhatsApp Pe Order Karein
          </button>
        </div>
      ))}
      <p style={{textAlign:'center', fontSize:12, color:'#aaa', marginTop:40}}>Powered by DukanBot</p>
    </div>
  )
                                 }

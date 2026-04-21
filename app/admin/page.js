'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
const SHOP_ID = 1

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')

  async function loadOrders() {
    const { data } = await supabase.from('orders').select().eq('shop_id', SHOP_ID).order('created_at', { ascending: false })
    setOrders(data || [])
  }
  
  useEffect(() => { if(auth) loadOrders() }, [auth])
  
  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadOrders()
  }

  if (!auth) return (
    <div style={{maxWidth:360, margin:'100px auto', padding:20, background:'white', borderRadius:12}}>
      <h2>Shop Owner Login</h2>
      <input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} 
        style={{width:'100%', padding:12, margin:'12px 0', border:'1px solid #ddd', borderRadius:8}}/>
      <button onClick={()=>setAuth(pass==='admin123')} style={{width:'100%', padding:12, background:'black', color:'white', border:'none', borderRadius:8}}>Login</button>
      <p style={{fontSize:12, color:'#888'}}>Demo password: admin123</p>
    </div>
  )

  return (
    <div style={{maxWidth:800, margin:'auto', padding:16}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Orders</h1>
        <button onClick={loadOrders} style={{padding:'8px 16px'}}>Refresh</button>
      </div>
      {orders.length===0 && <p>Abhi koi order nahi hai.</p>}
      {orders.map(o => (
        <div key={o.id} style={{background:o.status==='new'?'#fff9e6':'white', padding:16, margin:'12px 0', borderRadius:12, border:'1px solid #eee'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <b>{o.customer_name}</b>
            <span style={{fontSize:13, color:'#666'}}>{new Date(o.created_at).toLocaleString('en-IN')}</span>
          </div>
          <p style={{margin:'8px 0'}}>Phone: <a href={`tel:${o.customer_phone}`}>{o.customer_phone}</a></p>
          <p style={{margin:'8px 0'}}>Items: {o.items.map(i=>`${i.name} ${i.size}`).join(', ')}</p>
          <p style={{margin:'8px 0'}}><b>Total: ₹{o.total}</b> | Status: {o.status}</p>
          <div>
            <button onClick={()=>updateStatus(o.id,'paid')} style={{marginRight:8, padding:'6px 12px'}}>Paid</button>
            <button onClick={()=>updateStatus(o.id,'shipped')} style={{padding:'6px 12px'}}>Shipped</button>
          </div>
        </div>
      ))}
    </div>
  )
  }

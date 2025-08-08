import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export async function createOrder(req: Request, res: Response) {
  const { amount, email, method, full_name, ph_no, year, roll_no, referal, branch } = req.body;

  if (!amount || !email || !method || !full_name || !ph_no || !year || !roll_no || !branch) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        email,
        amount: Math.round(amount),
        method,
        full_name,
        ph_no,
        year,
        roll_no,
        referal,
        branch,
        status: false
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase Error (createOrder):', error.message);
    return res.status(500).json({ error: 'Failed to create order' });
  }

  return res.status(200).json({ order: data });
}

// ----------------------------------------
// Record Payment
// ----------------------------------------
export async function recordPayment(req: Request, res: Response) {
  const { order_id, transaction_id, amount, method } = req.body;

  if (!order_id || !transaction_id || !amount || !method) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }

  // ✅ Fetch order to get extra info
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('email, full_name, branch') // select the extra fields
    .eq('id', order_id)
    .single();

  if (orderError || !order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // ✅ Insert payment with copied fields
  const { data, error: paymentError } = await supabase
    .from('payments')
    .insert([
      {
        order_id,
        transaction_id,
        amount,
        method,
        status: false, // unverified
        email: order.email,
        full_name: order.full_name,
        branch: order.branch
      }
    ])
    .select();

  if (paymentError) {
    console.error('Supabase Error (recordPayment):', paymentError.message);
    return res.status(500).json({ error: 'Failed to record payment' });
  }

  return res.status(200).json({ message: 'Payment recorded. Awaiting verification.', payment: data });
}




// ----------------------------------------
// Verify Payment
// ----------------------------------------
export async function verifyPayment(req: Request, res: Response) {
  const { transaction_id } = req.body;

  if (!transaction_id) {
    return res.status(400).json({ error: 'Missing transaction_id' });
  }

  const { data, error } = await supabase
    .from('payments')
    .update({ status: true }) // ✅ Mark as confirmed
    .eq('transaction_id', transaction_id)
    .select();

  if (error) {
    console.error('Supabase Error (verifyPayment):', error.message);
    return res.status(500).json({ error: 'Failed to verify payment' });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'No matching payment found' });
  }

  return res.status(200).json({ message: 'Payment verified successfully.' });
}

import { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";

/**
 * Create a new order in Supabase
 */
export async function createOrder(req: Request, res: Response) {
  try {
    const {
      amount,
      email,
      method,
      full_name,
      ph_no,
      year,
      roll_no,
      referal,
      branch,
    } = req.body;

    // Validate required fields
    if (
      !amount ||
      !email ||
      !method ||
      !full_name ||
      !ph_no ||
      !year ||
      !roll_no ||
      !branch
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("orders")
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
          status: false,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return res.status(201).json({ order: data });
  } catch (err: any) {
    console.error("Error in createOrder:", err.message);
    return res.status(500).json({ error: "Failed to create order" });
  }
}

/**
 * Record payment attempt
 */
export async function recordPayment(req: Request, res: Response) {
  try {
    const { order_id, transaction_id, amount, method } = req.body;

    if (!order_id || !transaction_id || !amount || !method) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("email, full_name, branch")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Insert payment
    const { data, error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          order_id,
          transaction_id,
          amount,
          method,
          status: false,
          email: order.email,
          full_name: order.full_name,
          branch: order.branch,
        },
      ])
      .select();

    if (paymentError) throw new Error(paymentError.message);

    return res.status(201).json({
      message: "Payment recorded. Awaiting verification.",
      payment: data,
    });
  } catch (err: any) {
    console.error("Error in recordPayment:", err.message);
    return res.status(500).json({ error: "Failed to record payment" });
  }
}

/**
 * Verify a payment
 */
export async function verifyPayment(req: Request, res: Response) {
  try {
    const { transaction_id } = req.body;

    if (!transaction_id) {
      return res.status(400).json({ error: "Missing transaction_id" });
    }

    const { data, error } = await supabase
      .from("payments")
      .update({ status: true })
      .eq("transaction_id", transaction_id)
      .select();

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No matching payment found" });
    }

    return res.status(200).json({ message: "Payment verified successfully." });
  } catch (err: any) {
    console.error("Error in verifyPayment:", err.message);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
}

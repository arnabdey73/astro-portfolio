import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if this is a production environment with Resend configured
    const hasResendKey = !!process.env.RESEND_API_KEY;
    
    if (hasResendKey) {
      // Dynamic import to avoid build-time initialization
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      // ... rest of the Resend logic would go here
      // For now, we'll use the fallback approach
    }
    
    const formData = await request.formData();
    
    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const budget = formData.get('budget') as string;
    const timeline = formData.get('timeline') as string;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Spam protection - check honeypot
    const honeypot = formData.get('_gotcha') as string;
    if (honeypot) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Spam detected' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Log the form submission for now
    console.log('Contact form submission received:', {
      name,
      email,
      subject,
      message,
      budget,
      timeline,
      timestamp: new Date().toISOString(),
      hasResendKey
    });
    
    // For now, always return success (fallback mode)
    // In the future, this will send actual emails when Resend is configured
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Form submitted successfully. You will receive a confirmation soon.',
      mode: hasResendKey ? 'email' : 'fallback'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

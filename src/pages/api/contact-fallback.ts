import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
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
    
    // For demo purposes, log the form submission
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      budget,
      timeline,
      timestamp: new Date().toISOString()
    });
    
    // Create mailto URL for fallback
    const mailtoSubject = `Portfolio Contact: ${subject}`;
    const mailtoBody = `
Name: ${name}
Email: ${email}
Subject: ${subject}
${budget ? `Budget: ${budget}` : ''}
${timeline ? `Timeline: ${timeline}` : ''}

Message:
${message}

---
Sent from portfolio contact form at ${new Date().toLocaleString()}
    `;
    
    const mailtoUrl = `mailto:your-email@example.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;
    
    // Return success with fallback info
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Form submitted successfully',
      fallback: true,
      mailtoUrl: mailtoUrl
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

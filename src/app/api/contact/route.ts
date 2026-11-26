import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, course, message, source, extraFields } = data;

    // 1. Always attempt to store the inquiry in Supabase table "contact_inquiries"
    try {
      await supabase.from('contact_inquiries').insert([
        {
          name: name || 'Anonymous',
          email: email || 'N/A',
          phone: phone || null,
          course_or_service: course || null,
          message: message || '',
          source: source || 'Website Contact Form',
          extra_fields: extraFields || {},
          status: 'new',
        },
      ]);
    } catch (dbErr) {
      console.warn('Could not insert inquiry into database:', dbErr);
    }

    let subject = `New Inquiry from ${name || 'Website Visitor'}`;
    if (source) {
      subject = `[${source}] New Inquiry from ${name || 'Website Visitor'}`;
    }

    let htmlBody = `
      <h2>New Submission from ${source || 'Website'}</h2>
      <p><strong>Name:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    `;

    if (course) {
      htmlBody += `<p><strong>Program / Role:</strong> ${course}</p>`;
    }

    if (message) {
      htmlBody += `<p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`;
    }

    if (extraFields && typeof extraFields === 'object') {
      htmlBody += '<h3 style="margin-top: 20px;">Detailed Information</h3>';
      htmlBody += '<table style="width:100%; max-width: 600px; border-collapse: collapse; text-align: left;">';
      for (const [key, value] of Object.entries(extraFields)) {
        htmlBody += `
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: 600; width: 40%; background-color: #f9fafb;">${key}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${value || 'N/A'}</td>
          </tr>
        `;
      }
      htmlBody += '</table>';
    }

    htmlBody += `<br/><hr/><p><small>Automated message sent from Zeony Technologies Website</small></p>`;

    // 2. Send the email using Resend if credentials are present
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.SMTP_EMAIL;
    if (resendApiKey && recipientEmail) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Zeony Technologies <notifications@zeonytechnologies.com>',
          to: recipientEmail,
          replyTo: email,
          subject: subject,
          html: htmlBody,
        });
      } catch (emailErr) {
        console.warn('Resend email error (inquiry saved to database regardless):', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully! Our team will contact you shortly.',
    });
  } catch (error: unknown) {
    console.error('Error in contact route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

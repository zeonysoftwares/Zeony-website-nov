import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, course, message, source, extraFields } = data;

    let subject = `New Inquiry from ${name}`;
    if (source) {
      subject = `[${source}] New Inquiry from ${name}`;
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

    // Send the email using Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.SMTP_EMAIL;
    if (!resendApiKey || !recipientEmail) {
      return NextResponse.json(
        { success: false, message: 'Email service is not configured on the server.' },
        { status: 500 }
      );
    }
    const resend = new Resend(resendApiKey);

    // Important: Resend requires the "from" domain to be verified in their dashboard, or use onboarding@resend.dev
    const { data: resendData, error } = await resend.emails.send({
      from: 'Zeony Technologies <notifications@zeonytechnologies.com>',
      to: recipientEmail, // Receive inquiries here
      replyTo: email,
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return NextResponse.json({ success: false, message: 'Failed to send email.', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully!', data: resendData });
  } catch (error: unknown) {
    console.error('Error in contact route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

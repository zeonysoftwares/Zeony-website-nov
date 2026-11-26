import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { applicationId, status, message } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch the application details from Supabase to get the applicant's email and info
    const { data: application, error: fetchError } = await supabase
      .from('academy_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      console.error('Error fetching application:', fetchError);
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    // 2. Update the status in Supabase
    const { error: updateError } = await supabase
      .from('academy_applications')
      .update({ status: status })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error updating application status:', updateError);
      return NextResponse.json({ success: false, message: 'Failed to update status in database' }, { status: 500 });
    }

    // 3. Send email to the applicant if status is accepted or rejected
    if (status === 'accepted' || status === 'rejected') {
      let subject = '';
      let htmlBody = '';
      
      const programName = application.domain_or_track;
      const applicantName = application.full_name;

      if (status === 'accepted') {
        subject = `Congratulations! Your application for ${programName} has been accepted.`;
        htmlBody = `
          <h2>Application Accepted!</h2>
          <p>Dear ${applicantName},</p>
          <p>We are thrilled to inform you that your application for the <strong>${programName}</strong> at Zeony Technologies has been <strong>accepted</strong>!</p>
          ${message ? `<p><strong>Message from our team:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
          <p>Our admissions team will contact you shortly with the next steps regarding your onboarding and schedule.</p>
          <br/>
          <p>Welcome aboard!</p>
          <p>Best regards,<br/>Zeony Technologies Team</p>
        `;
      } else if (status === 'rejected') {
        subject = `Update on your application for ${programName}`;
        htmlBody = `
          <h2>Application Status Update</h2>
          <p>Dear ${applicantName},</p>
          <p>Thank you for applying to the <strong>${programName}</strong> at Zeony Technologies.</p>
          <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time.</p>
          ${message ? `<p><strong>Feedback from our team:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>` : ''}
          <p>We appreciate your interest and encourage you to apply for future cohorts or other programs that might be a better fit.</p>
          <br/>
          <p>Best regards,<br/>Zeony Technologies Team</p>
        `;
      }

      // Send the email using Resend
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        return NextResponse.json({ success: false, message: 'Status updated, but email service is not configured on the server.' }, { status: 500 });
      }
      const resend = new Resend(resendApiKey);

      const { error: emailError } = await resend.emails.send({
        from: 'Zeony Admissions <notifications@zeonytechnologies.com>',
        to: application.email,
        subject: subject,
        html: htmlBody,
      });

      if (emailError) {
        console.error('Error sending application status email via Resend:', emailError);
        return NextResponse.json({ success: false, message: 'Status updated, but failed to send email.', error: emailError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Status updated and email sent successfully!' });
  } catch (error: unknown) {
    console.error('Error in update-status route:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

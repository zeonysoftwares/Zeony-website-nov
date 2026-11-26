import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Application Accepted!</h2>
              <p style="color: #d1fae5; margin: 4px 0 0 0; font-size: 13px;">Zeony Technologies Academy</p>
            </div>
            <p style="font-size: 15px; color: #1e293b;">Dear <strong>${applicantName}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">We are thrilled to inform you that your application for <strong>${programName}</strong> at Zeony Technologies has been <strong>ACCEPTED</strong>!</p>
            ${message ? `<div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px; border-radius: 6px; margin: 18px 0; color: #1e293b; font-size: 14px;">${message.replace(/\n/g, '<br/>')}</div>` : ''}
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Our admissions team will contact you shortly with the next steps regarding your onboarding schedule.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">Zeony Technologies &bull; First Floor, Shanthi Complex, No. 4, opp. Bus stand, Hosur, Tamil Nadu 635109</p>
          </div>
        `;
      } else if (status === 'rejected') {
        subject = `Update on your application for ${programName}`;
        htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e293b, #334155); padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ffffff; margin: 0; font-size: 20px;">Application Status Update</h2>
              <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Zeony Technologies Academy</p>
            </div>
            <p style="font-size: 15px; color: #1e293b;">Dear <strong>${applicantName}</strong>,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Thank you for your interest and for applying to <strong>${programName}</strong> at Zeony Technologies.</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">After careful review of the applicant pool, we regret to inform you that we are unable to proceed with your application for this cohort.</p>
            ${message ? `<div style="background: #f8fafc; border-left: 4px solid #64748b; padding: 14px; border-radius: 6px; margin: 18px 0; color: #1e293b; font-size: 14px;">${message.replace(/\n/g, '<br/>')}</div>` : ''}
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">We appreciate your effort and welcome you to apply for future cohorts or other programs.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />
            <p style="font-size: 12px; color: #64748b; margin: 0;">Zeony Technologies</p>
          </div>
        `;
      }

      // PRIMARY: Send via verified Gmail SMTP
      const smtpUser = process.env.SMTP_EMAIL;
      const smtpPass = process.env.SMTP_PASSWORD;
      let emailSent = false;

      if (smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser.trim(),
              pass: smtpPass.trim(),
            },
          });

          await transporter.sendMail({
            from: `"Zeony Admissions" <${smtpUser.trim()}>`,
            to: application.email,
            subject: subject,
            html: htmlBody,
          });
          emailSent = true;
        } catch (smtpErr) {
          console.warn('Gmail SMTP error on status update:', smtpErr);
        }
      }

      // FALLBACK: Resend API
      if (!emailSent) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          try {
            const resend = new Resend(resendApiKey);
            await resend.emails.send({
              from: 'Zeony Admissions <notifications@zeonytechnologies.com>',
              to: application.email,
              subject: subject,
              html: htmlBody,
            });
            emailSent = true;
          } catch (resendErr) {
            console.warn('Resend error on status update:', resendErr);
          }
        }
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

import * as nodemailer from "nodemailer";

/**
 * Sends an email with the test execution report.
 */
export async function sendEmail(subject: string, htmlBody: string, attachments: any[] = []) {
    const SENDER_EMAIL = "automationreport477@gmail.com";
    const SENDER_PASSWORD = "jepgjwtiwkdblajf";
    const RECEIVER_EMAIL = "shahyogesh0902@gmail.com";

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD,
        },
    });

    const mailOptions = {
        from: SENDER_EMAIL,
        to: RECEIVER_EMAIL,
        subject: subject,
        html: htmlBody, // Send HTML body (report table)
        attachments: attachments, // Attach report files if available
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error(`Failed to send email: ${error}`);
    }
}

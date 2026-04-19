const getAutoReplyTemplate = ({ name, email, message }) => {
  const WEBSITE_URL = (process.env.WEBSITE_URL || "https://prithbidesigns.com/").replace(
    /\/?$/,
    "/"
  );
  const LOGO_URL = process.env.EMAIL_LOGO_URL || `${WEBSITE_URL}img/logo.png`;
  const INSTAGRAM_URL = "https://www.instagram.com/prithbi0018/";
  const LINKEDIN_URL = "https://www.linkedin.com/in/prithbidesigns/";
  const SUPPORT_EMAIL = "connect@prithbidesigns.com";
  const SUBSCRIBE_URL = `${WEBSITE_URL}subscribe?email=${encodeURIComponent(
    email || ""
  )}`;
  const UNSUBSCRIBE_URL = `${WEBSITE_URL}unsubscribe?email=${encodeURIComponent(
    email || ""
  )}`;
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
        <!-- Header with Logo on Left and Subscribe/Unsubscribe Icons on Right (Table-based for compatibility) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8F8F8; border-bottom: 1px solid #eeeeee;">
            <tr>
                <td style="padding: 15px 0px 15px 25px; text-align: left; vertical-align: middle;">
                    <!-- Logo on the left -->
                    <a href="${WEBSITE_URL}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">
                        <img src="${LOGO_URL}" alt="prithbidesigns Logo" style="max-width: 50px; height: auto; display: block; vertical-align: middle;">
                    </a>
                </td>
                <td style="padding: 15px 25px 15px 0px; text-align: right; vertical-align: middle;">
                    <a href="${SUBSCRIBE_URL}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-left: 15px; color: #333333; font-size: 13px; text-decoration: none; font-weight: 600;">
                        Subscribe
                    </a>
                    <a href="${UNSUBSCRIBE_URL}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-left: 15px; color: #333333; font-size: 13px; text-decoration: none; font-weight: 600;">
                        Unsubscribe
                    </a>
                </td>
            </tr>
        </table>
        <!-- Main Content -->
        <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333333;">Hi ${name},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333333;">Thanks for reaching out! I’ve received your message and will respond within <strong>1–2 business days</strong>.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-top: 25px;"><strong>Here’s what you shared:</strong></p>
            <ul style="list-style-type: none; padding: 0; margin: 15px 0;">
                <li style="margin-bottom: 10px; font-size: 16px; color: #555555;">
                    <strong>Your Message:</strong> "<em style="color: #666666;">${message}</em>"
                </li>
            </ul>
            <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-top: 30px;">Talk soon,<br/>
            <strong style="color: #333333;">— Prithbiraj Panda</strong><br/>
            <a href="mailto:${SUPPORT_EMAIL}" style="color: #333333; text-decoration: none; font-size: 14px;">${SUPPORT_EMAIL}</a>
            </p>
        </div>
        <!-- Footer -->
        <div style="background-color: #F8F8F8; padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #777777;">
            <!-- Subscribe Button/Link -->
            <div style="margin-bottom: 20px;">
                <a href="${SUBSCRIBE_URL}" style="display: inline-block; padding: 10px 20px; background-color: #333333; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold;">
                    Subscribe to my Newsletter
                </a>
            </div>
            <!-- Social Media Links -->
            <div style="margin-top: 15px; margin-bottom: 15px;">
                <a href="${INSTAGRAM_URL}" style="color: #333333; text-decoration: none; margin: 0 8px;">Instagram</a> |
                <a href="${LINKEDIN_URL}" style="color: #333333; text-decoration: none; margin: 0 8px;">LinkedIn</a>
                <!-- Add more social media links as needed -->
            </div>
            <!-- Website Link -->
            <div style="margin-bottom: 20px;">
                <a href="${WEBSITE_URL}" style="color: #333333; text-decoration: none; font-size: 14px;">Visit My Website</a>
            </div>
            <hr style="border: 0; height: 1px; background-color: #dddddd; margin: 20px auto;">
            <small style="display: block;">You’re receiving this confirmation because you contacted me via my website.</small>
        </div>
    </div>
  `;
};
const getAdminNotificationTemplate = ({
  name,
  email,
  phone,
  companyName,
  website,
  interest,
  budget,
  timeline,
  message,
}) => {
  return `
    <h3>New Contact Inquiry</h3>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone || "N/A"}</li>
      <li><strong>Company:</strong> ${companyName || "N/A"}</li>
      <li><strong>Website:</strong> ${website || "N/A"}</li>
      <li><strong>Interest:</strong> ${interest || "N/A"}</li>
      <li><strong>Budget:</strong> ${budget || "N/A"}</li>
      <li><strong>Timeline:</strong> ${timeline || "N/A"}</li>
    </ul>
    <h4>Message:</h4>
    <p>${message}</p>
  `;
};
module.exports = {
  getAutoReplyTemplate,
  getAdminNotificationTemplate,
};

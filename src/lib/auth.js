import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);

const db = client.db("navber-login");

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  // =========================
  // Database
  // =========================
  database: mongodbAdapter(db, {
    client,
  }),

  // =========================
  // Email & Password
  // =========================
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // =========================
  // Email Verification
  // =========================
  emailVerification: {
    sendOnSignUp: true,

    autoSignInAfterVerification: true,

    // 24 hours
    expiresIn: 60 * 60 * 24,

    sendVerificationEmail: async ({ user, url }) => {
      console.log("=================================");
      console.log("VERIFICATION EMAIL");
      console.log("User:", user.email);
      console.log("Verification URL:", url);
      console.log("=================================");

      try {
        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Verify your email address",

          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Verify your email</title>
              </head>

              <body
                style="
                  margin: 0;
                  padding: 40px;
                  background-color: #f4f4f5;
                  font-family: Arial, sans-serif;
                "
              >
                <div
                  style="
                    max-width: 500px;
                    margin: auto;
                    padding: 30px;
                    background: white;
                    border-radius: 12px;
                  "
                >
                  <h1 style="margin-top: 0;">
                    Verify your email
                  </h1>

                  <p>
                    Thanks for signing up!
                  </p>

                  <p>
                    Please click the button below to verify
                    your email address.
                  </p>

                  <a
                    href="${url}"
                    style="
                      display: inline-block;
                      padding: 12px 20px;
                      background: #111827;
                      color: white;
                      text-decoration: none;
                      border-radius: 8px;
                    "
                  >
                    Verify Email
                  </a>

                  <p style="margin-top: 25px; color: #666;">
                    This verification link will expire in 24 hours.
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        console.log("RESEND DATA:", data);
        console.log("RESEND ERROR:", error);

        if (error) {
          console.error("Failed to send verification email:", error);
        }
      } catch (error) {
        console.error("Unexpected Resend error:", error);
      }
    },
  },

  // =========================
  // Google Login
  // =========================
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
});

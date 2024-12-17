import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "store@resend.dev",
    to: email,
    subject: "二次验证代码",
    html: `<p>你的二次验证代码: ${token}</p>`
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: "store@resend.dev",
    to: email,
    subject: "重置密码",
    html: `<p>点击 <a href="${resetLink}">这里</a> 重置密码.</p>`
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "store@resend.dev",
    to: email,
    subject: "确认邮件",
    html: `<p>点击 <a href="${confirmLink}">这个</a> 确认邮件.</p>`
  });
};

import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs  } from 'fs';
import { templateType } from 'src/proto/utility';

interface To {
  email: string;
  name: string;
}

interface ToUser {
  email: string;
  name?: string;
  type?: 'to' | 'cc' | 'bcc';
}

interface SendMailParameters {
  smtp_user_name: string;
  message: {
    html?: string;
    text?: string;
    subject: string;
    from_email: string;
    from_name?: string;
    to: ToUser[];
  };
}

// type templateType = 'welcome' | 'otp' | 'reset' | 'verify';
const templates = ['welcome', 'otp', 'reset', 'verify'];

interface MailContent {
    template: templateType;
    data?: string[];
}

@Injectable()
export class MailService {

    private async retrieveTemplate(templateType: templateType) {
        if (templateType >= templates.length || templateType < 0)
            throw new BadRequestException('Invalid template type');

        return fs.readFile(`./templates/${templates[templateType]}.html`, 'utf-8');
    }

    private async createTemplate(templateType: templateType, data?: string[]) {
        let template = await this.retrieveTemplate(templateType);

        data?.forEach((text, index) => {
            template = template.replaceAll(`{{%${index+1}}}`, text);
        });
        return template;
    }

  private getRequestOptions = (to: To, subject: string, messageHtml: string) => {
    const emailData: SendMailParameters = {
      smtp_user_name: process.env.SENDCLEAN_SMTP_USERNAME || '',
      message: {
        html: messageHtml,
        subject: subject,
        from_email: process.env.SENDCLEAN_FROM_EMAIL || '',
        from_name: process.env.MAIL_SENDER_NAME || '',
        to: [
          {
            email: to.email,
            name: to.name,
            type: 'to',
          },
        ],
      },
    };

    return {
      method: 'POST',
      body: JSON.stringify({
        owner_id: process.env.SENDCLEAN_OWNER || '',
        token: process.env.SENDCLEAN_TOKEN || '',
        ...emailData,
      }),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  };

  async sendMail(to: To, subject: string, {template: type, data}: MailContent) {
    const template = await this.createTemplate(type, data);
    const res = await fetch(
      process.env.SENDCLEAN_APP_DOMAIN || '',
      this.getRequestOptions(to, subject, template) as any,
    );
    return {
      statusCode: res.status,
    };
  }
}

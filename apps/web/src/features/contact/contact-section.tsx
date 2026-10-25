'use client';

import {
  ArrowUpRight,
  Check,
  Copy,
  GitBranch,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { contact } from '@/data/portfolio';

interface Channel {
  id: string;
  labelFa: string;
  value: string;
  href: string;
  icon: typeof Mail;
  copyable?: boolean;
}

function buildChannels(): Channel[] {
  const channels: Channel[] = [];
  if (contact.email) {
    channels.push({
      id: 'email',
      labelFa: 'ایمیل',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
      copyable: true,
    });
  }
  if (contact.github) {
    channels.push({
      id: 'github',
      labelFa: 'گیت‌هاب',
      value: contact.github.replace('https://', ''),
      href: contact.github,
      icon: GitBranch,
    });
  }
  if (contact.linkedin) {
    channels.push({
      id: 'linkedin',
      labelFa: 'لینکدین',
      value: contact.linkedin.replace('https://', ''),
      href: contact.linkedin,
      icon: ArrowUpRight,
    });
  }
  if (contact.telegram) {
    channels.push({
      id: 'telegram',
      labelFa: 'تلگرام',
      value: contact.telegram.replace('https://t.me/', '@'),
      href: contact.telegram,
      icon: Send,
    });
  }
  if (contact.phone) {
    channels.push({
      id: 'phone',
      labelFa: 'تماس',
      value: contact.phone,
      href: `tel:${contact.phone}`,
      icon: Phone,
      copyable: true,
    });
  }
  return channels;
}

export function ContactSection() {
  const channels = buildChannels();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(id);
      toast.success('کپی شد');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('کپی خودکار ممکن نشد؛ مقدار را دستی کپی کن.');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullMessage = `نام: ${name || '—'}\nموضوع: ${subject || 'گفت‌وگو دربارهٔ همکاری'}\n\n${message}`;

    if (contact.email) {
      // ارسال واقعی از طریق کلاینت ایمیل کاربر با متن از پیش آماده
      const url = `mailto:${contact.email}?subject=${encodeURIComponent(subject || 'پیام از ORBIT')}&body=${encodeURIComponent(fullMessage)}`;
      window.location.href = url;
      toast.success('در حال باز کردن اپلیکیشن ایمیل…');
      return;
    }

    // تا وقتی ایمیل تنظیم نشده، پیام آمادهٔ ارسال در کلیپ‌بورد قرار می‌گیرد
    try {
      await navigator.clipboard.writeText(fullMessage);
      toast.success('پیامت آماده و کپی شد؛ می‌توانی در گیت‌هاب یا هر کانال دیگری برایم بفرستی.');
    } catch {
      toast.error('کپی پیام ممکن نشد.');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-white/12 bg-[#07080B] px-4 py-3 text-sm text-[#F1F0EB] placeholder:text-[#4a505c] transition focus:border-[#C7FF4A]/70 focus:outline-none focus:ring-2 focus:ring-[#C7FF4A]/25';

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      {/* کانال‌های ارتباطی */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <MessageCircle className="size-5 text-[#C7FF4A]" />
          کانال‌های مستقیم
        </h2>
        <p className="mt-3 text-sm leading-8 text-[#a7adb8]">
          برای همکاری روی یک محصول وب، توسعهٔ فرانت‌اند یا بک‌اند، یا فقط یک گفت‌وگوی فنی — یکی از
          این مسیرها را انتخاب کن.
        </p>

        <ul className="mt-6 space-y-3">
          {channels.map((ch) => (
            <li
              key={ch.id}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111319] p-4 transition hover:border-[#C7FF4A]/45"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-[#C7FF4A]">
                <ch.icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-[#777D88]">{ch.labelFa}</span>
                <a
                  href={ch.href}
                  target={ch.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="block truncate font-mono text-sm font-semibold hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                  dir="ltr"
                  style={{ textAlign: 'right' }}
                >
                  {ch.value}
                </a>
              </span>
              {ch.copyable && (
                <button
                  type="button"
                  onClick={() => void copy(ch.id, ch.value)}
                  aria-label={`کپی ${ch.labelFa}`}
                  className="shrink-0 rounded-lg border border-white/12 p-2 text-[#a7adb8] transition hover:text-[#C7FF4A] focus-visible:outline-2 focus-visible:outline-[#C7FF4A]"
                >
                  {copiedId === ch.id ? (
                    <Check className="size-4 text-[#C7FF4A]" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>

        {!contact.email && (
          <p className="mt-5 rounded-xl border border-dashed border-white/15 p-4 text-xs leading-6 text-[#777D88]">
            کانال‌های ارتباطی بیشتری به‌زودی اینجا فعال می‌شود. فعلاً سریع‌ترین مسیر، پیام در
            گیت‌هاب یا فرم روبه‌روست.
          </p>
        )}
      </div>

      {/* فرم پیام */}
      <form
        onSubmit={(e) => void onSubmit(e)}
        className="rounded-2xl border border-white/10 bg-[#111319] p-6 sm:p-8"
        aria-label="فرم ارسال پیام"
      >
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Send className="size-5 text-[#C7FF4A]" />
          ارسال پیام
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#777D88]">
          پیامت را بنویس؛ با دکمهٔ ارسال، در ایمیل تو آمادهٔ فرستادن می‌شود. هیچ داده‌ای روی سروری
          ذخیره نمی‌شود.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold">
              نام تو
            </label>
            <input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: سارا محمدی"
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-2 block text-xs font-semibold">
              موضوع
            </label>
            <input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="همکاری روی یک محصول وب"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold">
            پیام <span className="text-[#C7FF4A]">*</span>
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            placeholder="دربارهٔ ایده، پروژه یا فرصتی که در ذهن داری بنویس…"
            className={`${inputClass} resize-y leading-7`}
          />
        </div>

        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#C7FF4A] px-6 py-3.5 text-sm font-bold text-[#07080B] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C7FF4A] disabled:opacity-50"
          disabled={!message.trim()}
        >
          <Send className="size-4" />
          {contact.email ? 'ارسال با ایمیل' : 'آماده‌سازی پیام برای ارسال'}
        </button>
      </form>
    </div>
  );
}

/**
 * The legal pages, in both locales. Kept as structured content rather than
 * catalogue keys because each is a document, not a set of labels; both
 * locales must carry the same section ids, which the tests check.
 *
 * These describe what this static site actually does. They are a starting
 * point for the team's own review, not legal advice.
 */
import type { Locale } from '../i18n';

export interface LegalSection {
  id: string;
  heading: string;
  body: string[];
  list?: string[];
}
export interface LegalDoc {
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_UPDATED = '2026-09-24';

const GH = 'https://github.com/TrekLink-Team';

export const privacy: Record<Locale, LegalDoc> = {
  en: {
    updated: LEGAL_UPDATED,
    intro:
      'This policy covers the TrekLink landing site only. It has no forms, no accounts and no sign-in, so it never asks for your name, email or location.',
    sections: [
      {
        id: 'who',
        heading: 'Who runs this site',
        body: [
          'TrekLink is FPT University capstone project FA26SE159. The site is a set of static pages hosted on GitHub Pages.',
          `To reach the team, open an issue in the TrekLink GitHub organisation at ${GH}.`,
        ],
      },
      {
        id: 'analytics',
        heading: 'Analytics',
        body: [
          'We use Cloudflare Web Analytics to count visits. It sets no cookies and does not use your IP address to follow you across sites.',
          'It records aggregate data about each page view, such as the page, the referring site, the browser and operating system, and the country. We see totals, not individuals.',
        ],
        list: ['Cloudflare privacy policy: https://www.cloudflare.com/privacypolicy/'],
      },
      {
        id: 'hosting',
        heading: 'Hosting logs',
        body: [
          'GitHub serves these pages and may log technical data such as IP addresses to keep the service secure. That processing is covered by the GitHub Privacy Statement.',
        ],
        list: ['GitHub Privacy Statement: https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement'],
      },
      {
        id: 'browser',
        heading: 'What stays in your browser',
        body: [
          'Two preferences are saved in your browser’s local storage so the site remembers them. They never leave your device.',
          'You can delete them at any time by clearing this site’s data in your browser settings.',
        ],
        list: ['treklink.locale: the language you chose', 'treklink.theme: light or dark theme'],
      },
      {
        id: 'links',
        heading: 'Link tracking',
        body: [
          'Links that leave this site carry UTM parameters naming this site and the link you pressed, for example utm_source=treklink-landing. They describe the link, not you.',
          'If you arrived with UTM parameters of your own, the link into the operations system passes them on so attribution survives the hop.',
        ],
      },
      {
        id: 'ops',
        heading: 'The operations system',
        body: [
          'The operations system is a separate service with its own terms. When you press its link, your browser first asks that system whether it is available. That request goes from your browser to the operations system, which may log it.',
        ],
      },
      {
        id: 'rights',
        heading: 'Your choices',
        body: [
          'This site holds no personal data about you, so there is nothing for us to export or delete. You can block analytics with any content blocker and the site keeps working.',
          'For data held by Cloudflare or GitHub, contact them directly. For anything else, open an issue and we will help.',
        ],
      },
      {
        id: 'changes',
        heading: 'Changes',
        body: ['If this policy changes, the date at the top of the page changes with it.'],
      },
    ],
  },
  vi: {
    updated: LEGAL_UPDATED,
    intro:
      'Chính sách này chỉ áp dụng cho trang giới thiệu TrekLink. Trang không có biểu mẫu, tài khoản hay đăng nhập, nên không bao giờ hỏi tên, email hay vị trí của bạn.',
    sections: [
      {
        id: 'who',
        heading: 'Ai vận hành trang này',
        body: [
          'TrekLink là đồ án tốt nghiệp FA26SE159 của Đại học FPT. Trang gồm các trang tĩnh được lưu trữ trên GitHub Pages.',
          `Để liên hệ nhóm, hãy tạo một issue trong tổ chức TrekLink trên GitHub tại ${GH}.`,
        ],
      },
      {
        id: 'analytics',
        heading: 'Phân tích truy cập',
        body: [
          'Chúng tôi dùng Cloudflare Web Analytics để đếm lượt truy cập. Công cụ này không đặt cookie và không dùng địa chỉ IP để theo dõi bạn giữa các trang web.',
          'Công cụ ghi lại dữ liệu tổng hợp của mỗi lượt xem trang, như trang đã xem, trang giới thiệu, trình duyệt, hệ điều hành và quốc gia. Chúng tôi chỉ thấy số liệu tổng, không thấy từng cá nhân.',
        ],
        list: ['Chính sách quyền riêng tư của Cloudflare: https://www.cloudflare.com/privacypolicy/'],
      },
      {
        id: 'hosting',
        heading: 'Nhật ký máy chủ',
        body: [
          'GitHub phục vụ các trang này và có thể ghi lại dữ liệu kỹ thuật như địa chỉ IP để bảo đảm an toàn dịch vụ. Việc xử lý đó tuân theo Tuyên bố quyền riêng tư của GitHub.',
        ],
        list: ['Tuyên bố quyền riêng tư của GitHub: https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement'],
      },
      {
        id: 'browser',
        heading: 'Dữ liệu lưu trong trình duyệt của bạn',
        body: [
          'Hai tùy chọn được lưu trong bộ nhớ cục bộ của trình duyệt để trang ghi nhớ lựa chọn của bạn. Chúng không bao giờ rời khỏi thiết bị của bạn.',
          'Bạn có thể xóa chúng bất cứ lúc nào bằng cách xóa dữ liệu của trang này trong cài đặt trình duyệt.',
        ],
        list: ['treklink.locale: ngôn ngữ bạn đã chọn', 'treklink.theme: giao diện sáng hoặc tối'],
      },
      {
        id: 'links',
        heading: 'Theo dõi liên kết',
        body: [
          'Các liên kết dẫn ra ngoài trang có gắn tham số UTM ghi tên trang này và liên kết bạn đã bấm, ví dụ utm_source=treklink-landing. Chúng mô tả liên kết, không mô tả bạn.',
          'Nếu bạn đến trang với tham số UTM riêng, liên kết vào hệ thống vận hành sẽ chuyển tiếp các tham số đó để giữ nguồn truy cập.',
        ],
      },
      {
        id: 'ops',
        heading: 'Hệ thống vận hành',
        body: [
          'Hệ thống vận hành là một dịch vụ riêng với điều khoản riêng. Khi bạn bấm liên kết tới hệ thống, trình duyệt của bạn sẽ hỏi hệ thống đó xem có đang hoạt động không. Yêu cầu này đi từ trình duyệt của bạn tới hệ thống vận hành, và hệ thống có thể ghi lại yêu cầu đó.',
        ],
      },
      {
        id: 'rights',
        heading: 'Lựa chọn của bạn',
        body: [
          'Trang này không lưu dữ liệu cá nhân nào về bạn, nên chúng tôi không có gì để xuất hay xóa. Bạn có thể chặn công cụ phân tích bằng bất kỳ trình chặn nội dung nào và trang vẫn hoạt động bình thường.',
          'Với dữ liệu do Cloudflare hoặc GitHub lưu giữ, vui lòng liên hệ trực tiếp với họ. Với các vấn đề khác, hãy tạo một issue và chúng tôi sẽ hỗ trợ.',
        ],
      },
      {
        id: 'changes',
        heading: 'Thay đổi',
        body: ['Nếu chính sách này thay đổi, ngày ở đầu trang cũng thay đổi theo.'],
      },
    ],
  },
};

export const terms: Record<Locale, LegalDoc> = {
  en: {
    updated: LEGAL_UPDATED,
    intro:
      'These terms cover your use of the TrekLink landing site. By using the site you accept them. The operations system has its own terms.',
    sections: [
      {
        id: 'about',
        heading: 'What this site is',
        body: [
          'An information site for TrekLink, FPT University capstone project FA26SE159. Nothing is sold through it, and it takes no payments.',
        ],
      },
      {
        id: 'safety',
        heading: 'Not a guarantee of rescue',
        body: [
          'TrekLink is under active development. The hardware and features described here are prototypes and may change.',
          'Do not rely on TrekLink, or on anything on this site, as your only way to call for help. Carry the safety equipment your route requires, file a route plan, and follow the guidance of local authorities.',
        ],
      },
      {
        id: 'radio',
        heading: 'Radio use',
        body: [
          'Nodes default to the MY_433 region, 433.0 to 435.0 MHz. Rules for radio equipment differ between countries. You are responsible for operating any device in line with the rules where you use it.',
        ],
      },
      {
        id: 'ops',
        heading: 'The operations system',
        body: [
          'The link to the operations system is provided for convenience. That system is a separate service; its availability is not guaranteed by this site.',
        ],
      },
      {
        id: 'ip',
        heading: 'Content and code',
        body: [
          'Text, photographs and the TrekLink name and mark on this site belong to the TrekLink team. Source code in the TrekLink GitHub repositories is governed by the licence in each repository.',
          'The Oswald and Manrope typefaces are used under the SIL Open Font License.',
        ],
      },
      {
        id: 'external',
        heading: 'Other sites',
        body: [
          'Links to GitHub, Cloudflare and other sites are provided for reference. We are not responsible for their content or practices.',
        ],
      },
      {
        id: 'warranty',
        heading: 'No warranty, limited liability',
        body: [
          'The site and its content are provided as they are, without any warranty. To the extent the law allows, the TrekLink team is not liable for any loss arising from use of the site or reliance on its content.',
        ],
      },
      {
        id: 'law',
        heading: 'Governing law',
        body: ['These terms are governed by the laws of Vietnam.'],
      },
      {
        id: 'changes',
        heading: 'Changes and contact',
        body: [
          `If these terms change, the date at the top of the page changes with it. Questions: open an issue at ${GH}.`,
        ],
      },
    ],
  },
  vi: {
    updated: LEGAL_UPDATED,
    intro:
      'Các điều khoản này áp dụng khi bạn sử dụng trang giới thiệu TrekLink. Khi sử dụng trang, bạn đồng ý với các điều khoản này. Hệ thống vận hành có điều khoản riêng.',
    sections: [
      {
        id: 'about',
        heading: 'Trang này là gì',
        body: [
          'Đây là trang thông tin về TrekLink, đồ án tốt nghiệp FA26SE159 của Đại học FPT. Trang không bán sản phẩm và không nhận thanh toán.',
        ],
      },
      {
        id: 'safety',
        heading: 'Không bảo đảm việc cứu hộ',
        body: [
          'TrekLink đang trong quá trình phát triển. Phần cứng và tính năng được mô tả ở đây là nguyên mẫu và có thể thay đổi.',
          'Đừng dựa vào TrekLink, hay bất cứ nội dung nào trên trang này, như cách duy nhất để kêu gọi trợ giúp. Hãy mang theo thiết bị an toàn mà cung đường yêu cầu, đăng ký lộ trình và tuân theo hướng dẫn của chính quyền địa phương.',
        ],
      },
      {
        id: 'radio',
        heading: 'Sử dụng sóng vô tuyến',
        body: [
          'Thiết bị mặc định dùng khu vực MY_433, từ 433.0 đến 435.0 MHz. Quy định về thiết bị vô tuyến khác nhau giữa các quốc gia. Bạn chịu trách nhiệm vận hành thiết bị theo đúng quy định tại nơi sử dụng.',
        ],
      },
      {
        id: 'ops',
        heading: 'Hệ thống vận hành',
        body: [
          'Liên kết tới hệ thống vận hành được cung cấp để thuận tiện. Hệ thống đó là một dịch vụ riêng; trang này không bảo đảm hệ thống luôn hoạt động.',
        ],
      },
      {
        id: 'ip',
        heading: 'Nội dung và mã nguồn',
        body: [
          'Văn bản, hình ảnh cùng tên và biểu tượng TrekLink trên trang này thuộc về nhóm TrekLink. Mã nguồn trong các kho TrekLink trên GitHub tuân theo giấy phép của từng kho.',
          'Kiểu chữ Oswald và Manrope được sử dụng theo Giấy phép Phông chữ Mở SIL.',
        ],
      },
      {
        id: 'external',
        heading: 'Trang web khác',
        body: [
          'Các liên kết tới GitHub, Cloudflare và trang web khác chỉ để tham khảo. Chúng tôi không chịu trách nhiệm về nội dung hay cách vận hành của các trang đó.',
        ],
      },
      {
        id: 'warranty',
        heading: 'Không bảo hành, giới hạn trách nhiệm',
        body: [
          'Trang và nội dung được cung cấp nguyên trạng, không kèm bất kỳ bảo hành nào. Trong phạm vi pháp luật cho phép, nhóm TrekLink không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc sử dụng trang hoặc dựa vào nội dung của trang.',
        ],
      },
      {
        id: 'law',
        heading: 'Luật áp dụng',
        body: ['Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam.'],
      },
      {
        id: 'changes',
        heading: 'Thay đổi và liên hệ',
        body: [
          `Nếu các điều khoản thay đổi, ngày ở đầu trang cũng thay đổi theo. Mọi câu hỏi: hãy tạo một issue tại ${GH}.`,
        ],
      },
    ],
  },
};

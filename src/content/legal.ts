/**
 * The legal pages, in both locales. Kept as structured content rather than
 * catalogue keys because each is a document, not a set of labels. Both
 * locales must carry the same sections, with the same number of paragraphs,
 * list items and links in each, and identical link targets; the tests check
 * all of it. Addresses never sit inside prose: they live in `links`, so the
 * page renders them without parsing sentences.
 *
 * These describe what this static site actually does, written against
 * Vietnam's Law on Personal Data Protection (No. 91/2025/QH15) and its
 * implementing Decree 356/2025/ND-CP, both in force from 1 January 2026.
 * They are the team's own drafting, not legal advice; open items for review
 * are listed in specs/landing/requirements.md (Q4).
 *
 * The Vietnamese version prevails where the two differ, as each document
 * says in its language section.
 */
import type { Locale } from '../i18n';
import { siteConfig } from '../../site.config';

export interface LegalLink {
  label: string;
  href: string;
}
export interface LegalSection {
  id: string;
  heading: string;
  /** Paragraphs. The list, when present, renders after the first one. */
  body: string[];
  list?: string[];
  /** Rendered last, as a list of links. */
  links?: LegalLink[];
}
export interface LegalDoc {
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL_UPDATED = '2026-09-24';

const MAIL = `mailto:${siteConfig.contactEmail}`;
const REPO_ISSUES = 'https://github.com/TrekLink-Team/TrekLink-Team.github.io/issues';
const CLOUDFLARE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/';
const GITHUB_PRIVACY =
  'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement';
const MESHTASTIC = 'https://meshtastic.org/';

export const privacy: Record<Locale, LegalDoc> = {
  en: {
    updated: LEGAL_UPDATED,
    intro:
      'This policy covers the TrekLink landing site only. The site has no forms, no accounts and no sign-in, and it never asks for your name, email or location. Visiting it still involves a small amount of personal data, such as your IP address reaching our hosting and analytics providers. This page says what that data is, who handles it and what you can do about it.',
    sections: [
      {
        id: 'who',
        heading: 'Who is responsible',
        body: [
          'The TrekLink team, the student team behind FPT University capstone project FA26SE159, decides how this site processes personal data. The team is not a company.',
          'For any question or request about your personal data, email us. Please do not use GitHub issues for anything personal: issues are public.',
        ],
        links: [{ label: siteConfig.contactEmail, href: MAIL }],
      },
      {
        id: 'data',
        heading: 'What is processed, and why',
        body: [
          'Each item below names the data, the purpose and who handles it. We use none of it for advertising, profiling or automated decisions about you, and we never sell it.',
        ],
        list: [
          'Hosting: when your browser requests a page, GitHub Pages receives your IP address, browser details and the address you asked for, in order to deliver the page and keep the service secure. GitHub handles this under its own privacy statement.',
          'Analytics: Cloudflare Web Analytics counts page views. It records the page, the referring site, the browser, the operating system, the device type and the country. Cloudflare states that it sets no cookies and does not use your IP address to track you. We see only totals, never individual visitors.',
          'Settings in your browser: your language and theme choices are stored in your browser, under treklink.locale and treklink.theme. They never leave your device.',
          'Operations system check: when you press a link into the operations system, your browser asks that system whether it is available. The request goes from your browser directly to that system, which may log it.',
          'Email: if you email us, we receive your address and your message, and use them only to answer you.',
        ],
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
        id: 'retention',
        heading: 'How long it is kept',
        body: [
          'We keep no copy of hosting logs or analytics records. The analytics dashboard shows us aggregate totals only. GitHub and Cloudflare keep their own records for the periods set out in their privacy policies.',
          'Emails are kept only as long as we need them to handle your request, and are then deleted.',
        ],
      },
      {
        id: 'transfer',
        heading: 'Processing outside Vietnam',
        body: [
          'GitHub and Cloudflare are based in the United States and serve pages and scripts from locations around the world, so data about your visit is processed outside Vietnam. Each applies its own safeguards, described in its privacy policy.',
        ],
        links: [
          { label: 'GitHub Privacy Statement', href: GITHUB_PRIVACY },
          { label: 'Cloudflare privacy policy', href: CLOUDFLARE_PRIVACY },
        ],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        body: [
          'Under Vietnamese law you have the right to:',
          'Email us to use any of these rights. We will reply within the time the law requires. Where the data is held by GitHub or Cloudflare rather than by us, we will tell you so and help you reach them. You can also block the analytics script with any content blocker; the site keeps working.',
        ],
        list: [
          'be told how your personal data is processed',
          'agree or refuse to agree to its processing, and withdraw your agreement at any time',
          'see your personal data, and have it corrected',
          'have it deleted, or its processing restricted',
          'object to its processing',
          'complain, report a violation, and ask the competent authority, the Ministry of Public Security, to protect your data',
        ],
        links: [{ label: siteConfig.contactEmail, href: MAIL }],
      },
      {
        id: 'language',
        heading: 'Language',
        body: [
          'This policy is published in Vietnamese and English. If the two versions differ, the Vietnamese version prevails.',
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
      'Chính sách này chỉ áp dụng cho trang giới thiệu TrekLink. Trang không có biểu mẫu, tài khoản hay đăng nhập, và không bao giờ hỏi tên, email hay vị trí của bạn. Tuy vậy, việc truy cập trang vẫn liên quan đến một lượng nhỏ dữ liệu cá nhân, chẳng hạn địa chỉ IP của bạn được gửi tới các nhà cung cấp dịch vụ lưu trữ và phân tích của chúng tôi. Trang này cho biết đó là dữ liệu gì, ai xử lý và bạn có thể làm gì.',
    sections: [
      {
        id: 'who',
        heading: 'Ai chịu trách nhiệm',
        body: [
          'Nhóm TrekLink, nhóm sinh viên thực hiện đồ án tốt nghiệp FA26SE159 của Đại học FPT, quyết định cách trang này xử lý dữ liệu cá nhân. Nhóm không phải là một doanh nghiệp.',
          'Với mọi câu hỏi hoặc yêu cầu về dữ liệu cá nhân của bạn, hãy gửi email cho chúng tôi. Vui lòng không dùng issue trên GitHub cho các vấn đề cá nhân: issue được công khai.',
        ],
        links: [{ label: siteConfig.contactEmail, href: MAIL }],
      },
      {
        id: 'data',
        heading: 'Dữ liệu được xử lý và mục đích',
        body: [
          'Mỗi mục dưới đây nêu dữ liệu, mục đích và bên xử lý. Chúng tôi không dùng dữ liệu nào cho quảng cáo, lập hồ sơ hay ra quyết định tự động về bạn, và không bao giờ bán dữ liệu.',
        ],
        list: [
          'Lưu trữ trang: khi trình duyệt của bạn yêu cầu một trang, GitHub Pages nhận địa chỉ IP, thông tin trình duyệt và địa chỉ trang bạn yêu cầu, để phục vụ trang và bảo đảm an toàn dịch vụ. GitHub xử lý dữ liệu này theo tuyên bố quyền riêng tư của mình.',
          'Phân tích truy cập: Cloudflare Web Analytics đếm lượt xem trang. Công cụ ghi lại trang đã xem, trang giới thiệu, trình duyệt, hệ điều hành, loại thiết bị và quốc gia. Cloudflare cho biết công cụ không đặt cookie và không dùng địa chỉ IP để theo dõi bạn. Chúng tôi chỉ thấy số liệu tổng, không bao giờ thấy từng người truy cập.',
          'Cài đặt trong trình duyệt: lựa chọn ngôn ngữ và giao diện của bạn được lưu trong trình duyệt, với tên treklink.locale và treklink.theme. Chúng không bao giờ rời khỏi thiết bị của bạn.',
          'Kiểm tra hệ thống vận hành: khi bạn bấm liên kết vào hệ thống vận hành, trình duyệt của bạn sẽ hỏi hệ thống đó xem có đang hoạt động không. Yêu cầu này đi thẳng từ trình duyệt của bạn tới hệ thống đó, và hệ thống có thể ghi lại yêu cầu.',
          'Email: nếu bạn gửi email cho chúng tôi, chúng tôi nhận địa chỉ email và nội dung thư của bạn, và chỉ dùng chúng để trả lời bạn.',
        ],
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
        id: 'retention',
        heading: 'Thời gian lưu giữ',
        body: [
          'Chúng tôi không giữ bản sao nào của nhật ký máy chủ hay dữ liệu phân tích. Bảng điều khiển phân tích chỉ cho chúng tôi thấy số liệu tổng hợp. GitHub và Cloudflare lưu giữ dữ liệu của họ trong thời hạn nêu tại chính sách quyền riêng tư của họ.',
          'Email chỉ được giữ trong thời gian cần thiết để xử lý yêu cầu của bạn, sau đó sẽ bị xóa.',
        ],
      },
      {
        id: 'transfer',
        heading: 'Xử lý dữ liệu ngoài Việt Nam',
        body: [
          'GitHub và Cloudflare có trụ sở tại Hoa Kỳ và phục vụ trang cũng như mã chạy trên trang từ nhiều địa điểm trên thế giới, vì vậy dữ liệu về lượt truy cập của bạn được xử lý bên ngoài Việt Nam. Mỗi bên áp dụng biện pháp bảo vệ riêng, được mô tả trong chính sách quyền riêng tư của họ.',
        ],
        links: [
          { label: 'Tuyên bố quyền riêng tư của GitHub', href: GITHUB_PRIVACY },
          { label: 'Chính sách quyền riêng tư của Cloudflare', href: CLOUDFLARE_PRIVACY },
        ],
      },
      {
        id: 'rights',
        heading: 'Quyền của bạn',
        body: [
          'Theo pháp luật Việt Nam, bạn có quyền:',
          'Hãy gửi email cho chúng tôi để thực hiện bất kỳ quyền nào trong số này. Chúng tôi sẽ trả lời trong thời hạn pháp luật quy định. Nếu dữ liệu do GitHub hoặc Cloudflare nắm giữ chứ không phải chúng tôi, chúng tôi sẽ cho bạn biết và giúp bạn liên hệ với họ. Bạn cũng có thể chặn mã phân tích bằng bất kỳ trình chặn nội dung nào; trang vẫn hoạt động bình thường.',
        ],
        list: [
          'được biết dữ liệu cá nhân của mình được xử lý như thế nào',
          'đồng ý hoặc không đồng ý với việc xử lý, và rút lại sự đồng ý bất cứ lúc nào',
          'xem dữ liệu cá nhân của mình, và yêu cầu chỉnh sửa',
          'yêu cầu xóa dữ liệu, hoặc hạn chế việc xử lý',
          'phản đối việc xử lý',
          'khiếu nại, tố cáo vi phạm, và yêu cầu cơ quan có thẩm quyền là Bộ Công an bảo vệ dữ liệu của mình',
        ],
        links: [{ label: siteConfig.contactEmail, href: MAIL }],
      },
      {
        id: 'language',
        heading: 'Ngôn ngữ',
        body: [
          'Chính sách này được công bố bằng tiếng Việt và tiếng Anh. Nếu hai bản có nội dung khác nhau, bản tiếng Việt được ưu tiên áp dụng.',
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
          'An information site for TrekLink, FPT University capstone project FA26SE159, run by its student team. Nothing is sold through it, and it takes no payments.',
        ],
      },
      {
        id: 'safety',
        heading: 'Not a guarantee of rescue',
        body: [
          'TrekLink is under active development. The hardware and features described here are prototypes and may change. A radio mesh can lose messages or deliver them late: terrain, range, batteries and weather all affect it.',
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
        heading: 'Content, marks and code',
        body: [
          'The text on this site and the TrekLink name and mark belong to the TrekLink team. The product images are renders created from photographs of the team’s prototypes, not unedited photographs.',
          'Other names and marks belong to their owners and are used only to identify their products. Meshtastic® is a registered trademark of Meshtastic LLC; this site is not affiliated with or endorsed by the Meshtastic project. LilyGO and T-Beam are names of LilyGO products. FPT University is named only to identify the programme this project belongs to.',
          'Source code in the TrekLink GitHub repositories is governed by the licence in each repository. The Oswald and Manrope typefaces are used under the SIL Open Font License.',
        ],
        links: [{ label: 'meshtastic.org', href: MESHTASTIC }],
      },
      {
        id: 'external',
        heading: 'Other sites',
        body: [
          'Links to GitHub, Cloudflare, Meshtastic and other sites are provided for reference. We are not responsible for their content or practices.',
        ],
      },
      {
        id: 'warranty',
        heading: 'No warranty, limited liability',
        body: [
          'The site and its content are provided as they are, without any warranty. To the extent the law allows, the TrekLink team is not liable for any loss arising from use of the site or reliance on its content. Nothing in these terms limits a right you have under Vietnamese law that cannot be limited by agreement.',
        ],
      },
      {
        id: 'law',
        heading: 'Governing law and disputes',
        body: [
          'These terms are governed by the laws of Vietnam. If a dispute arises, please contact us first so we can try to resolve it together. A dispute that cannot be resolved that way goes to a competent court of Vietnam.',
        ],
      },
      {
        id: 'language',
        heading: 'Language',
        body: [
          'These terms are published in Vietnamese and English. If the two versions differ, the Vietnamese version prevails.',
        ],
      },
      {
        id: 'changes',
        heading: 'Changes and contact',
        body: [
          'If these terms change, the date at the top of the page changes with it. Legal questions go to our email address. General questions about the site can also be raised as a public issue on its repository.',
        ],
        links: [
          { label: siteConfig.contactEmail, href: MAIL },
          { label: 'Site issues on GitHub', href: REPO_ISSUES },
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
          'Đây là trang thông tin về TrekLink, đồ án tốt nghiệp FA26SE159 của Đại học FPT, do nhóm sinh viên thực hiện đồ án vận hành. Trang không bán sản phẩm và không nhận thanh toán.',
        ],
      },
      {
        id: 'safety',
        heading: 'Không bảo đảm việc cứu hộ',
        body: [
          'TrekLink đang trong quá trình phát triển. Phần cứng và tính năng được mô tả ở đây là nguyên mẫu và có thể thay đổi. Mạng lưới vô tuyến có thể làm mất tin nhắn hoặc gửi chậm: địa hình, tầm phủ sóng, pin và thời tiết đều có ảnh hưởng.',
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
        heading: 'Nội dung, nhãn hiệu và mã nguồn',
        body: [
          'Văn bản trên trang này cùng tên và biểu tượng TrekLink thuộc về nhóm TrekLink. Hình ảnh sản phẩm là ảnh dựng được tạo từ ảnh chụp các nguyên mẫu của nhóm, không phải ảnh chụp chưa qua chỉnh sửa.',
          'Các tên và nhãn hiệu khác thuộc về chủ sở hữu tương ứng và chỉ được dùng để chỉ sản phẩm của họ. Meshtastic® là nhãn hiệu đã đăng ký của Meshtastic LLC; trang này không liên kết với và không được dự án Meshtastic xác nhận. LilyGO và T-Beam là tên sản phẩm của LilyGO. Tên Đại học FPT chỉ được nêu để xác định chương trình mà đồ án này thuộc về.',
          'Mã nguồn trong các kho TrekLink trên GitHub tuân theo giấy phép của từng kho. Kiểu chữ Oswald và Manrope được sử dụng theo Giấy phép Phông chữ Mở SIL.',
        ],
        links: [{ label: 'meshtastic.org', href: MESHTASTIC }],
      },
      {
        id: 'external',
        heading: 'Trang web khác',
        body: [
          'Các liên kết tới GitHub, Cloudflare, Meshtastic và trang web khác chỉ để tham khảo. Chúng tôi không chịu trách nhiệm về nội dung hay cách vận hành của các trang đó.',
        ],
      },
      {
        id: 'warranty',
        heading: 'Không bảo hành, giới hạn trách nhiệm',
        body: [
          'Trang và nội dung được cung cấp nguyên trạng, không kèm bất kỳ bảo hành nào. Trong phạm vi pháp luật cho phép, nhóm TrekLink không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc sử dụng trang hoặc dựa vào nội dung của trang. Không điều khoản nào ở đây hạn chế quyền của bạn theo pháp luật Việt Nam mà không thể bị hạn chế bằng thỏa thuận.',
        ],
      },
      {
        id: 'law',
        heading: 'Luật áp dụng và giải quyết tranh chấp',
        body: [
          'Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Khi phát sinh tranh chấp, vui lòng liên hệ với chúng tôi trước để cùng tìm cách giải quyết. Tranh chấp không giải quyết được bằng cách đó sẽ được đưa ra tòa án có thẩm quyền của Việt Nam.',
        ],
      },
      {
        id: 'language',
        heading: 'Ngôn ngữ',
        body: [
          'Các điều khoản này được công bố bằng tiếng Việt và tiếng Anh. Nếu hai bản có nội dung khác nhau, bản tiếng Việt được ưu tiên áp dụng.',
        ],
      },
      {
        id: 'changes',
        heading: 'Thay đổi và liên hệ',
        body: [
          'Nếu các điều khoản thay đổi, ngày ở đầu trang cũng thay đổi theo. Câu hỏi pháp lý vui lòng gửi tới địa chỉ email của chúng tôi. Câu hỏi chung về trang cũng có thể được nêu dưới dạng issue công khai trên kho mã của trang.',
        ],
        links: [
          { label: siteConfig.contactEmail, href: MAIL },
          { label: 'Issue của trang trên GitHub', href: REPO_ISSUES },
        ],
      },
    ],
  },
};

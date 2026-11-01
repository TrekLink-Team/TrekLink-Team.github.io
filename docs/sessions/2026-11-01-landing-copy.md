# Session: landing copy realigned to the registered topic (W17)

**Date**: 2026-11-01
**Repos touched**: `TrekLink-Team.github.io` (edited), `treklink-web` (read only, for facts)
**Owner**: KhoaDD
**Branch**: `feat/landing-rental-platform-copy`, cut from `origin/dev`

---

## Goal

Align the landing page with the registered title, "TrekLink: An Integrated Off-Grid Communication
and Smart Device Rental Management Platform for Trekking Agencies" (D-033). The audience becomes
trekking agencies; the copy presents the rental platform as well as the hardware; SOS is one
capability, not the problem statement.

## What changed

- `specs/landing/requirements.md`: §1 Purpose and In-Scope rewritten for agencies and the rental
  platform; a dated 2026-11-01 line under Q3.
- `specs/landing/design.md`: §3.1 rows for `Hero`, `Problem` and the new `Renting`; §2.2 component
  list brought up to date.
- `src/components/Renting.astro` (new, `#renting`): five steps, reusing the step structure and
  styles of `HowItWorks`. Placed after `Problem`, before `HowItWorks`.
- `Hero.astro`: the primary call to action "See rental plans" is a system link with the same
  `data-system-link` wiring as the header (D-088, discovered root URL, UTM content
  `hero-see-plans`); the secondary goes to `#renting`. Spinner styles copied from `CtaBand`.
- `CtaBand.astro`: primary keeps the system link wiring (UTM content now `cta-see-plans`); the
  secondary goes to `#renting`.
- `Header.astro`: a `renting` entry in the section list, so the desktop nav, the mobile nav and
  the scrollspy all follow the new id.
- `Faq.astro`: five questions instead of three.
- Catalogues: 58 keys changed or added in both `en.json` and `vi.json`, 18 of them new.

## Sources for every product fact in the copy

| Claim | Source in `treklink-web/specs/` |
|---|---|
| Monthly and day plans; a monthly plan renews term by term until notice | `rentals/requirements.md` REQ-EVT-01, REQ-EVT-07, REQ-EVT-08 |
| Organization registers with a tax code, verified and approved before it can request | `organizations/requirements.md` REQ-EVT-01, REQ-EVT-03, REQ-STA-01 |
| Staff approve the contract and issue the first invoice | `rentals/requirements.md` REQ-EVT-02 |
| Handover at the counter, signed by the Manager, first payment confirmed, devices provisioned | `rentals/requirements.md` REQ-EVT-04, REQ-EVT-05 |
| Return by check-in at the counter | `rentals/requirements.md` REQ-EVT-10 |
| Alert tiers: primary, backup, Manager, then TrekLink Staff | `incidents/requirements.md` REQ-EVT-04; `organizations/requirements.md` REQ-EVT-10 |
| Pay online (SePay sandbox) or at the counter | `billing/requirements.md` REQ-EVT-08, REQ-EVT-10 |
| Field Station queues and uploads when its uplink is back | `gateway-sync/requirements.md` scope, REQ-ERR-03 |
| "Does not replace official search-and-rescue channels" | `frontend/ui-design/2-3-plans-page.md` disclaimer; `src/content/legal.ts` Terms |
| The system root is the public plans page | `frontend/ui-design/2-3-plans-page.md`, routes `/` and `/plans` |

No prices, plan lengths, minimum order, customer names or availability are stated.

## Findings

- The task named a `contracts` module; `treklink-web/specs/` has none. Contracts live in
  `specs/rentals/`.
- "Not individuals" is the decided scope from the leader. The specs support it indirectly (an
  organization registers with a tax code and a Manager); no spec line says "individuals cannot rent".
- "Device holders use the stock Meshtastic app and need no TrekLink account" was not found in any
  `treklink-web` spec, so the copy does not state it.
- The docs root `../treklink-docs/_docs/` is not present in this cloud checkout; the conventions
  applied are the ones restated in `AGENTS.md`.
- Vietnamese uppercase display type (Oswald, line-height 0.93) lets stacked diacritics touch the
  line above in the hero and section headings. Present before this change; not addressed here.

## Review fixes (TrekLink-Team.github.io#25)

- The problem section no longer claims that no local fleet exists or that tracking is scattered
  across phones and chat groups; neither had a source.
- `renting.d.body` says an alert reaches TrekLink Staff only when nobody acknowledges it
  (incidents REQ-EVT-04).
- Vietnamese: `renting.a.body` "trước khi tổ chức có thể thuê thiết bị"; `faq.a.a` "được gửi yêu
  cầu hợp đồng"; `how.legend.station` "Field Station".
- REQ-STA-01 covers every system link; `tasks.md` gains 6.5 (Renting) and 6.6 (hero link), and 3.2
  is marked superseded.

## Checks

- `npx vitest run`: 4 files, 51 tests passed. `how.legend.station` is "Field Station" in both
  locales, a proper noun, so the identical-value test allowlists it.
- `npx astro check`: 0 errors, 0 warnings, 0 hints across 44 files.
- `npx astro build`: 7 pages.
- `python3 .github/scripts/check_prose.py`: clean.
- Screenshots of `/` and `/vi/` at 1440 and 375 px, dark and light, were taken and reviewed in the
  session; by review decision they are not kept in the repository.

## Old and new copy

| Key | Old (en) | New (en) | Old (vi) | New (vi) |
|---|---|---|---|---|
| `meta.title` | TrekLink: keep your trekking group in reach where the signal ends | TrekLink: off-grid communication and node rental for trekking agencies | TrekLink: giữ cả đoàn trekking trong tầm liên lạc nơi sóng điện thoại kết thúc | TrekLink: liên lạc ngoài vùng phủ sóng và cho thuê thiết bị cho doanh nghiệp trekking |
| `meta.description` | TrekLink handsets pass position, status and SOS to each other over a LoRa mesh, with no cell tower, and send queued events to your basecamp gateway when an uplink returns. | TrekLink rents LoRa mesh nodes to registered trekking agencies on monthly or day plans, with one platform for the live map, tiered alerts, contracts and invoices on routes beyond phone coverage. | Thiết bị TrekLink truyền vị trí, trạng thái và tín hiệu SOS cho nhau qua mạng lưới LoRa, không cần trạm phát sóng, rồi gửi các sự kiện đang chờ về trạm gốc khi có kết nối trở lại. | TrekLink cho các doanh nghiệp trekking đã đăng ký thuê thiết bị mạng lưới LoRa theo gói tháng hoặc gói ngày, cùng một nền tảng cho bản đồ trực tiếp, cảnh báo theo cấp, hợp đồng và hóa đơn trên những cung đường ngoài vùng phủ sóng. |
| `nav.problem` | The risk | The gap | Rủi ro | Khoảng trống |
| `nav.renting` | (new key) | Renting | (new key) | Thuê thiết bị |
| `nav.how` | How it works | SOS path | Cách hoạt động | Đường đi SOS |
| `hero.eyebrow` | LoRa mesh safety for no-signal routes | Off-grid node rental for trekking agencies | An toàn qua mạng LoRa cho cung đường mất sóng | Cho thuê thiết bị ngoài vùng phủ sóng cho doanh nghiệp trekking |
| `hero.headline.a` | Keep your whole group | Rent an off-grid fleet | Giữ cả đoàn | Thuê thiết bị ngoài vùng sóng |
| `hero.headline.b` | in reach, | for your groups, | trong tầm liên lạc, | cho các đoàn, |
| `hero.headline.c` | days past the last bar of signal | and run it from one platform | nhiều ngày sau khi mất vạch sóng cuối cùng | vận hành trên một nền tảng |
| `hero.sub` | Handsets pass position, status and SOS to each other over a LoRa mesh. When a node reaches your basecamp gateway, the events it holds sync. | TrekLink owns and maintains a fleet of LoRa mesh nodes. Registered agencies rent them on monthly or day plans, collect them at our counter, and follow their groups on a live map with tiered alerts and invoices in one place. | Các thiết bị cầm tay truyền vị trí, trạng thái và SOS cho nhau qua mạng lưới LoRa. Khi một thiết bị chạm tới cổng kết nối ở trạm gốc, các sự kiện thiết bị đó đang giữ sẽ được đồng bộ. | TrekLink sở hữu và bảo trì một đội thiết bị mạng lưới LoRa. Doanh nghiệp đã đăng ký thuê theo gói tháng hoặc gói ngày, nhận thiết bị tại quầy của chúng tôi, rồi theo dõi đoàn trên bản đồ trực tiếp, với cảnh báo theo cấp và hóa đơn ở cùng một nơi. |
| `hero.cta.primary` | Find the node for your route | See rental plans | Chọn thiết bị cho cung đường của bạn | Xem các gói thuê |
| `hero.cta.secondary` | Follow an SOS to basecamp | How renting works | Theo dấu một tín hiệu SOS về trạm | Quy trình thuê |
| `proof.towers.label` | cell towers between handsets | cell towers between nodes | trạm phát sóng giữa các thiết bị | trạm phát sóng giữa các thiết bị |
| `problem.eyebrow` | The risk | The gap | Rủi ro | Khoảng trống |
| `problem.heading` | On a multi-day route, the phones go quiet for days | On multi-day routes, your groups go days without signal | Trên cung đường nhiều ngày, điện thoại im lặng nhiều ngày | Trên cung đường nhiều ngày, đoàn của bạn mất sóng nhiều ngày liền |
| `problem.without.label` | Without a mesh | Without TrekLink | Không có mạng lưới | Không có TrekLink |
| `problem.a.without` | A fall is found when someone walks back to look. | Groups are out of coverage for days, and the office hears from them when they walk out. | Một cú ngã chỉ được phát hiện khi có người quay lại tìm. | Đoàn ở ngoài vùng phủ sóng nhiều ngày, văn phòng chỉ nghe tin khi đoàn ra khỏi tuyến. |
| `problem.a.with` | The carrier's node asks, then raises the alarm where it happened. | Rented nodes pass position, status and SOS across the group over LoRa, and the Field Station uploads them when it has internet. | Thiết bị của người mang hỏi trước, rồi phát báo động ngay tại chỗ. | Thiết bị thuê truyền vị trí, trạng thái và SOS khắp đoàn qua LoRa, và Field Station tải lên khi có internet. |
| `problem.b.without` | Nobody can say where the group is. | An agency that wants its own off-grid devices has to buy and maintain them itself. | Không ai biết đoàn đang ở đâu. | Doanh nghiệp muốn có thiết bị ngoài vùng sóng riêng phải tự mua và tự bảo trì. |
| `problem.b.with` | Position hops between handsets, so the group tracks itself. | TrekLink owns and maintains the nodes. You rent them on a monthly or day plan and collect them at our counter. | Vị trí được chuyển qua các thiết bị, nên đoàn tự theo dõi được nhau. | TrekLink sở hữu và bảo trì thiết bị. Doanh nghiệp thuê theo gói tháng hoặc gói ngày và nhận tại quầy của chúng tôi. |
| `problem.c.without` | Basecamp hears what happened after you walk out. | Tracking and alerting depend on someone reaching a phone signal. | Trạm gốc chỉ biết chuyện sau khi đoàn đã ra khỏi tuyến. | Việc theo dõi và cảnh báo phụ thuộc vào việc ai đó bắt được sóng điện thoại. |
| `problem.c.with` | Basecamp receives the events a node has queued once that node reaches the gateway. | One platform holds the live map, the tiered alerts, the contracts and the invoices for every rented node. | Trạm gốc nhận các sự kiện một thiết bị đang chờ khi thiết bị đó chạm tới cổng kết nối. | Một nền tảng chứa bản đồ trực tiếp, cảnh báo theo cấp, hợp đồng và hóa đơn của mọi thiết bị đang thuê. |
| `renting.eyebrow` | (new key) | How renting works | (new key) | Quy trình thuê |
| `renting.heading` | (new key) | From registration to the returned node | (new key) | Từ lúc đăng ký tới khi trả thiết bị |
| `renting.lede` | (new key) | Every step runs in the operations platform, and the nodes change hands only at TrekLink's counter. | (new key) | Mọi bước đều diễn ra trên nền tảng vận hành, và thiết bị chỉ được giao nhận tại quầy của TrekLink. |
| `renting.a.title` | (new key) | Register | (new key) | Đăng ký |
| `renting.a.body` | (new key) | Your agency or company registers with its tax code. TrekLink verifies it before it can rent. | (new key) | Doanh nghiệp hoặc công ty đăng ký bằng mã số thuế. TrekLink xác minh trước khi tổ chức có thể thuê thiết bị. |
| `renting.b.title` | (new key) | Choose a plan | (new key) | Chọn gói |
| `renting.b.body` | (new key) | Your manager picks a monthly or day plan and the number of nodes, then requests a contract. TrekLink approves it and issues the first invoice. | (new key) | Người quản lý chọn gói tháng hoặc gói ngày và số lượng thiết bị, rồi gửi yêu cầu hợp đồng. TrekLink duyệt và xuất hóa đơn đầu tiên. |
| `renting.c.title` | (new key) | Collect at the counter | (new key) | Nhận tại quầy |
| `renting.c.body` | (new key) | Once the first payment is confirmed, your manager signs the handover at TrekLink's counter and takes the nodes, set up for your organization. | (new key) | Khi khoản thanh toán đầu tiên được xác nhận, người quản lý ký biên bản bàn giao tại quầy TrekLink và nhận thiết bị đã cài đặt cho tổ chức. |
| `renting.d.title` | (new key) | Follow the group | (new key) | Theo dõi đoàn |
| `renting.d.body` | (new key) | The platform shows your rented nodes on a live map. An alert goes to your operators on duty, then your manager, and reaches TrekLink staff only if nobody acknowledges it. | (new key) | Nền tảng hiển thị các thiết bị đang thuê trên bản đồ trực tiếp. Cảnh báo tới điều phối viên đang trực, rồi người quản lý, và chỉ tới nhân viên TrekLink khi không ai xác nhận. |
| `renting.e.title` | (new key) | Return and settle | (new key) | Trả và thanh toán |
| `renting.e.body` | (new key) | Bring the nodes back to the counter when the plan ends, and pay the invoice online or at the counter. | (new key) | Mang thiết bị về quầy khi gói kết thúc, và thanh toán hóa đơn trực tuyến hoặc tại quầy. |
| `how.heading` | From a press on the ridge to a responder at camp | From a press on the ridge to your operator on duty | Từ một lần bấm trên sườn núi tới người ứng cứu ở trạm | Từ một lần bấm trên sườn núi tới điều phối viên đang trực |
| `how.diagram.label` | A terrain map with a mesh of trekker nodes, one guide's node and a basecamp station. An SOS from one node ripples outward through every link until it reaches the station. | A terrain map with a mesh of trekker nodes, one guide's node and a Field Station. An SOS from one node ripples outward through every link until it reaches the Field Station. | Bản đồ địa hình với mạng lưới thiết bị của người đi trekking, một thiết bị của hướng dẫn viên và một trạm gốc. Tín hiệu SOS từ một thiết bị lan ra qua mọi liên kết cho tới khi chạm tới trạm. | Bản đồ địa hình với mạng lưới thiết bị của người đi trekking, một thiết bị của hướng dẫn viên và một Field Station. Tín hiệu SOS từ một thiết bị lan ra qua mọi liên kết cho tới khi chạm tới Field Station. |
| `how.c.title` | Basecamp sees it | The Field Station uploads it | Trạm gốc nhận được | Field Station tải lên |
| `how.c.body` | The station syncs it to the operations system the moment it arrives. | The Field Station, a laptop with one node on USB, queues the SOS and uploads it to the operations platform when the laptop is online. The alert then goes to your operators. | Trạm đồng bộ lên hệ thống vận hành ngay khi tín hiệu tới nơi. | Field Station, một máy tính xách tay gắn một thiết bị qua cổng USB, xếp tín hiệu SOS vào hàng đợi và tải lên nền tảng vận hành khi máy có mạng. Sau đó cảnh báo được gửi tới các điều phối viên của doanh nghiệp. |
| `faq.heading` | Before you pack it | Before you rent | Trước khi bạn lên đường | Trước khi thuê |
| `faq.a.q` | What if no one is in range when I press SOS? | Who can rent TrekLink nodes? | Nếu không có ai trong tầm khi tôi bấm SOS thì sao? | Ai có thể thuê thiết bị TrekLink? |
| `faq.a.a` | The node keeps the SOS and sends it as soon as another node or the basecamp gateway comes into range. | Registered organizations: trekking agencies and companies, not individuals. An organization registers with its tax code, and TrekLink verifies it before its manager can request a contract. | Thiết bị giữ tín hiệu SOS và gửi ngay khi có thiết bị khác hoặc cổng kết nối trạm gốc trong tầm. | Các tổ chức đã đăng ký: doanh nghiệp và công ty trekking, không phải cá nhân. Tổ chức đăng ký bằng mã số thuế, và TrekLink xác minh trước khi người quản lý của tổ chức được gửi yêu cầu hợp đồng. |
| `faq.b.q` | Do we need a SIM, a phone plan or internet on the route? | Which plans are there? | Có cần SIM, gói cước hay internet trên cung đường không? | Có những gói thuê nào? |
| `faq.b.a` | No. Handsets talk to each other directly over LoRa. Only the basecamp gateway needs an uplink, and only to sync. | Two kinds. A monthly plan renews term by term until your manager gives notice. A day plan covers a set number of days. Current prices are on the plans page of the operations system. | Không. Các thiết bị liên lạc trực tiếp với nhau qua LoRa. Chỉ cổng kết nối ở trạm gốc cần đường truyền, và chỉ để đồng bộ. | Hai loại. Gói tháng tự gia hạn theo từng kỳ cho tới khi người quản lý báo kết thúc. Gói ngày áp dụng cho một số ngày cố định. Giá hiện hành nằm trên trang gói thuê của hệ thống vận hành. |
| `faq.c.q` | Which radio band does it use? | What happens if nobody acknowledges an alert? | Thiết bị dùng băng tần nào? | Nếu không ai xác nhận cảnh báo thì sao? |
| `faq.c.a` | Nodes default to the MY_433 region, 433.0 to 435.0 MHz, the band set for Vietnam and Malaysia. | It escalates. The alert goes to the operator on duty, then to the backup operator, then to your organization's manager, and if nobody acknowledges it, to TrekLink staff. TrekLink does not replace official search-and-rescue channels. | Mặc định là khu vực MY_433, từ 433.0 đến 435.0 MHz, băng tần dành cho Việt Nam và Malaysia. | Cảnh báo được chuyển lên cấp trên. Cảnh báo tới điều phối viên đang trực, rồi điều phối viên dự phòng, rồi người quản lý của tổ chức, và nếu vẫn không ai xác nhận, tới nhân viên TrekLink. TrekLink không thay thế các kênh tìm kiếm cứu nạn chính thức. |
| `faq.d.q` | (new key) | Do the groups need a SIM, a phone plan or internet on the route? | (new key) | Đoàn có cần SIM, gói cước hay internet trên cung đường không? |
| `faq.d.a` | (new key) | No. Nodes talk to each other directly over LoRa. Only the Field Station laptop needs internet, and only to upload what it has queued. | (new key) | Không. Các thiết bị liên lạc trực tiếp với nhau qua LoRa. Chỉ máy tính của Field Station cần internet, và chỉ để tải lên những gì đang chờ. |
| `faq.e.q` | (new key) | Which radio band does it use? | (new key) | Thiết bị dùng băng tần nào? |
| `faq.e.a` | (new key) | Nodes default to the MY_433 region, 433.0 to 435.0 MHz, the band set for Vietnam and Malaysia. | (new key) | Mặc định là khu vực MY_433, từ 433.0 đến 435.0 MHz, băng tần dành cho Việt Nam và Malaysia. |
| `cta.heading` | Watch your group's events arrive at basecamp | Rent the fleet for your next group | Theo dõi sự kiện của đoàn về tới trạm gốc | Thuê đội thiết bị cho đoàn tiếp theo |
| `cta.body` | The operations system shows every event the mesh syncs from the route. | The plans page lists the monthly and day plans. Register your organization there to request a contract. | Hệ thống vận hành hiển thị mọi sự kiện mạng lưới đồng bộ từ cung đường. | Trang gói thuê liệt kê gói tháng và gói ngày. Đăng ký tổ chức tại đó để yêu cầu hợp đồng. |
| `cta.primary` | Open the operations system | See rental plans | Mở hệ thống vận hành | Xem các gói thuê |
| `cta.secondary` | Compare the nodes again | How renting works | Xem lại các thiết bị | Quy trình thuê |
| `footer.tagline` | LoRa mesh safety and operations for multi-day trekking routes. | Off-grid communication and node rental for trekking agencies. | An toàn và vận hành qua mạng LoRa cho cung đường trekking nhiều ngày. | Liên lạc ngoài vùng phủ sóng và cho thuê thiết bị cho doanh nghiệp trekking. |
| `how.legend.station` | Basecamp station | Field Station | Trạm gốc | Field Station |
| `proof.iter.label` | hardware iterations in the field | hardware iterations | thế hệ phần cứng đã thử thực địa | thế hệ phần cứng |
| `page.home` | TrekLink: keep your trekking group in reach where the signal ends | TrekLink: off-grid communication and node rental for trekking agencies | TrekLink: giữ cả đoàn trekking trong tầm liên lạc nơi sóng điện thoại kết thúc | TrekLink: liên lạc ngoài vùng phủ sóng và cho thuê thiết bị cho doanh nghiệp trekking |

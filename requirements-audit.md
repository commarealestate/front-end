# Comma Real Estate - Requirements Audit

تاريخ المراجعة: 2026-06-03

## الملفات التي تمت مراجعتها

- `CRM & Website Issues + New Feature Request.pdf`
- `Single Property Page - Resale.pdf`
- `Single Property Page - Rental.pdf`
- `Single Property Page - OffPlan.pdf`
- `Agent Profile - Full Attributes Structure.pdf`
- `Agent Profile - Full Attributes Structure (1).pdf`

ملاحظة: ملفا `Agent Profile - Full Attributes Structure` لهما نفس المحتوى.

## ملخص تنفيذي

المشروع الحالي يحتوي على أساس جيد لصفحات العقارات والوكلاء والمشاريع، لكنه لا يطابق كامل المتطلبات في المستندات. أهم الفجوات:

- صفحة العقار تعرض بيانات عامة فقط ولا تفصل الحقول حسب `Resale / Rental / Off-plan`.
- لا يوجد Contact Form فعلي داخل صفحة العقار، الموجود روابط اتصال فقط.
- منطق الامتثال `ADGM / Guaranteed Badge / QR Code` ومعالجة الصور غير موجود.
- لوحة تحكم العقارات لا تحتوي أغلب الحقول المطلوبة في مستندات العقارات.
- الوكلاء لديهم مشكلة بنيوية في مصدر البيانات والحقول؛ الواجهة تعتمد على API خارجي مباشر في `store/agents.ts` بدلاً من `useApiFetch` ومسارات admin، كما أن CRUD غير موجود في الملف الفعلي.
- Projects module موجود، لكن ليس كـ Lead Generation Landing Page كما هو مطلوب؛ لا يوجد نموذج visible-first ولا ربط lead بالمشروع.
- Homepage لا يعرض Projects مباشرة بعد Hero كما هو مطلوب.
- يوجد خطر TypeScript واضح: `NormalizedProperty` مستخدم في عدة ملفات، لكنه غير مصدّر من `types/property.ts` حسب الملف الحالي.

## مقارنة المتطلبات مع الكود الحالي

### 1. مشاكل CRM والويب الحالية

#### Employee Creation Issue

المتطلب:
- إصلاح تعليق النظام عند إضافة موظف.
- إظهار رسائل خطأ واضحة.
- معالجة أخطاء API والـvalidation.

الوضع الحالي:
- لم أجد module واضح باسم employees.
- أقرب module هو agents/admin users، و`store/agents.ts` الحالي لا يحتوي `createAgent` أو `updateAgent` رغم أن `components/admin/agents/form.vue` يستدعيهما.

المطلوب:
- تحديد endpoint الموظفين/الوكلاء المعتمد.
- توحيد store مع API admin.
- إرجاع وعرض رسائل validation من الباكند.
- منع duplicate email برسالة واضحة.

#### Property Images Not Displaying In Control Panel

المتطلب:
- صور العقارات يجب أن تظهر في لوحة التحكم.

الوضع الحالي:
- `components/admin/properties/form.vue` يعرض `p.images`.
- صفحات العرض العامة تعتمد على `cover_image` و`property_photos`.
- يوجد عدم اتساق بين `images`, `property_photos`, `cover_image`.

المطلوب:
- توحيد أسماء الحقول في الـmapper.
- في لوحة التحكم استخدم الحقول المعتمدة من API: `cover_image`, `property_photos`, `floor_plan`.
- دعم preview وحذف ورفع صور منفصلة للـcover/gallery/floor plans.

#### Agent Profile Issues

المتطلب:
- عرض الاسم الكامل.
- status ليس Active فقط.
- كل الحقول يجب أن تحفظ عند التحديث، وليس فقط profession/city.
- الصورة يجب أن ترفع وتتحدث وتعود كـURL.

الوضع الحالي:
- `store/agents.ts` يقرأ من `https://myemirateshome.com/.../users` مباشرة.
- `components/admin/agents/form.vue` يستدعي `createAgent` و`updateAgent` لكنها غير موجودة في `store/agents.ts`.
- `Agent` type يحتوي حقول كثيرة، لكن لا يطابق وثيقة API النهائية بشكل نظيف.

المطلوب:
- بناء `agents` store كامل عبر `useApiFetch`:
  - `GET /agents`
  - `GET /agents/:id`
  - `POST /agents`
  - `PATCH /agents/:id`
  - `DELETE /agents/:id` إن كان مطلوباً
- إرسال كل الحقول المطلوبة في FormData.
- توحيد mapping:
  - `first_name`
  - `last_name`
  - `full_name` محسوب للعرض
  - `photo` أو `profile_image`
  - `position`
  - `departments`
  - `cre`
  - `joining_date`
  - `about`
  - `years_of_experience`
  - `properties_count`
  - `mobile`
  - `working_email`
  - `specialities`
  - `services`
  - `latest_educational_certificate_file`
  - `show_on_website`
  - `Broker_License_Dubai`
  - `Broker_License_Abu_Dhabi`
  - `hobbies`

#### Missing Dates / Activity Tracking

المتطلب:
- عرض created date, first contact date, last activity, last update.
- timeline: Lead Created, WhatsApp Sent, Call Made, Meeting Scheduled.

الوضع الحالي:
- بعض types تحتوي `created_at` و`updated_at`.
- لا يوجد activity timeline أو lead activity model.

المطلوب:
- إضافة API/Schema للـactivities:
  - `id`
  - `entity_type`: lead/property/project/agent
  - `entity_id`
  - `activity_type`
  - `occurred_at`
  - `notes`
  - `created_by`
- عرض timeline في CRM ولوحات التفاصيل ذات العلاقة.

#### Website Filter Issue - Apartments Not Showing

المتطلب:
- Apartments يجب أن تظهر في الموقع مثل باقي الأنواع.

الوضع الحالي:
- الفلتر يرسل `property_type=apartment`.
- مستندات/أمثلة API تستخدم قيم مثل `Villa`، وقد تكون المشكلة case/value mismatch مثل `Apartment` مقابل `apartment`.

المطلوب:
- توحيد قيم property type بين لوحة التحكم والباكند والويب.
- اعتماد normalization على الواجهة أو دعم case-insensitive في API.
- اختبار القيم:
  - `Apartment`
  - `apartment`
  - `Apartments`
- التأكد أن `inventory_status=Live` و`show_on_website` لا يحجبان الشقق.

#### Agent Page Structure - Levels & Sorting

المتطلب:
- Level 1: Higher Management
- Level 2: Management
- Level 3: Agents
- Sorting by CRE ID ASC أو Joining Date ASC.

الوضع الحالي:
- صفحة agents ترتب حسب priority/name/recent.
- لا يوجد level hierarchy واضح.

المطلوب:
- إضافة `level` أو `department_level`.
- عرض الوكلاء في ثلاث مجموعات.
- ترتيب داخل كل مجموعة:
  - `cre` تصاعدياً إذا موجود وصالح.
  - وإلا `joining_date` تصاعدياً.

## 2. صفحة العقار - Resale / Rental / Off-plan

### الموجود حالياً

صفحة التفاصيل `pages/properties/[id]-[slug].vue` تعرض:

- Hero image/title/reference.
- price, bedrooms, bathrooms, size, parking, build year.
- gallery من `coverImage` و`propertyPhotos`.
- description.
- address: location, city, community, project.
- details عامة مثل developer, offering type, project status, available from, payment method, service charge, down payment, furnished, finishing type.
- amenities.
- installments.
- views.
- agent contact links.

### الفجوات العامة لكل الأنواع

المطلوب لكل صفحة عقار:

- عرض attributes حسب نوع العقار فقط:
  - Resale
  - Rental
  - Off-plan
- بدون hardcoding، مع schema/config ديناميكي.
- Contact Form linked to Listing Agent.
- Compliance section conditional.
- Floor plans منفصلة عن gallery.
- حفظ original images ومعالجة processed images عند approval.

الوضع الحالي:
- لا يوجد تفريع واضح حسب نوع listing.
- لا يوجد form submission.
- floor plans غير معروضة كقسم مستقل.
- compliance غير معروض ولا مطبق.
- لا يوجد status workflow: `Preparation` -> `Approved`.

### Resale Requirements

الحقول المطلوبة:

- Basic: title, price, bedrooms, bathrooms, total size, view.
- Description rich text.
- Address: location, city, community, project.
- Media: cover image, gallery images, floor plans.
- Details: reference number, total/internal/external size, project start year, handover date, project status.
- Developer optional: name, brief.
- Payment: Cash, Cash/Mortgage.
- Amenities open list.
- Agent details.
- Contact form.
- Compliance conditional.

المطلوب في الكود:

- إضافة/تأكيد الحقول في `types/property.ts` والـnormalized mapper.
- عرض Resale فقط عندما `sale_type` أو `offering_type` يحدد sale/resale.
- إضافة `payment_plan_type` أو الاعتماد على `payment_method` إذا كان API معتمداً.

### Rental Requirements

الحقول المطلوبة:

- Rent price.
- Billing cycle: Yearly/Monthly.
- Number of cheques.
- Furnishing.
- Availability: Vacant/Rented/Available From.
- Contract duration: 6/12 months.
- Security deposit.
- Chiller included/not included.
- Min/max contract duration.
- Renewal terms.
- Notice period.
- Rental amenities مثل maintenance included وconcierge.

الموجود جزئياً:
- `rental_period`, `furnished`, `available_from`, `no_of_cheques`, `security_deposit`, `minimum_contract_duration`, `maximum_contract_duration`, `renewal_terms`, `notice_period`, `ac_type`.

المطلوب:
- استكمال عرض هذه الحقول في Rental layout.
- إضافة `billing_cycle`, `chiller`, `contract_duration`, `availability_status` إذا لم تكن موجودة في API.
- فصل قسم Payment & Lease.

### Off-plan Requirements

الحقول المطلوبة:

- Cover image required.
- Floor plans required.
- Developer required.
- Down payment percentage.
- Payment plan description.
- Payment schedule: installment %, frequency monthly/quarterly, duration.
- Project start year, handover date, project status.

الموجود جزئياً:
- `project_start_year`, `project_handover_date`, `developer_brief`, `down_payment_price`, `installments`.

المطلوب:
- جعل off-plan layout يقرأ schedule structured بدل `string[]` فقط إن أمكن:
  - `installments[].percentage`
  - `installments[].frequency`
  - `installments[].duration`
- إضافة validation في لوحة التحكم للـcover/floor plans/developer عندما النوع Off-plan.

## 3. Compliance & Image Processing

المتطلب النهائي:

- عند `Approved` فقط يتم تفعيل compliance mode.
- Abu Dhabi:
  - إذا `ADGM Number` أو `Guaranteed Badge` موجود، يتم تطبيق overlay.
  - إذا غير موجودين، لا يتم منع الموافقة.
- Dubai:
  - إذا QR Code موجود، يتم embed على الصور.
  - إذا غير موجود، لا يتم منع الموافقة.
- Floor plans لا يطبق عليها overlay أبداً.
- Original images تبقى كما هي.
- Processed images تستخدم للنشر/export فقط.
- لا يتم تغيير أسماء الحقول الحالية؛ الإضافات تكون incremental.

الوضع الحالي:

- `types/property.ts` يحتوي `qr_code_property_booster`, `adgm`, `rera`, `permit_number`.
- لا يوجد:
  - `guaranteed_badge`
  - `processed_cover_image`
  - `processed_property_photos`
  - `approval_status`
  - image processing trigger

المطلوب:

- Backend:
  - إضافة status workflow: `Preparation`, `Approved`.
  - إضافة job/service لمعالجة الصور عند الانتقال إلى Approved.
  - حفظ original وprocessed images منفصلين.
- Frontend:
  - لوحة التحكم تعرض original images.
  - الموقع يستخدم processed images إن وجدت، وإلا original.
  - عرض Compliance section فقط عند وجود البيانات.

## 4. Projects Module + Lead Capture

### الموجود حالياً

- `types/project.ts` يحتوي project, sections, gallery, details.
- `store/projects.ts` يحتوي public/admin CRUD.
- `pages/projects/index.vue` تعرض projects.
- `pages/projects/[id]-[slug].vue` تعرض hero ثم sections/gallery/details.
- `pages/admin/projects/*` تدعم basic info, sections, gallery, details.

### الفجوات مقابل المتطلب

المتطلب:
- Projects section مباشرة بعد Hero في الصفحة الرئيسية.
- كل مشروع Landing Page.
- Contact form ظاهر مباشرة في أول view.
- بعد ذلك المحتوى يكون scroll.
- Form fields: name, phone, email, message optional.
- Submission يحفظ lead في CRM ويربطه بـproject.
- status: Published/Draft.
- Upload 4-5 images.
- Description blog-style content.

الوضع الحالي:
- الصفحة الرئيسية تعرض `HeroSection`, `AboutSection`, `PropertiesSection`; لا يوجد Projects section بعد Hero.
- صفحة المشروع تبدأ بـHero ومحتوى، وليس contact form first.
- لا يوجد form في صفحة المشروع.
- لا يوجد lead submission مربوط بـproject_id.
- لا يوجد status Published/Draft في `Project` type أو admin form.

المطلوب:

- إضافة `ProjectLeadForm` في أول viewport من صفحة المشروع.
- عند submit:
  - `name`
  - `phone`
  - `email`
  - `message`
  - `project_id`
  - `project_title`
  - `source = Project Page`
  - `page_url`
  - `utm_*` من query params إن وجدت
- Backend endpoint مقترح:
  - `POST /project-leads` أو توسيع `contact-us` بحقول project/source.
- CRM admin:
  - عرض project leads منفصلة أو داخل contact messages مع filter by source/project.
- إضافة `status` للمشروع:
  - `Published`
  - `Draft`
- Public API يرجع published فقط.
- Homepage:
  - إضافة `ProjectsSection` بعد `HeroSection` مباشرة.

## 5. API Governance

المستند يؤكد:

- لا يتم تغيير أسماء الحقول الحالية.
- لا يتم تغيير معنى القيم الحالية.
- أي متطلبات جديدة تضاف كحقول جديدة فقط.
- يجب توثيق كل إضافة.

المطلوب:

- إنشاء API contract موحد للعقارات والوكلاء والمشاريع.
- إضافة mapper مركزي بدلاً من mapping متكرر ومختلف بين `store/properties.ts` و`composables/useProperties.ts`.
- تثبيت enum values:
  - `property_type`
  - `sale_type`
  - `offering_type`
  - `inventory_status`
  - `approval_status`
  - `project_status`

## 6. ملاحظات تقنية من الكود

- `types/property.ts` لا يصدّر `NormalizedProperty` رغم استخدامه في:
  - `store/properties.ts`
  - `pages/properties/index.vue`
  - `pages/properties/[id]-[slug].vue`
  - `components/PropertyCard.vue`
  - `components/PropertiesSection.vue`
- `store/agents.ts` لا يحتوي admin CRUD المستخدم في `components/admin/agents/form.vue`.
- توجد ملفات `copy` مثل:
  - `store/agents copy.ts`
  - `store/properties copy.ts`
  - `pages/properties/[id]-[slug] copy.vue`
  - `pages/properties/index copy.vue`
  يجب مراجعتها أو حذفها بعد التأكد، لأنها قد تحتوي implementation أقدم أو أفضل.
- هناك encoding issue ظاهر في بعض النصوص (`â€”`, `â†’`, وArabic mojibake في admin projects).

## 7. قائمة العمل المقترحة حسب الأولوية

### P0 - إصلاحات توقف العمل

- إصلاح `NormalizedProperty` type export أو إعادة تعريفه بشكل صحيح.
- إصلاح `store/agents.ts` ليطابق استخدام admin form:
  - `fetchAgents`
  - `fetchAgent`
  - `createAgent`
  - `updateAgent`
  - `deleteAgent` إن مطلوب
- توحيد مصدر agents وعدم استخدام external fetch مباشر في production store.
- إصلاح mapping الصور في لوحة تحكم العقارات.
- إصلاح apartment filter عبر توحيد values/case.

### P1 - صفحات العقارات حسب المستندات

- بناء schema ديناميكي حسب listing type.
- تحديث `types/property.ts` لإضافة الحقول الناقصة كإضافات فقط.
- تحديث admin property form ليشمل:
  - cover/gallery/floor plans
  - internal/external/total size
  - rental fields
  - off-plan payment schedule
  - compliance fields
  - approval status
- تحديث property detail page لعرض sections المطلوبة فقط حسب النوع.
- إضافة contact form مربوط بـlisting agent.

### P1 - Compliance

- Backend image processing عند Approved.
- تخزين original وprocessed images.
- Frontend يستخدم processed للعرض العام.
- استثناء floor plans دائماً.
- عدم منع approval بسبب missing compliance حسب القاعدة النهائية.

### P1 - Projects Lead Engine

- إضافة project status Published/Draft.
- إضافة Projects section بعد Hero في homepage.
- تعديل project page لتبدأ بـContact Form في first view.
- إضافة endpoint/CRM flow لحفظ project leads.
- حفظ source وproject_id وUTM params.

### P2 - Agents hierarchy and profile completeness

- إضافة level hierarchy.
- sorting حسب CRE ثم joining date.
- عرض جميع حقول profile المطلوبة.
- دعم rich text/line breaks في about.
- validation:
  - unique cre
  - working_email format
  - mobile format
  - years_of_experience numeric

### P2 - Activity tracking

- تصميم activity timeline.
- ربطه بالـleads والوكلاء والمشاريع.
- عرض first contact/last activity/last update في CRM.

## 8. Definition of Done

- كل نوع عقار يعرض فقط الحقول الخاصة به.
- لوحة التحكم تستطيع إنشاء وتحديث كل الحقول المطلوبة بدون فقدان بيانات بعد refresh.
- الصور تظهر في لوحة التحكم والموقع.
- compliance يطبق فقط عند توفر بياناته وبعد approval.
- contact forms تحفظ leads في CRM مع source وentity link.
- Projects landing pages جاهزة للحملات الإعلانية.
- Agents page تعرض hierarchy وتستخدم sorting المطلوب.
- لا توجد hardcoded field mappings خارج mapper موثق.
- TypeScript build يمر بدون أخطاء types.

(function () {
  const STORAGE_KEY = "yourteckLanguage";
  const DEFAULT_LANGUAGE = "ar";
  let isApplyingTranslations = false;

  const translations = {
    "YourTeck NFC": "يورتيك NFC",
    "YourTeck NFC Cards": "بطاقات يورتيك NFC",
    "YourTeck NFC Smart Card": "بطاقة يورتيك NFC الذكية",
    "NFC + QR smart profile cards": "بطاقات ملف ذكية بتقنية NFC و QR",
    "Your identity": "هويتك",
    "in one tap.": "بلمسة واحدة.",
    "Your identity in one tap.": "هويتك بلمسة واحدة.",
    "Premium NFC smart profile cards for creators, entrepreneurs, and modern professionals.": "بطاقات NFC ذكية وفاخرة للمبدعين ورواد الأعمال والمحترفين.",
    "How it works": "كيف تعمل",
    "Features": "المزايا",
    "Pricing": "الأسعار",
    "Login": "تسجيل الدخول",
    "Logout": "تسجيل الخروج",
    "Get Your Card": "اطلب بطاقتك",
    "View Demo": "عرض التجربة",
    "No app required": "لا يحتاج إلى تطبيق",
    "Edit anytime": "عدّل في أي وقت",
    "iPhone + Android ready": "جاهز للآيفون والأندرويد",
    "Tap-ready card": "بطاقة جاهزة للمس",
    "Save Contact": "حفظ جهة الاتصال",
    "Instagram": "إنستغرام",
    "Email": "البريد الإلكتروني",
    "Location": "الموقع",
    "1 tap": "لمسة واحدة",
    "to share everything": "لمشاركة كل شيء",
    "Networking without the awkward search.": "تواصل بدون بحث محرج.",
    "Tap the card, open the profile, and let people connect from the exact action they need.": "المس البطاقة، افتح الملف، واجعل الآخرين يتواصلون بالطريقة التي يحتاجونها فوراً.",
    "Tap": "لمسة",
    "Share": "شارك",
    "Connect": "تواصل",
    "Touch your NFC card to a phone or show your QR code when NFC is not available.": "المس بطاقة NFC بالهاتف أو اعرض رمز QR عند عدم توفر NFC.",
    "Your profile opens instantly with your contact details, links, socials, and custom theme.": "يفتح ملفك فوراً مع بيانات التواصل والروابط وحساباتك والتصميم الخاص بك.",
    "Visitors can save your contact, message you, follow you, or open your most important links.": "يمكن للزوار حفظ بياناتك أو مراسلتك أو متابعتك أو فتح أهم روابطك.",
    "Everything your first impression needs.": "كل ما تحتاجه لانطباع أول مميز.",
    "Made for real moments: meetings, events, stores, creator meetups, and sales conversations.": "مصمم للمواقف الحقيقية: الاجتماعات والفعاليات والمتاجر ولقاءات المبدعين ومحادثات البيع.",
    "Digital profile": "ملف رقمي",
    "Your contact details, links, and socials in one clean mobile page.": "بياناتك وروابطك وحساباتك في صفحة جوال أنيقة واحدة.",
    "Custom themes": "تصاميم مخصصة",
    "Choose a look that fits your identity and brand.": "اختر مظهراً يناسب هويتك وعلامتك.",
    "QR ready": "جاهز للـ QR",
    "Share from screens, cards, stickers, booths, or print.": "شارك من الشاشات أو البطاقات أو الملصقات أو المطبوعات.",
    "Let people add your name, phone, and email faster.": "اجعل الآخرين يضيفون اسمك ورقمك وبريدك بسرعة.",
    "Change your profile without reprinting your card.": "غيّر ملفك بدون إعادة طباعة البطاقة.",
    "Visitors open your profile directly in the browser.": "يفتح الزوار ملفك مباشرة في المتصفح.",
    "Turn a quick meeting into a saved contact.": "حوّل اللقاء السريع إلى جهة اتصال محفوظة.",
    "See Profiles": "عرض الملفات",
    "Saved from YourTeck profile": "محفوظ من ملف يورتيك",
    "Mobile": "الجوال",
    "Profile": "الملف",
    "Ready to save to contacts": "جاهز للحفظ في جهات الاتصال",
    "Live profile preview": "معاينة مباشرة للملف",
    "A profile that looks like you meant it.": "ملف يبدو احترافياً ومقصوداً.",
    "Your Name": "اسمك",
    "Founder, creator, consultant, or anyone worth remembering.": "مؤسس، مبدع، مستشار، أو أي شخص يستحق أن يُتذكر.",
    "My Number": "رقمي",
    "Socials": "الحسابات",
    "Portfolio": "الأعمال",
    "Live demo profiles": "نماذج ملفات مباشرة",
    "Different people. Different needs.": "أشخاص مختلفون واحتياجات مختلفة.",
    "Explore profile styles for creators, business owners, and minimal professional identities.": "استكشف أنماط ملفات للمبدعين وأصحاب الأعمال والهويات المهنية البسيطة.",
    "Creator": "مبدع",
    "For influencers, artists, and content creators.": "للمؤثرين والفنانين وصناع المحتوى.",
    "TikTok": "تيك توك",
    "Book a collab": "احجز تعاوناً",
    "View demo": "عرض التجربة",
    "Business": "الأعمال",
    "For stores, sales teams, and service brands.": "للمتاجر وفرق المبيعات والعلامات الخدمية.",
    "Website": "الموقع الإلكتروني",
    "Minimal": "بسيط",
    "For clean, direct professional networking.": "لتواصل مهني واضح ومباشر.",
    "LinkedIn": "لينكدإن",
    "Why YourTeck": "لماذا يورتيك",
    "Built for modern introductions.": "مصمم للتعارف الحديث.",
    "Stylish": "أنيق",
    "Premium dark UI with clean details that feel intentional.": "واجهة داكنة فاخرة بتفاصيل نظيفة ومدروسة.",
    "Fast": "سريع",
    "Open, scan, tap, and connect without slowing the moment down.": "افتح، امسح، المس، وتواصل بدون إبطاء اللحظة.",
    "Custom": "مخصص",
    "Change themes, profile blocks, icons, and your contact details.": "غيّر التصاميم والبلوكات والأيقونات وبيانات التواصل.",
    "NFC + QR": "NFC + QR",
    "Two ways to share, so your profile works in more situations.": "طريقتان للمشاركة ليعمل ملفك في مواقف أكثر.",
    "Mobile-first": "مصمم للجوال أولاً",
    "Designed for the phone screen where introductions actually happen.": "مصمم لشاشة الهاتف حيث يحدث التعارف فعلاً.",
    "Pricing preview": "لمحة عن السعر",
    "NFC card + 1 year included.": "بطاقة NFC + سنة واحدة مشمولة.",
    "Coming soon": "قريباً",
    "Simple launch pricing": "سعر إطلاق بسيط",
    "FAQ": "الأسئلة الشائعة",
    "Quick answers.": "إجابات سريعة.",
    "Works on iPhone and Android?": "هل يعمل على الآيفون والأندرويد؟",
    "Yes. NFC works on most modern phones, and every card can also be shared with a QR code.": "نعم. تعمل NFC على معظم الهواتف الحديثة، ويمكن مشاركة كل بطاقة أيضاً عبر رمز QR.",
    "Does the other person need an app?": "هل يحتاج الشخص الآخر إلى تطبيق؟",
    "No. Your profile opens in the browser, so visitors can connect without installing anything.": "لا. يفتح ملفك في المتصفح، لذلك يتواصل الزوار بدون تثبيت أي شيء.",
    "Can I edit later?": "هل يمكنني التعديل لاحقاً؟",
    "Yes. Update your name, bio, links, theme, QR, and contact details whenever you want.": "نعم. حدّث اسمك ونبذتك وروابطك وتصميمك ورمز QR وبياناتك متى شئت.",
    "What happens if I lose the card?": "ماذا يحدث إذا فقدت البطاقة؟",
    "Your profile stays online. You can keep using your QR link and replace the physical card when needed.": "يبقى ملفك متاحاً. يمكنك استخدام رابط QR واستبدال البطاقة عند الحاجة.",
    "Ready?": "جاهز؟",
    "Ready to make your first tap count?": "جاهز لتجعل أول لمسة لها أثر؟",
    "Explore Features": "استكشف المزايا",
    "Built for one-tap introductions.": "مصمم للتعارف بلمسة واحدة.",
    "NFC smart profile card": "بطاقة ملف ذكية بتقنية NFC",
    "One tap. Share your profile, contact details, socials, and business links instantly.": "لمسة واحدة. شارك ملفك وبياناتك وحساباتك وروابط عملك فوراً.",
    "Starting from 20 KD": "تبدأ من 20 د.ك",
    "Custom card design available on request.": "تصميم بطاقة مخصص متاح عند الطلب.",
    "YourTeck NFC card preview": "معاينة بطاقة يورتيك NFC",
    "Tap. Share. Connect.": "المس. شارك. تواصل.",
    "What is included": "ما الذي يشمله الطلب",
    "NFC smart card": "بطاقة NFC ذكية",
    "Custom digital profile": "ملف رقمي مخصص",
    "QR code backup": "رمز QR احتياطي",
    "Contact save option": "خيار حفظ جهة الاتصال",
    "Social links": "روابط التواصل",
    "Business links": "روابط الأعمال",
    "Profile editing dashboard": "لوحة تعديل الملف",
    "1 year free hosting/service": "استضافة/خدمة مجانية لمدة سنة",
    "Place an order": "إرسال طلب",
    "Full name": "الاسم الكامل",
    "Required": "مطلوب",
    "Phone number": "رقم الهاتف",
    "Kuwait delivery area": "منطقة التوصيل في الكويت",
    "Block": "القطعة",
    "Street": "الشارع",
    "Building / house number": "رقم المبنى / المنزل",
    "Floor / apartment number": "الطابق / رقم الشقة",
    "Delivery notes": "ملاحظات التوصيل",
    "Card design preference": "تفضيل تصميم البطاقة",
    "Default YourTeck design": "تصميم يورتيك الافتراضي",
    "Custom design": "تصميم مخصص",
    "Card notes": "ملاحظات البطاقة",
    "Place Order": "إرسال الطلب",
    "Placing...": "جارٍ الإرسال...",
    "Order request received. We will contact you soon.": "تم استلام طلبك. سنتواصل معك قريباً.",
    "Customer full name": "الاسم الكامل للعميل",
    "+965 0000 0000": "+965 0000 0000",
    "name@example.com": "name@example.com",
    "e.g. Salmiya": "مثال: السالمية",
    "e.g. Block 10": "مثال: قطعة 10",
    "e.g. Salem Al Mubarak Street": "مثال: شارع سالم المبارك",
    "e.g. Building 25 or House 8": "مثال: مبنى 25 أو منزل 8",
    "Optional, e.g. Floor 3, Apt 12": "اختياري، مثال: الطابق 3، شقة 12",
    "Optional, e.g. call before delivery or nearest landmark.": "اختياري، مثال: الاتصال قبل التوصيل أو أقرب معلم.",
    "Optional, tell us anything you want on the card or profile.": "اختياري، أخبرنا بأي شيء تريده على البطاقة أو الملف.",
    "Please enter the full name.": "يرجى إدخال الاسم الكامل.",
    "Please enter the phone number.": "يرجى إدخال رقم الهاتف.",
    "Please enter the email.": "يرجى إدخال البريد الإلكتروني.",
    "Please enter the Kuwait delivery area.": "يرجى إدخال منطقة التوصيل في الكويت.",
    "Please enter the block.": "يرجى إدخال القطعة.",
    "Please enter the street.": "يرجى إدخال الشارع.",
    "Please enter the building / house number.": "يرجى إدخال رقم المبنى / المنزل.",
    "Please enter a valid email address.": "يرجى إدخال بريد إلكتروني صحيح.",
    "Order could not be placed. Please try again.": "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
    "Profile Login": "تسجيل الدخول إلى الملف",
    "Access your profile": "ادخل إلى ملفك",
    "Authentication mode": "طريقة الدخول",
    "Create account": "إنشاء حساب",
    "Password": "كلمة المرور",
    "Email address": "البريد الإلكتروني",
    "Forgot password?": "نسيت كلمة المرور؟",
    "Confirm password": "تأكيد كلمة المرور",
    "Enter your account email. If it exists, we will send a secure password reset link.": "أدخل بريد حسابك. إذا كان موجوداً، سنرسل رابط إعادة تعيين آمن.",
    "Enter the 6-digit code sent to your email.": "أدخل رمز التحقق المكون من 6 أرقام المرسل إلى بريدك.",
    "Verification code": "رمز التحقق",
    "6-digit code": "رمز من 6 أرقام",
    "Back": "رجوع",
    "Resend code": "إعادة إرسال الرمز",
    "or": "أو",
    "Use Google to sign up or log in. New users go to profile setup.": "استخدم Google للتسجيل أو الدخول. المستخدمون الجدد ينتقلون لإعداد الملف.",
    "New here?": "جديد هنا؟",
    "Create an account": "أنشئ حساباً",
    "Already have an account?": "لديك حساب؟",
    "Log in": "تسجيل الدخول",
    "Need a different email?": "تحتاج بريداً مختلفاً؟",
    "Edit signup details": "تعديل بيانات التسجيل",
    "Remembered it?": "تذكرتها؟",
    "Back to login": "العودة لتسجيل الدخول",
    "Reset Password": "إعادة تعيين كلمة المرور",
    "Choose a new password": "اختر كلمة مرور جديدة",
    "New password": "كلمة مرور جديدة",
    "Confirm new password": "تأكيد كلمة المرور الجديدة",
    "Reset password": "إعادة تعيين كلمة المرور",
    "Need a new link?": "تحتاج رابطاً جديداً؟",
    "Go back to login": "العودة إلى تسجيل الدخول",
    "Your password was reset. You can log in with your new password now.": "تمت إعادة تعيين كلمة المرور. يمكنك تسجيل الدخول بكلمة المرور الجديدة الآن.",
    "Admin Panel": "لوحة الإدارة",
    "+ Add User": "+ إضافة مستخدم",
    "Admin sections": "أقسام الإدارة",
    "Users": "المستخدمون",
    "Orders": "الطلبات",
    "Search users by email, username, or phone": "ابحث عن المستخدمين بالبريد أو الاسم أو الهاتف",
    "Change Password": "تغيير كلمة المرور",
    "Delete User": "حذف المستخدم",
    "Are you sure you want to logout?": "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    "No": "لا",
    "Yes": "نعم",
    "Reset user profile?": "إعادة ضبط ملف المستخدم؟",
    "Cancel": "إلغاء",
    "Reset profile": "إعادة ضبط الملف",
    "Add user": "إضافة مستخدم",
    "User email": "بريد المستخدم",
    "Temporary password": "كلمة مرور مؤقتة",
    "Save": "حفظ",
    "No users found.": "لا يوجد مستخدمون.",
    "No orders yet.": "لا توجد طلبات بعد.",
    "No reference": "بدون مرجع",
    "Unnamed order": "طلب بدون اسم",
    "Reference": "المرجع",
    "Area": "المنطقة",
    "Building / house": "المبنى / المنزل",
    "Floor / apartment": "الطابق / الشقة",
    "Address summary": "ملخص العنوان",
    "Design": "التصميم",
    "Status": "الحالة",
    "Placed": "تاريخ الطلب",
    "Pending": "قيد الانتظار",
    "Underprocess": "قيد المعالجة",
    "Delivered": "تم التسليم",
    "Displayed name": "الاسم المعروض",
    "Mobile number": "رقم الجوال",
    "Reset profile setup": "إعادة إعداد الملف",
    "Build your profile": "أنشئ ملفك",
    "Create a polished NFC identity in a few quick steps.": "أنشئ هوية NFC أنيقة في خطوات بسيطة.",
    "Profile setup steps": "خطوات إعداد الملف",
    "Identity": "الهوية",
    "Theme": "التصميم",
    "Contact": "التواصل",
    "Start with your identity": "ابدأ بهويتك",
    "Your profile link is already reserved. Add the name and bio people should see.": "رابط ملفك محجوز بالفعل. أضف الاسم والنبذة التي سيشاهدها الآخرون.",
    "Profile link": "رابط الملف",
    "Display name": "الاسم المعروض",
    "Title / role": "المسمى / الدور",
    "Choose a first impression": "اختر الانطباع الأول",
    "Pick a profile theme and accent. You can change this later from Settings.": "اختر تصميم الملف ولون التمييز. يمكنك تغييره لاحقاً من الإعدادات.",
    "Theme Style": "نمط التصميم",
    "Preset Themes": "تصاميم جاهزة",
    "Accent Color": "لون التمييز",
    "Custom accent color": "لون تمييز مخصص",
    "Add starter blocks": "أضف وسائل التواصل الأساسية",
    "Add one or a few ways people can reach you. Each block appears instantly in the live preview.": "أضف طريقة أو أكثر ليتواصل الناس معك. يظهر كل عنصر فوراً في المعاينة.",
    "Contact value": "قيمة التواصل",
    "Country code": "رمز الدولة",
    "Phone number, WhatsApp number, or email": "رقم الهاتف أو واتساب أو البريد",
    "Display label, e.g. My Number": "اسم العرض، مثال: رقمي",
    "Continue": "متابعة",
    "Your first contact block will appear here.": "سيظهر أول عنصر تواصل هنا.",
    "Remove": "إزالة",
    "Preview": "معاينة",
    "Edit": "تعديل",
    "Settings": "الإعدادات",
    "Loading...": "جارٍ التحميل...",
    "Add Block": "إضافة عنصر",
    "Add Avatar": "إضافة صورة",
    "Add Bio": "إضافة نبذة",
    "Change Photo": "تغيير الصورة",
    "Remove Photo": "إزالة الصورة",
    "Tap your name or bio to edit": "اضغط على اسمك أو نبذتك للتعديل",
    "Profile Progress": "تقدم الملف",
    "Profile QR": "رمز QR للملف",
    "Old password + new password": "كلمة المرور الحالية + الجديدة",
    "Use your current password to confirm the change immediately.": "استخدم كلمة المرور الحالية لتأكيد التغيير فوراً.",
    "Email verification code": "رمز تحقق بالبريد الإلكتروني",
    "Send a 6-digit code to your account email, then set a new password.": "أرسل رمزاً من 6 أرقام إلى بريد حسابك، ثم عيّن كلمة مرور جديدة.",
    "Add to Profile": "إضافة إلى الملف",
    "Paste value or link": "الصق القيمة أو الرابط",
    "Label": "التسمية",
    "Appearance": "المظهر",
    "Choose how this profile looks for you and public visitors.": "اختر كيف يظهر هذا الملف لك وللزوار.",
    "Profile preview": "معاينة الملف",
    "QR unavailable": "رمز QR غير متاح",
    "Close": "إغلاق",
    "Change password": "تغيير كلمة المرور",
    "Old password": "كلمة المرور الحالية",
    "Change": "تغيير",
    "Code will be sent to": "سيتم إرسال الرمز إلى",
    "Verify": "تحقق",
    "New password unlocks after the verification code is correct.": "سيتم تفعيل كلمة المرور الجديدة بعد صحة رمز التحقق.",
    "Resend": "إعادة إرسال",
    "Add link": "إضافة رابط",
    "Name": "الاسم",
    "URL": "الرابط"
  };

  const gulfArabicOverrides = {
    "Premium NFC smart profile cards for creators, entrepreneurs, and modern professionals.": "بطاقات NFC فاخرة مع ملف قابل للتعديل، مناسبة لأصحاب الأعمال والمبدعين وكل شخص يقابل عملاءه على أرض الواقع.",
    "How it works": "طريقة الاستخدام",
    "Features": "المزايا",
    "Pricing": "العرض",
    "Login": "الدخول",
    "Logout": "تسجيل الخروج",
    "Get Your Card": "اطلب بطاقتك",
    "See Demo Profile": "شاهد نموذج الملف",
    "Start with YourTeck": "ابدأ مع يورتيك",
    "Use cases": "لمن تناسب؟",
    "Smart NFC cards for real-world networking": "بطاقات NFC ذكية للتعارف والعمل اليومي",
    "Stop handing out cards": "بدل الكروت اللي تنتهي في الدرج",
    "people forget.": "خلّ معلوماتك جاهزة فوراً.",
    "Stop handing out cards people forget.": "بدل الكروت اللي تنتهي في الدرج، خلّ معلوماتك جاهزة فوراً.",
    "YourTeck gives you a premium NFC card and a live profile you can update anytime. Tap once and let people save your number, open your links, or scan the QR when NFC is not the right moment.": "يورتيك يعطيك بطاقة NFC أنيقة وملف مباشر تقدر تعدّله بأي وقت. بلمسة واحدة يقدر الشخص يحفظ رقمك، يفتح روابطك، أو يمسح رمز QR إذا كان المسح أسهل.",
    "Launch offer includes setup": "عرض الإطلاق يشمل الإعداد",
    "Editable after printing": "تعدّل بياناتك بعد الطباعة",
    "Works with QR fallback": "يدعم QR كخيار إضافي",
    "Tap-ready card": "بطاقة جاهزة للمشاركة",
    "Real estate agent sharing listings, WhatsApp, and contact details.": "وكيل عقاري يشارك العقارات، الواتساب، وبيانات التواصل.",
    "1 card": "بطاقة واحدة",
    "that stays updated": "تتحدث معك",
    "Share the right details in under a minute.": "شارك البيانات الصح خلال أقل من دقيقة.",
    "No more spelling your Instagram username in loud events or waiting while someone types your number wrong.": "بدل ما تشرح حسابك في زحمة أو تنتظر أحد يكتب رقمك غلط، خلّ البطاقة تختصر الموضوع.",
    "Hand over the card": "قرّب البطاقة",
    "Use NFC when the phone supports it. Use the QR code when scanning is easier.": "استخدم NFC مع الهواتف الداعمة، أو خلّ الشخص يمسح QR إذا كان هذا أنسب للموقف.",
    "They choose the action": "الشخص يختار اللي يحتاجه",
    "Call, WhatsApp, Instagram, website, location, booking link, or save contact.": "اتصال، واتساب، إنستغرام، موقع، لوكيشن، حجز موعد، أو حفظ جهة الاتصال.",
    "You update it later": "وأنت تعدّل لاحقاً",
    "Change your links anytime without reprinting the card or wasting old stock.": "غيّر روابطك ومعلوماتك بأي وقت بدون إعادة طباعة أو تضييع كروت قديمة.",
    "Who it is for": "لمن تناسب؟",
    "Useful when people meet you offline first.": "مفيدة لكل شخص يقابل عملاءه أو جمهوره وجهاً لوجه.",
    "Different jobs need different actions. YourTeck keeps the card simple and lets the profile do the work.": "كل مجال يحتاج روابط مختلفة. البطاقة تبقى بسيطة، والملف يعطي الناس كل الخيارات المهمة.",
    "Sales people": "فرق المبيعات",
    "Share phone, WhatsApp, email, and a product deck after a quick conversation.": "شارك رقمك، واتساب، البريد، وعرض المنتج بعد محادثة سريعة.",
    "Creators": "صنّاع المحتوى",
    "Send people to Instagram, TikTok, YouTube, bookings, and collaboration links.": "وجّه الناس إلى إنستغرام، تيك توك، يوتيوب، الحجوزات، وروابط التعاون.",
    "Real estate agents": "العقاريون",
    "Put listings, map location, WhatsApp, and saved contact in one clean profile.": "اجمع العقارات، اللوكيشن، الواتساب، وحفظ جهة الاتصال في ملف مرتب.",
    "Gym coaches": "مدربو الجيم",
    "Share packages, transformation photos, booking links, and direct messaging.": "اعرض الباقات، النتائج، رابط الحجز، وطريقة التواصل المباشر.",
    "Salons and barbers": "الصالونات والحلاقين",
    "Send clients to prices, booking, location, Instagram, and WhatsApp.": "خلّ العميل يشوف الأسعار، الحجز، اللوكيشن، إنستغرام، والواتساب بسرعة.",
    "Small business owners": "أصحاب المشاريع الصغيرة",
    "Turn walk-ins, events, and deliveries into repeat customers with one link hub.": "حوّل الزيارات والمعارض والتوصيل إلى عملاء يرجعون لك من رابط واحد.",
    "Students": "الطلاب",
    "Share LinkedIn, portfolio, CV, projects, and email at career fairs.": "شارك لينكدإن، الأعمال، السيرة الذاتية، المشاريع، والبريد في المعارض المهنية.",
    "Freelancers": "المستقلون",
    "Show work samples, pricing, contact details, and payment or booking links.": "اعرض نماذج أعمالك، الأسعار، بيانات التواصل، وروابط الدفع أو الحجز.",
    "Why it is better": "ليش أفضل من الكرت العادي؟",
    "Paper cards stop working the moment your details change.": "الكرت الورقي يضعف أول ما تتغير معلوماتك.",
    "A printed card can look nice, but it cannot save a contact, open a booking link, or update itself.": "الكرت المطبوع ممكن يكون جميل، لكنه ما يحفظ رقمك، ما يفتح رابط حجز، وما يتحدث بعد الطباعة.",
    "Normal business card": "كرت عمل عادي",
    "Can be lost, damaged, or thrown away after the meeting.": "ينفقد، يتلف، أو ينحط على جنب بعد اللقاء.",
    "YourTeck NFC card": "بطاقة يورتيك NFC",
    "Gives people a live profile they can reopen from the link or QR.": "تعطي الشخص ملف مباشر يقدر يرجع له من الرابط أو QR.",
    "Outdated details": "معلومات تنتهي بسرعة",
    "New phone number, new role, or new link means another print run.": "رقم جديد أو رابط جديد يعني طباعة جديدة.",
    "Update your contact details, links, photo, and theme from your profile.": "عدّل رقمك، روابطك، صورتك، وألوان ملفك من لوحة التحكم.",
    "No clickable actions": "بدون أزرار مباشرة",
    "People still need to type your number, search your handle, or copy a URL.": "الشخص يكتب الرقم، يبحث عن الحساب، أو ينسخ الرابط يدوياً.",
    "Built for action": "مصممة للتصرف السريع",
    "Let visitors save your number instantly, message you, or open your links.": "خلّ الزائر يحفظ رقمك فوراً، يراسلك، أو يفتح روابطك مباشرة.",
    "One static design": "تصميم ثابت فقط",
    "Great for a logo, weak for changing offers, campaigns, and services.": "ممتاز للشعار، لكنه ضعيف للعروض والخدمات اللي تتغير.",
    "NFC plus QR fallback": "NFC مع QR احتياطي",
    "Use the card in person and the QR on booths, packaging, or printed material.": "استخدم البطاقة وجهاً لوجه، وQR للمعارض، التغليف، أو المطبوعات.",
    "Product preview": "معاينة المنتج",
    "The card feels premium. The profile does the selling.": "البطاقة تعطي انطباع فاخر، والملف يكمّل البيع.",
    "Use a clean profile for the details people actually ask for: your number, socials, booking links, location, portfolio, and contact export.": "استخدم ملفاً واضحاً للبيانات التي يسأل عنها الناس فعلاً: رقمك، حساباتك، روابط الحجز، اللوكيشن، أعمالك، وحفظ جهة الاتصال.",
    "Noura Khalid": "نورة الخالد",
    "Salon owner sharing bookings, location, Instagram, and direct contact.": "صاحبة صالون تشارك الحجز، اللوكيشن، إنستغرام، والتواصل المباشر.",
    "What is included": "ماذا يشمل العرض؟",
    "Everything you need to start using it on day one.": "كل ما تحتاجه لتبدأ من أول يوم.",
    "The launch package is made to feel complete, not like a half-finished beta.": "باقة الإطلاق مجهزة كمنتج كامل، مو تجربة ناقصة.",
    "Physical card": "بطاقة فعلية",
    "A premium card connected to your YourTeck profile.": "بطاقة أنيقة مربوطة بملفك في يورتيك.",
    "Setup support": "مساعدة في الإعداد",
    "We help you start with the right name, links, profile photo, and contact details.": "نساعدك تضبط الاسم، الروابط، الصورة، وبيانات التواصل بشكل مرتب.",
    "1 year profile access": "سنة دخول للملف",
    "Your live profile stays online with editing access during the included year.": "ملفك يبقى شغال أونلاين مع إمكانية التعديل خلال السنة المشمولة.",
    "QR fallback": "QR احتياطي",
    "Use the same profile when NFC is not available or when you want to print a code.": "استخدم نفس الملف إذا لم تتوفر NFC أو إذا احتجت تطبع الرمز.",
    "Save contact button": "زر حفظ جهة الاتصال",
    "Let people add your phone and email quickly instead of typing everything by hand.": "خلّ الناس يحفظون رقمك وبريدك بسرعة بدل الكتابة اليدوية.",
    "Profile editing": "تعديل الملف",
    "Change links, socials, bio, theme, and details when your business changes.": "غيّر الروابط، الحسابات، النبذة، الألوان، والبيانات متى ما تغيّر عملك.",
    "Launch offer": "عرض الإطلاق",
    "NFC card + setup + 1 year profile access.": "بطاقة NFC + إعداد + سنة وصول للملف.",
    "Start with a complete package: the physical card, your live profile, QR fallback, and help setting up the details people need most.": "ابدأ بباقة كاملة: البطاقة، الملف المباشر، QR احتياطي، ومساعدة في ترتيب أهم البيانات.",
    "Premium YourTeck NFC card": "بطاقة يورتيك NFC فاخرة",
    "Profile setup with your links and contact details": "إعداد الملف مع روابطك وبيانات التواصل",
    "1 year of editable profile access included": "سنة وصول وتعديل على الملف مشمولة",
    "Available for early customers": "متاح للعملاء الأوائل",
    "Quick answers.": "إجابات مختصرة.",
    "Works on iPhone and Android?": "هل تعمل مع الآيفون والأندرويد؟",
    "Yes. NFC works on most modern phones. The QR fallback is there for phones, booths, print, and situations where scanning is easier.": "نعم. NFC تعمل مع أغلب الهواتف الحديثة، وQR موجود للحالات التي يكون فيها المسح أسهل.",
    "Does the other person need an app?": "هل يحتاج الطرف الآخر إلى تطبيق؟",
    "No. The profile opens in the browser, so the other person can view your details without installing anything.": "لا. الملف يفتح في المتصفح مباشرة بدون تحميل أي تطبيق.",
    "Can I change my links later?": "هل أقدر أغيّر الروابط لاحقاً؟",
    "Yes. Update your phone, bio, socials, website, location, theme, and other links without printing a new card.": "نعم. عدّل رقمك، النبذة، الحسابات، الموقع، اللوكيشن، والألوان بدون طباعة بطاقة جديدة.",
    "What happens if I lose the card?": "ماذا لو ضاعت البطاقة؟",
    "Your profile stays online. You can keep using your profile link or QR while arranging a replacement card.": "ملفك يبقى أونلاين. تقدر تستخدم الرابط أو QR إلى أن تطلب بطاقة بديلة.",
    "Can I use it for my business?": "هل تناسب مشروعي؟",
    "Yes. It works well for service businesses, sales teams, creators, real estate agents, coaches, salons, and freelancers.": "نعم. تناسب المشاريع الخدمية، المبيعات، صناع المحتوى، العقاريين، المدربين، الصالونات، والمستقلين.",
    "What should I put on my profile?": "ما الذي أضعه في ملفي؟",
    "Start with your phone, WhatsApp, Instagram or LinkedIn, location or booking link, and one clear action you want people to take.": "ابدأ برقمك، واتساب، إنستغرام أو لينكدإن، اللوكيشن أو رابط الحجز، وزر واضح تريد من الناس استخدامه.",
    "Get a card people can actually use after they meet you.": "اطلب بطاقة يقدر الناس يستخدمونها فعلاً بعد ما يقابلونك.",
    "Premium cards with editable digital profiles.": "بطاقات فاخرة مع ملفات رقمية قابلة للتعديل.",
    "Main navigation": "التنقل الرئيسي",
    "YourTeck NFC home": "الصفحة الرئيسية ليورتيك NFC",
    "Product highlights": "أبرز المزايا",
    "YourTeck NFC card and profile preview": "بطاقة يورتيك NFC ومعاينة الملف",
    "Card page navigation": "التنقل في صفحة البطاقة",
    "Loading profile": "تحميل الملف",
    "NFC Profile": "ملف NFC",
    "Profile Setup": "إعداد الملف",
    "Mohamed Ali": "محمد علي",
    "Profile Login": "الدخول إلى ملفك",
    "Access your profile": "ادخل وعدّل بياناتك",
    "Authentication mode": "اختر طريقة الدخول",
    "Create account": "إنشاء حساب",
    "Create an account": "أنشئ حساباً",
    "Use Google to sign up or log in. New users go to profile setup.": "استخدم Google للدخول أو إنشاء حساب. الحسابات الجديدة تنتقل مباشرة لإعداد الملف.",
    "Use Google to sign up instantly, no extra form needed.": "استخدم Google لإنشاء الحساب مباشرة بدون تعبئة نموذج إضافي.",
    "Enter your account email. If it exists, we will send a secure password reset link.": "اكتب بريد حسابك، وإذا كان مسجلاً سنرسل لك رابطاً آمناً لإعادة تعيين كلمة المرور.",
    "Enter the 6-digit code sent to your email.": "اكتب رمز التحقق المرسل إلى بريدك والمكون من 6 أرقام.",
    "Checking...": "جاري التحقق...",
    "Send reset link": "إرسال رابط إعادة التعيين",
    "Verify email": "تحقق من البريد",
    "If an account exists, we sent a reset link.": "إذا كان الحساب موجوداً، أرسلنا رابط إعادة التعيين.",
    "Reset link could not be sent.": "تعذر إرسال رابط إعادة التعيين.",
    "We sent a 6-digit code to": "أرسلنا رمز تحقق من 6 أرقام إلى",
    "It expires in 10 minutes.": "تنتهي صلاحيته خلال 10 دقائق.",
    "Resend in": "إعادة الإرسال خلال",
    "Request failed": "تعذر تنفيذ الطلب.",
    "Unexpected server response": "استجابة غير متوقعة من الخادم.",
    "Enter your email and password.": "اكتب بريدك وكلمة المرور.",
    "Login failed. Try again.": "تعذر تسجيل الدخول. حاول مرة أخرى.",
    "Enter a valid email address.": "اكتب بريداً إلكترونياً صحيحاً.",
    "Passwords do not match.": "كلمتا المرور غير متطابقتين.",
    "Enter your signup details again.": "أعد إدخال بيانات التسجيل.",
    "Enter the 6-digit code.": "اكتب رمز التحقق المكون من 6 أرقام.",
    "Account could not be created.": "تعذر إنشاء الحساب.",
    "Code could not be resent.": "تعذر إعادة إرسال الرمز.",
    "Verification failed.": "فشل التحقق.",
    "Reset link is missing. Please request a new one.": "رابط إعادة التعيين غير موجود. اطلب رابطاً جديداً.",
    "Enter and confirm your new password.": "اكتب كلمة المرور الجديدة وأكدها.",
    "Password could not be reset.": "تعذر إعادة تعيين كلمة المرور.",
    "Build your profile": "جهّز ملفك",
    "Create a polished NFC identity in a few quick steps.": "جهّز ملف يورتيك أنيق خلال خطوات بسيطة.",
    "Start with your identity": "ابدأ ببياناتك الأساسية",
    "Your profile link is already reserved. Add the name and bio people should see.": "رابط ملفك محجوز. أضف الاسم والنبذة التي تريد أن يراها الناس.",
    "Choose a first impression": "اختر شكل ملفك",
    "Pick a profile theme and accent. You can change this later from Settings.": "اختر الثيم ولون التمييز. تقدر تغيّرها لاحقاً من الإعدادات.",
    "Add starter blocks": "أضف أول وسائل التواصل",
    "Add one or a few ways people can reach you. Each block appears instantly in the live preview.": "أضف طريقة أو أكثر للتواصل معك. كل عنصر يظهر فوراً في المعاينة.",
    "Your first contact block will appear here.": "سيظهر أول عنصر تواصل هنا.",
    "Add a valid contact value first.": "أضف وسيلة تواصل صحيحة أولاً.",
    "Add a display name to continue.": "أضف الاسم المعروض للمتابعة.",
    "Add your phone number to finish setup.": "أضف رقم هاتفك لإكمال الإعداد.",
    "Setup could not be saved. Try again.": "تعذر حفظ الإعداد. حاول مرة أخرى.",
    "Preview": "معاينة",
    "Edit": "تعديل",
    "Settings": "الإعدادات",
    "Add Block": "إضافة عنصر",
    "Add Avatar": "إضافة صورة",
    "Add Bio": "إضافة نبذة",
    "Change Photo": "تغيير الصورة",
    "Remove Photo": "إزالة الصورة",
    "Tap your name or bio to edit": "اضغط على اسمك أو نبذتك للتعديل",
    "Profile Progress": "اكتمال الملف",
    "Use <strong>Profile Progress</strong> to finish the important details that make your profile feel ready to share.": "استخدم <strong>اكتمال الملف</strong> لإضافة التفاصيل المهمة قبل مشاركة بطاقتك.",
    "<strong>Save Contact</strong> exports your name, phone, and email so visitors can add you to their phone quickly.": "زر <strong>حفظ جهة الاتصال</strong> يجهّز اسمك ورقمك وبريدك ليحفظها الزائر بسرعة.",
    "Add to Profile": "إضافة إلى الملف",
    "Choose what you want to add. Paste a number, username, email, or link and I will format it for you.": "اختر ما تريد إضافته، ثم الصق رقماً أو حساباً أو بريداً أو رابطاً وسنرتبه لك.",
    "Paste value or link": "الصق الرقم أو الحساب أو الرابط",
    "Choose a type, then paste a number, username, email, or link.": "اختر النوع، ثم الصق الرقم أو الحساب أو البريد أو الرابط.",
    "Appearance": "المظهر",
    "Choose how this profile looks for you and public visitors.": "اختر شكل ملفك كما يظهر لك وللزوار.",
    "Theme Style": "نمط الثيم",
    "Preset Themes": "ثيمات جاهزة",
    "Accent Color": "لون التمييز",
    "Dark": "داكن",
    "Light": "فاتح",
    "Midnight": "منتصف الليل",
    "Midnight Light": "منتصف الليل الفاتح",
    "Ocean": "المحيط",
    "Ocean Light": "المحيط الفاتح",
    "Purple": "بنفسجي",
    "Purple Light": "بنفسجي فاتح",
    "Gold": "ذهبي",
    "Gold Light": "ذهبي فاتح",
    "Forest": "غابة",
    "Forest Light": "غابة فاتحة",
    "Minimal White": "أبيض بسيط",
    "Rose": "وردي",
    "Rose Light": "وردي فاتح",
    "Neon": "نيون",
    "Neon Light": "نيون فاتح",
    "Aurora": "شفق",
    "Aurora Light": "شفق فاتح",
    "Galaxy": "مجرة",
    "Galaxy Light": "مجرة فاتحة",
    "Sunset": "غروب",
    "Sunset Light": "غروب فاتح",
    "Candy": "كاندي",
    "Candy Light": "كاندي فاتح",
    "Fire": "ناري",
    "Fire Light": "ناري فاتح",
    "Ice": "ثلجي",
    "Ice Light": "ثلجي فاتح",
    "Blue": "أزرق",
    "Green": "أخضر",
    "Red": "أحمر",
    "Pink": "وردي",
    "Profile preview": "معاينة الملف",
    "QR unavailable": "رمز QR غير متاح",
    "Change password": "تغيير كلمة المرور",
    "Old password": "كلمة المرور الحالية",
    "New password": "كلمة مرور جديدة",
    "Code will be sent to": "سيتم إرسال الرمز إلى",
    "Verification code": "رمز التحقق",
    "Verify": "تحقق",
    "New password unlocks after the verification code is correct.": "ستتمكن من كتابة كلمة المرور الجديدة بعد التحقق من الرمز.",
    "Resend": "إعادة الإرسال",
    "Are you sure you want to logout?": "هل تريد تسجيل الخروج؟",
    "Yes": "نعم",
    "No": "لا",
    "Add link": "إضافة رابط",
    "Name": "الاسم",
    "URL": "الرابط",
    "Please choose an image file.": "اختر ملف صورة.",
    "Image is too large. Please use an image under 800 KB.": "الصورة كبيرة. استخدم صورة أقل من 800 كيلوبايت.",
    "Icon ready. Press Save to apply it.": "الأيقونة جاهزة. اضغط حفظ لتطبيقها.",
    "This image could not be loaded.": "تعذر تحميل هذه الصورة.",
    "This image could not be processed.": "تعذرت معالجة هذه الصورة.",
    "Could not process image.": "تعذرت معالجة الصورة.",
    "Theme saved": "تم حفظ المظهر",
    "Edit bio": "تعديل النبذة",
    "Edit name": "تعديل الاسم",
    "Enter both old and new password.": "اكتب كلمة المرور الحالية والجديدة.",
    "Password changed": "تم تغيير كلمة المرور",
    "No email is connected to this account.": "لا يوجد بريد مرتبط بهذا الحساب.",
    "Enter the 6-digit verification code.": "اكتب رمز التحقق المكون من 6 أرقام.",
    "Code verified. Enter your new password.": "تم التحقق من الرمز. اكتب كلمة المرور الجديدة.",
    "Verify the code first.": "تحقق من الرمز أولاً.",
    "Enter a new password.": "اكتب كلمة مرور جديدة.",
    "Upload": "رفع",
    "Reset": "إعادة ضبط",
    "Icon": "الأيقونة",
    "Close": "إغلاق",
    "Cancel": "إلغاء",
    "Save": "حفظ",
    "Change": "تغيير",
    "Add": "إضافة",
    "+ Add": "+ إضافة",
    "＋ Add": "＋ إضافة",
    "Place an order": "اطلب بطاقتك",
    "Place Order": "إرسال الطلب",
    "Starting from 20 KD": "تبدأ من 20 د.ك",
    "One tap. Share your profile, contact details, socials, and business links instantly.": "بلمسة واحدة شارك ملفك، بيانات التواصل، حساباتك، وروابط عملك.",
    "Custom card design available on request.": "يتوفر تصميم مخصص للبطاقة عند الطلب.",
    "Tap. Share. Connect.": "قرّب البطاقة. شارك بياناتك. خلّهم يتواصلون.",
    "NFC smart profile card": "بطاقة NFC ذكية لملفك",
    "NFC smart card": "بطاقة NFC ذكية",
    "Custom digital profile": "ملف رقمي مخصص",
    "QR code backup": "رمز QR احتياطي",
    "Contact save option": "زر حفظ جهة الاتصال",
    "Social links": "روابط الحسابات",
    "Business links": "روابط العمل",
    "Profile editing dashboard": "لوحة تعديل الملف",
    "1 year free hosting/service": "سنة خدمة واستضافة مشمولة",
    "Required": "مطلوب",
    "Kuwait delivery area": "منطقة التوصيل داخل الكويت",
    "Card design preference": "تفضيل تصميم البطاقة",
    "Default YourTeck design": "تصميم يورتيك الافتراضي",
    "Custom design": "تصميم مخصص",
    "Card notes": "ملاحظات البطاقة",
    "Placing...": "جاري إرسال الطلب...",
    "Order request received. We will contact you soon.": "تم استلام طلبك. سنتواصل معك قريباً.",
    "Please enter the full name.": "اكتب الاسم الكامل.",
    "Please enter the phone number.": "اكتب رقم الهاتف.",
    "Please enter the email.": "اكتب البريد الإلكتروني.",
    "Please enter the Kuwait delivery area.": "اكتب منطقة التوصيل داخل الكويت.",
    "Please enter the block.": "اكتب القطعة.",
    "Please enter the street.": "اكتب الشارع.",
    "Please enter the building / house number.": "اكتب رقم المبنى أو المنزل.",
    "Please enter a valid email address.": "اكتب بريداً إلكترونياً صحيحاً.",
    "Order could not be placed. Please try again.": "تعذر إرسال الطلب. حاول مرة أخرى.",
    "Resetting...": "جاري إعادة الضبط...",
    "Profile could not be reset. Try again.": "تعذرت إعادة ضبط الملف. حاول مرة أخرى."
  };

  Object.assign(translations, gulfArabicOverrides);

  const normalizeTranslationKey = (value) => String(value || "").trim().replace(/\s+/g, " ");
  const normalizedTranslations = Object.fromEntries(
    Object.entries(translations).map(([english, arabic]) => [normalizeTranslationKey(english), arabic])
  );
  const reverseTranslations = Object.fromEntries(
    Object.entries(translations).map(([english, arabic]) => [arabic, english])
  );
  const normalizedReverseTranslations = Object.fromEntries(
    Object.entries(translations).map(([english, arabic]) => [normalizeTranslationKey(arabic), english])
  );

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "ar" ? saved : DEFAULT_LANGUAGE;
  }

  function translateValue(value, language) {
    const clean = String(value || "").trim();
    if (!clean) return value;
    const normalized = normalizeTranslationKey(clean);
    if (language === "ar") return translations[clean] || normalizedTranslations[normalized] || value;
    return reverseTranslations[clean] || normalizedReverseTranslations[normalized] || value;
  }

  function translateTextNode(node, language) {
    const value = node.nodeValue;
    const clean = value.trim();
    if (!clean) return;
    const translated = translateValue(clean, language);
    if (translated !== clean) {
      node.nodeValue = value.replace(clean, translated);
    }
  }

  function translateElementAttributes(element, language) {
    ["placeholder", "title", "aria-label", "alt"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      const translated = translateValue(current, language);
      if (translated !== current) element.setAttribute(attribute, translated);
    });
  }

  function translatePage(language = getLanguage()) {
    isApplyingTranslations = true;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = translateValue(document.title, language);
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      const currentDescription = description.getAttribute("content");
      description.setAttribute("content", translateValue(currentDescription, language));
    }
    document.body?.classList.toggle("is-arabic", language === "ar");
    document.body?.classList.toggle("is-english", language === "en");

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, language));
    document.querySelectorAll("[placeholder], [title], [aria-label], img[alt]").forEach((element) => {
      translateElementAttributes(element, language);
    });
    updateToggle(language);
    window.requestAnimationFrame(() => {
      isApplyingTranslations = false;
    });
  }

  function injectStyles() {
    if (document.getElementById("yourteckLanguageStyles")) return;
    const style = document.createElement("style");
    style.id = "yourteckLanguageStyles";
    style.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&display=swap");

      .yt-language-toggle {
        align-items: center;
        appearance: none;
        backdrop-filter: blur(18px);
        background: rgba(17, 17, 20, 0.88);
        border: 1px solid rgba(20, 184, 154, 0.24);
        border-radius: 999px;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.07);
        color: #eafff8;
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        font: 800 13px/1 "Alexandria", "IBM Plex Sans Arabic", "Cairo", "Tajawal", Arial, sans-serif;
        gap: 7px;
        height: 38px;
        justify-content: center;
        min-height: 38px;
        max-width: max-content;
        min-width: 0;
        padding: 0 13px;
        position: fixed;
        inset-block-start: 16px;
        inset-inline-end: 16px;
        transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        width: auto !important;
        z-index: 5000;
      }

      button.yt-language-toggle,
      #yourteckLanguageToggle {
        display: inline-flex !important;
        height: 38px !important;
        max-width: max-content !important;
        min-width: 0 !important;
        position: fixed !important;
        width: auto !important;
      }

      .yt-language-toggle:hover {
        background: rgba(20, 184, 154, 0.14);
        border-color: rgba(20, 184, 154, 0.46);
        box-shadow: 0 16px 38px rgba(0, 0, 0, 0.34), 0 0 24px rgba(20, 184, 154, 0.12);
        transform: translateY(-1px);
      }

      .yt-language-toggle-icon {
        align-items: center;
        background: rgba(20, 184, 154, 0.14);
        border: 1px solid rgba(20, 184, 154, 0.22);
        border-radius: 50%;
        display: inline-flex;
        height: 23px;
        justify-content: center;
        width: 23px;
      }

      html[dir="rtl"] body {
        direction: rtl;
        font-family: "Alexandria", "IBM Plex Sans Arabic", "Cairo", "Tajawal", Arial, sans-serif !important;
        letter-spacing: 0;
        line-height: 1.75;
        text-align: right;
      }

      html[dir="rtl"] input,
      html[dir="rtl"] textarea,
      html[dir="rtl"] select {
        font-family: "Alexandria", "IBM Plex Sans Arabic", "Cairo", "Tajawal", Arial, sans-serif !important;
        text-align: right;
      }

      html[dir="rtl"] h1,
      html[dir="rtl"] h2,
      html[dir="rtl"] h3,
      html[dir="rtl"] h4,
      html[dir="rtl"] .admin-title,
      html[dir="rtl"] .modal-title,
      html[dir="rtl"] .section-title {
        letter-spacing: 0;
        line-height: 1.2;
      }

      html[dir="rtl"] p,
      html[dir="rtl"] .subtitle,
      html[dir="rtl"] .section-copy,
      html[dir="rtl"] .hero-copy,
      html[dir="rtl"] .tile p,
      html[dir="rtl"] details p,
      html[dir="rtl"] .smart-add-subtitle,
      html[dir="rtl"] .password-dialog-copy {
        line-height: 1.85;
      }

      html[dir="rtl"] .brand,
      html[dir="rtl"] .login-card,
      html[dir="rtl"] .reset-card,
      html[dir="rtl"] .auth-switch-copy,
      html[dir="rtl"] .google-note,
      html[dir="rtl"] .admin-header,
      html[dir="rtl"] .admin-list,
      html[dir="rtl"] .container,
      html[dir="rtl"] #profileHeader {
        text-align: center;
      }

      html[dir="rtl"] .nav,
      html[dir="rtl"] .hero,
      html[dir="rtl"] .content-grid,
      html[dir="rtl"] .field-grid,
      html[dir="rtl"] .setup-shell,
      html[dir="rtl"] .admin-user-row,
      html[dir="rtl"] .admin-detail-item {
        direction: rtl;
      }

      html[dir="rtl"] .hero-copy,
      html[dir="rtl"] .section-copy,
      html[dir="rtl"] label,
      html[dir="rtl"] .field,
      html[dir="rtl"] .forgot-password-row,
      html[dir="rtl"] .error,
      html[dir="rtl"] .message,
      html[dir="rtl"] .secondary-link,
      html[dir="rtl"] .admin-search,
      html[dir="rtl"] .admin-detail-grid {
        text-align: right;
      }

      html[dir="rtl"] .nav-links,
      html[dir="rtl"] .hero-actions,
      html[dir="rtl"] .price-line,
      html[dir="rtl"] .label-title {
        flex-direction: row;
      }

      html[dir="rtl"] .hero-actions,
      html[dir="rtl"] .price-line {
        justify-content: flex-start;
      }

      html[dir="rtl"] .section-head {
        margin-inline-start: 0;
        margin-inline-end: auto;
        text-align: right;
      }

      html[dir="rtl"] .section-head p {
        margin-inline-start: 0;
        margin-inline-end: 0;
      }

      html[dir="rtl"] .profile-link,
      html[dir="rtl"] .link-main,
      html[dir="rtl"] .settings-action,
      html[dir="rtl"] .smart-add-option,
      html[dir="rtl"] .admin-user-summary,
      html[dir="rtl"] .contact-row,
      html[dir="rtl"] .demo-mini-row {
        text-align: right;
      }

      html[dir="rtl"] .landing-shell,
      html[dir="rtl"] .setup-shell,
      html[dir="rtl"] .login-shell,
      html[dir="rtl"] .reset-shell,
      html[dir="rtl"] .card-page,
      html[dir="rtl"] .container {
        word-spacing: 0.03em;
      }

      html[dir="rtl"] .tile,
      html[dir="rtl"] details,
      html[dir="rtl"] .pricing-card,
      html[dir="rtl"] .preview-showcase,
      html[dir="rtl"] .comparison-table,
      html[dir="rtl"] .login-card,
      html[dir="rtl"] .setup-card,
      html[dir="rtl"] .modal-card {
        background-color: color-mix(in srgb, #16181d, transparent 8%);
      }

      html[dir="rtl"] .nav-brand,
      html[dir="rtl"] .profile-link,
      html[dir="rtl"] .link-main,
      html[dir="rtl"] .settings-action,
      html[dir="rtl"] .admin-user-row,
      html[dir="rtl"] .form-actions,
      html[dir="rtl"] .password-code-row,
      html[dir="rtl"] .phone-input-group {
        direction: rtl;
      }

      @media (max-width: 560px) {
        .yt-language-toggle {
          border-radius: 999px;
          gap: 0;
          height: 38px;
          inset-block-start: 10px;
          inset-inline-end: 10px;
          min-height: 38px;
          padding: 0;
          width: 38px !important;
        }

        button.yt-language-toggle,
        #yourteckLanguageToggle {
          max-width: 38px !important;
          min-width: 38px !important;
          width: 38px !important;
        }

        .yt-language-toggle > span:not(.yt-language-toggle-icon) {
          display: none;
        }

        .yt-language-toggle-icon {
          border: 0;
          height: 100%;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createToggle() {
    if (document.getElementById("yourteckLanguageToggle")) return;
    const button = document.createElement("button");
    button.id = "yourteckLanguageToggle";
    button.className = "yt-language-toggle";
    button.type = "button";
    button.addEventListener("click", () => {
      const nextLanguage = getLanguage() === "ar" ? "en" : "ar";
      localStorage.setItem(STORAGE_KEY, nextLanguage);
      translatePage(nextLanguage);
    });
    document.body.appendChild(button);
  }

  function updateToggle(language) {
    const button = document.getElementById("yourteckLanguageToggle");
    if (!button) return;
    const target = language === "ar" ? "English" : "العربية";
    button.setAttribute("aria-label", language === "ar" ? "Switch to English" : "التبديل إلى العربية");
    button.innerHTML = `<span class="yt-language-toggle-icon" aria-hidden="true">ع</span><span>${target}</span>`;
  }

  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      if (isApplyingTranslations) return;
      if (mutations.some((mutation) =>
        mutation.type === "characterData" ||
        mutation.type === "attributes" ||
        [...mutation.addedNodes].some((node) => node.id !== "yourteckLanguageToggle")
      )) {
        window.requestAnimationFrame(() => translatePage(getLanguage()));
      }
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label", "alt"],
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  window.YourTeckTranslatePage = translatePage;

  document.addEventListener("DOMContentLoaded", () => {
    injectStyles();
    createToggle();
    translatePage(getLanguage());
    observeChanges();
  });
})();

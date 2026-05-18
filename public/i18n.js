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
    "Different people. Same one-tap magic.": "أشخاص مختلفون. نفس سحر اللمسة الواحدة.",
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

  const reverseTranslations = Object.fromEntries(
    Object.entries(translations).map(([english, arabic]) => [arabic, english])
  );

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "ar" ? saved : DEFAULT_LANGUAGE;
  }

  function translateValue(value, language) {
    const clean = String(value || "").trim();
    if (!clean) return value;
    if (language === "ar") return translations[clean] || value;
    return reverseTranslations[clean] || value;
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
      .yt-language-toggle {
        align-items: center;
        backdrop-filter: blur(18px);
        background: rgba(8, 10, 10, 0.82);
        border: 1px solid rgba(20, 184, 154, 0.24);
        border-radius: 999px;
        box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.07);
        color: #eafff8;
        cursor: pointer;
        display: inline-flex;
        font: 800 13px/1 Arial, sans-serif;
        gap: 7px;
        min-height: 38px;
        padding: 0 13px;
        position: fixed;
        inset-block-start: 16px;
        inset-inline-end: 16px;
        transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        z-index: 5000;
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
        text-align: right;
      }

      html[dir="rtl"] input,
      html[dir="rtl"] textarea {
        text-align: right;
      }

      html[dir="rtl"] .brand,
      html[dir="rtl"] .login-card,
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
      html[dir="rtl"] .admin-search,
      html[dir="rtl"] .admin-detail-grid {
        text-align: right;
      }

      html[dir="rtl"] .nav-links,
      html[dir="rtl"] .hero-actions,
      html[dir="rtl"] .price-line,
      html[dir="rtl"] .label-title {
        flex-direction: row-reverse;
      }

      @media (max-width: 560px) {
        .yt-language-toggle {
          inset-block-start: 10px;
          inset-inline-end: 10px;
          min-height: 34px;
          padding: 0 10px;
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
    button.innerHTML = `<span class="yt-language-toggle-icon" aria-hidden="true">文</span><span>${target}</span>`;
  }

  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      if (isApplyingTranslations) return;
      if (mutations.some((mutation) => [...mutation.addedNodes].some((node) => node.id !== "yourteckLanguageToggle"))) {
        window.requestAnimationFrame(() => translatePage(getLanguage()));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectStyles();
    createToggle();
    translatePage(getLanguage());
    observeChanges();
  });
})();

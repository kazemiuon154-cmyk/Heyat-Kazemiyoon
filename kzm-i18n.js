/* kzm-i18n.js — ترجمه‌ی عربی/انگلیسی متن‌های فارسیِ ثابت و پویا (تطبیق دقیق متن)
   فقط وقتی زبان فارسی نیست کار می‌کند؛ با بازگشت به فارسی متن اصلی را برمی‌گرداند.
   متن‌های داخل عناصر دارای data-no-i18n و کادرهای ورودی دست‌نخورده می‌مانند. */
(function(){
  'use strict';
  if(window.__kzmI18n) return; window.__kzmI18n = 1;
  var D = {
    /* --- مشترک: هدر و منوها --- */
    'منوی تنظیمات تم':['قائمة السمة','Theme settings menu'],'منوی تنظیمات':['قائمة الإعدادات','Settings menu'],
    'تغییر تم':['تغيير السمة','Change theme'],'انتخاب زبان':['اختيار اللغة','Choose language'],
    'قطع/وصل صدا':['كتم/تشغيل الصوت','Mute / unmute sound'],'نصب برنامه':['تثبيت التطبيق','Install app'],
    'بازگشت به صفحه اول':['العودة إلى الصفحة الأولى','Back to home page'],'بازگشت به صفحه ورود (انتخاب بخش)':['العودة إلى صفحة الدخول (اختيار القسم)','Back to entry page (choose a section)'],
    'صفحه ورود':['صفحة الدخول','Entry page'],'راهنمای سایت':['دليل الموقع','Site guide'],'بستن':['إغلاق','Close'],
    'ناوبری اصلی':['التنقل الرئيسي','Main navigation'],'خانه':['الرئيسية','Home'],'کاظمیون':['كاظميون','Kazemiyoon'],'مسجد قائم':['مسجد القائم','Masjid Qa’im'],'سایر':['أخرى','More'],'تنظیمات':['الإعدادات','Settings'],
    'جستجو در صفحات سایت...':['ابحث في صفحات الموقع...','Search site pages...'],'پاک کردن جستجو':['مسح البحث','Clear search'],
    'ساعت تهران':['ساعة طهران','Tehran time'],'تاریخ شمسی':['التاريخ الشمسي','Solar Hijri date'],'اذان ظهر':['أذان الظهر','Dhuhr adhan'],
    'هیئت کاظمیون خرم‌آباد':['هيئة كاظميون خرم‌آباد','Heyat-e Kazemiyoon Khorramabad'],
    /* --- تبدیل تاریخ --- */
    'شمسی':['شمسي','Solar Hijri'],'میلادی':['ميلادي','Gregorian'],'قمری':['قمري','Lunar Hijri'],'روز':['اليوم','Day'],'ماه':['الشهر','Month'],'سال':['السنة','Year'],
    'تبدیل کن':['حوّل','Convert'],'امروز':['اليوم','Today'],
    'کپی تاریخ شمسی':['نسخ التاريخ الشمسي','Copy Solar Hijri date'],'کپی تاریخ میلادی':['نسخ التاريخ الميلادي','Copy Gregorian date'],'کپی تاریخ قمری':['نسخ التاريخ القمري','Copy Lunar Hijri date'],
    'تاریخ قمری این روز از تقویم رسمی کشور است.':['التاريخ القمري لهذا اليوم مأخوذ من التقويم الرسمي للبلاد.','The lunar date of this day is from the country’s official calendar.'],
    'تاریخ قمری برای سال ۱۴۰۵ از تقویم رسمی کشور است؛ برای بقیه‌ی سال‌ها محاسبه‌ی جدولی است و ممکنه یک یا دو روز با اعلام رسمی فرق داشته باشه.':['التاريخ القمري لسنة 1405 مأخوذ من التقويم الرسمي للبلاد؛ وللسنوات الأخرى هو حساب جدولي وقد يختلف يوماً أو يومين عن الإعلان الرسمي.','The lunar date for 1405 is from the country’s official calendar; for other years it is a tabular calculation and may differ by a day or two from the official announcement.'],
    'تاریخ قمری این روز (خارج از ۱۴۰۵) محاسبه‌ی جدولی است و ممکنه بسته به رؤیت هلال، یک یا دو روز با اعلام رسمی فرق داشته باشه.':['التاريخ القمري لهذا اليوم (خارج 1405) حساب جدولي وقد يختلف يوماً أو يومين عن الإعلان الرسمي بحسب رؤية الهلال.','The lunar date of this day (outside 1405) is a tabular calculation and, depending on moon sighting, may differ by a day or two from the official announcement.'],
    'لطفاً سال، ماه و روز رو کامل انتخاب کن':['يرجى اختيار السنة والشهر واليوم كاملةً','Please select the year, month and day completely'],
    'تاریخ کپی شد':['تم نسخ التاريخ','Date copied'],'شماره کارت کپی شد':['تم نسخ رقم البطاقة','Card number copied'],
    /* --- فریم‌ساز --- */
    'هر عکسی داری — خودت، جمع دوستان، مراسم، یا حتی یه منظره — آپلود کن، قاب اختصاصی هیئت کاظمیون روش بذار و برای استوری یا پست اینستاگرام دانلود کن.':['أي صورة لديك — أنت أو جمع الأصدقاء أو المراسم أو حتى منظر طبيعي — ارفعها وضع عليها إطار هيئة كاظميون الخاص ونزّلها لقصة أو منشور إنستغرام.','Any photo you have — yourself, friends, a gathering, or even a landscape — upload it, add the Kazemiyoon Heyat’s special frame, and download it for an Instagram story or post.'],
    'عکس رو بکش اینجا یا لمس کن':['اسحب الصورة إلى هنا أو المسها','Drag the photo here or tap'],
    'JPG یا PNG — فقط روی همین گوشی پردازش می‌شه':['JPG أو PNG — تُعالَج على هذا الهاتف فقط','JPG or PNG — processed only on this phone'],
    'تعویض عکس':['تغيير الصورة','Change photo'],'رنگ قاب':['لون الإطار','Frame color'],
    'طلایی و زمردی':['ذهبي وزمردي','Gold & emerald'],'مشکی و طلایی':['أسود وذهبي','Black & gold'],'سرخ عاشورایی':['أحمر عاشورائي','Ashura crimson'],'سرمه‌ای سلطنتی':['كحلي ملكي','Royal navy'],'نقره‌ای متین':['فضي رصين','Elegant silver'],'زمرد شب':['زمرد الليل','Night emerald'],
    'نشان هیئت':['شعار الهيئة','Heyat emblem'],'با لوگو':['مع الشعار','With logo'],'بدون لوگو':['بدون شعار','No logo'],
    'نوع فریم':['نوع الإطار','Frame type'],'ساده':['بسيط','Simple'],'جشن':['احتفال','Celebration'],'عزاداری':['عزاء','Mourning'],'رسمی و سنتی':['رسمي وتقليدي','Formal & traditional'],
    'قالب خروجی':['قالب الإخراج','Output format'],'استوری (9:16)':['قصة (9:16)','Story (9:16)'],'پست مربعی (1:1)':['منشور مربع (1:1)','Square post (1:1)'],
    'چیدمان عکس':['تموضع الصورة','Photo layout'],'پر کردن قاب':['ملء الإطار','Fill the frame'],'نمایش کامل عکس':['عرض الصورة كاملة','Show full photo'],
    'متن روی قاب':['النص على الإطار','Text on frame'],'بدون متن':['بدون نص','No text'],'یادگار هیئت کاظمیون خرم‌آباد':['تذكار هيئة كاظميون خرم‌آباد','A keepsake of Heyat-e Kazemiyoon Khorramabad'],
    'محرم ۱۴۴۷':['محرم 1447','Muharram 1447'],'یا حسین (ع)':['يا حسين (ع)','Ya Husayn (a)'],'ایام سوگواری سالار شهیدان':['أيام العزاء على سيد الشهداء','Days of mourning for the Master of Martyrs'],'شور و عزای حسینی':['شجن العزاء الحسيني','Husayni passion and mourning'],
    'متن دلخواه':['نص مخصص','Custom text'],'متن دلخواه رو بنویس...':['اكتب النص الذي تريده...','Write your custom text...'],'دانلود عکس':['تنزيل الصورة','Download photo'],
    'عکست هیچ‌وقت از گوشیت خارج نمی‌شه؛ همه‌چیز همین‌جا توی مرورگر ساخته می‌شه. اگه عکست عمودی نیست، «نمایش کامل عکس» رو انتخاب کن تا چیزی از عکس بریده نشه.':['صورتك لا تغادر هاتفك أبداً؛ كل شيء يُصنع هنا داخل المتصفح. وإن لم تكن صورتك عمودية فاختر «عرض الصورة كاملة» كي لا يُقصّ شيء منها.','Your photo never leaves your phone; everything is made right here in the browser. If your photo isn’t vertical, choose “Show full photo” so nothing gets cropped.'],
    'عکس دانلود شد ✨':['تم تنزيل الصورة ✨','Photo downloaded ✨'],'عکس خونده نشد؛ دوباره امتحان کن':['تعذّرت قراءة الصورة؛ حاول مرة أخرى','Couldn’t read the photo; try again'],
    'لطفاً یه فایل عکس انتخاب کن':['يرجى اختيار ملف صورة','Please choose an image file'],'اول یه عکس انتخاب کن':['اختر صورة أولاً','Choose a photo first'],
    'دانلود ناموفق بود؛ صفحه رو رفرش کن و دوباره امتحان کن':['فشل التنزيل؛ حدّث الصفحة وحاول مجدداً','Download failed; refresh the page and try again'],
    /* --- اوقات شرعی --- */
    'تهران':['طهران','Tehran'],'قم':['قم','Qom'],'مشهد':['مشهد','Mashhad'],'کربلا':['كربلاء','Karbala'],'نجف':['النجف','Najaf'],'خرم‌آباد':['خرم‌آباد','Khorramabad'],'(تهران، ایران)':['(طهران، إيران)','(Tehran, Iran)'],
    /* --- ذکر روز / صلوات‌شمار --- */
    'ذکر روز':['ذكر اليوم','Dhikr of the day'],'یکی کم کن':['أنقص واحداً','Subtract one'],'با هر ضربه روی دایره، یک ذکر ثبت می‌شود':['مع كل نقرة على الدائرة يُسجَّل ذكر واحد','Each tap on the circle records one dhikr'],'شروع دوباره':['البدء من جديد','Start over'],
    'ثبت یک ذکر':['تسجيل ذكر','Record a dhikr'],'شمارش صلوات':['عدّ الصلوات','Salawat count'],'افزودن یک شمارش':['إضافة عدّة','Add one count'],'تغییر اندازه دور':['تغيير حجم الدائرة','Resize the ring'],
    'شنبه':['السبت','Saturday'],'یکشنبه':['الأحد','Sunday'],'یک‌شنبه':['الأحد','Sunday'],'دوشنبه':['الاثنين','Monday'],'سه‌شنبه':['الثلاثاء','Tuesday'],'چهارشنبه':['الأربعاء','Wednesday'],'پنجشنبه':['الخميس','Thursday'],'پنج‌شنبه':['الخميس','Thursday'],'جمعه':['الجمعة','Friday'],
    'ای پروردگار جهانیان':['يا ربّ العالمين','O Lord of the worlds'],'ای صاحبِ جلال و بزرگواری':['يا صاحب الجلال والإكرام','O Possessor of majesty and honor'],'ای برآورندهٔ حاجت‌ها':['يا قاضي الحاجات','O Fulfiller of needs'],'ای مهربان‌ترینِ مهربانان':['يا أرحم الراحمين','O Most Merciful of the merciful'],'ای زنده، ای پاینده':['يا حيّ يا قيّوم','O Ever-Living, O Self-Sustaining'],'هیچ معبودی جز خدای پادشاهِ حق و آشکار نیست':['لا إله إلا الله الملك الحق المبين','There is no god but God, the True and Manifest King'],'خدایا بر محمد و خاندان محمد درود فرست':['اللهم صلِّ على محمد وآل محمد','O God, send blessings upon Muhammad and the family of Muhammad'],
    'شمارشگر ذکر از نو شروع شد':['بدأ عدّاد الذكر من جديد','The dhikr counter has been restarted'],'شمارش بازنشانی شد':['أُعيد ضبط العدّ','Count reset'],'ذکر امروز شما کامل شد؛ خدا قبول کند 🌙':['اكتمل ذكرك اليوم؛ تقبّل الله 🌙','Today’s dhikr is complete; may God accept it 🌙'],
    /* --- صفحه‌ی مطالعه (page2) --- */
    'تم مطالعه':['سمة القراءة','Reading theme'],'تنظیم فونت و اندازه متن':['ضبط الخط وحجم النص','Font and text size'],'حالت تمام‌صفحه':['ملء الشاشة','Fullscreen'],'روشن ماندن صفحه':['إبقاء الشاشة مضاءة','Keep screen on'],'برگشت به اول متن':['العودة إلى بداية النص','Back to top of text'],'کندتر':['أبطأ','Slower'],'تندتر':['أسرع','Faster'],'شروع اسکرول خودکار':['بدء التمرير التلقائي','Start auto-scroll'],'تکرار خودکار از اول':['التكرار التلقائي من البداية','Auto-repeat from start'],'پخش / توقف صوت':['تشغيل / إيقاف الصوت','Play / pause audio'],'کوچک‌تر':['أصغر','Smaller'],'بزرگ‌تر':['أكبر','Larger'],'پیش‌فرض':['افتراضي','Default'],'حالت شب':['الوضع الليلي','Night mode'],'حالت روشن':['الوضع الفاتح','Light mode'],'حالت کرمی':['الوضع الكريمي','Cream mode'],
    /* --- کاظمیون --- */
    'بازگشت به بالا':['العودة إلى الأعلى','Back to top'],'دعا و معنویات':['الدعاء والمعنويات','Supplications & spirituality'],'نقشه موقعیت مسجد حضرت قائم (عج)':['خريطة موقع مسجد الحجة القائم (عج)','Map of Masjid Hazrat Qa’im (aj)'],'وضعیت و برنامه مراسم':['حالة المراسم وبرنامجها','Event status and schedule'],
    'کوچک‌تر کردن متن':['تصغير النص','Decrease text size'],'بزرگ‌تر کردن متن':['تكبير النص','Increase text size'],'مرکز دانلود سایت':['مركز تنزيل الموقع','Site download center'],'دانلود زیارت عاشورا':['تنزيل زيارة عاشوراء','Download Ziyarat Ashura'],'دانلود نشان هیئت کاظمیون خرم‌آباد':['تنزيل شعار هيئة كاظميون خرم‌آباد','Download the Kazemiyoon Khorramabad Heyat emblem'],
    'بزرگ‌نمایی QR Code':['تكبير رمز QR','Enlarge QR code'],'بزرگ‌نمایی QR':['تكبير رمز QR','Enlarge QR'],'جستجوی بخش‌های سایت':['البحث في أقسام الموقع','Search site sections'],'مشاهده جزئیات اعلان ویژه':['عرض تفاصيل الإعلان الخاص','View special announcement details'],'جزئیات اعلان ویژه':['تفاصيل الإعلان الخاص','Special announcement details'],
    'ماه قبل':['الشهر السابق','Previous month'],'ماه بعد':['الشهر التالي','Next month'],'انتخاب ماه و سال':['اختيار الشهر والسنة','Choose month and year'],'جزئیات رویداد روز':['تفاصيل حدث اليوم','Day event details'],'سال قبل':['السنة السابقة','Previous year'],'سال بعد':['السنة التالية','Next year'],'نمای سالانه':['العرض السنوي','Yearly view'],'کپی آیدی':['نسخ المعرّف','Copy ID'],'گزینه‌های اشتراک‌گذاری':['خيارات المشاركة','Share options'],'پیش‌نمایش کارت':['معاينة البطاقة','Card preview'],'هفته‌ی قبل':['الأسبوع السابق','Previous week'],'هفته‌ی بعد':['الأسبوع التالي','Next week'],'کپی لینک صفحه':['نسخ رابط الصفحة','Copy page link'],'کپی شماره کارت':['نسخ رقم البطاقة','Copy card number'],
    'منوی تنظیمات: صدا، زبان، تم، مرکز دانلود و راهنمای سایت':['قائمة الإعدادات: الصوت واللغة والسمة ومركز التنزيل ودليل الموقع','Settings menu: sound, language, theme, download center and site guide'],
    'مرکز دانلود سایت؛ زیارت‌نامه‌ها و نشان هیئت':['مركز تنزيل الموقع؛ الزيارات وشعار الهيئة','Site download center; ziyarat texts and the Heyat emblem'],
    'ساعت به وقت تهران؛ برای نمایش ثانیه و ساعت کربلا ضربه بزنید':['الساعة بتوقيت طهران؛ انقر لإظهار الثواني وساعة كربلاء','Time in Tehran; tap to show seconds and Karbala time'],
    'نماز بعدی به وقت خرم‌آباد؛ برای نمایش تهران، مشهد، قم، نجف و کربلا ضربه بزنید':['الصلاة القادمة بتوقيت خرم‌آباد؛ انقر لإظهار طهران ومشهد وقم والنجف وكربلاء','Next prayer in Khorramabad time; tap to show Tehran, Mashhad, Qom, Najaf and Karbala'],
    'وضعیت آب و هوا؛ برای نمایش خرم‌آباد، کربلا و نجف ضربه بزنید':['حالة الطقس؛ انقر لإظهار خرم‌آباد وكربلاء والنجف','Weather; tap to show Khorramabad, Karbala and Najaf'],
    'تقویم امروز؛ برای نمایش تاریخ قمری، میلادی و غیبت ضربه بزنید':['تقويم اليوم؛ انقر لإظهار التاريخ القمري والميلادي والغيبة','Today’s calendar; tap to show the lunar and Gregorian dates and occultation'],
    'امام سجاد (ع)':['الإمام السجاد (ع)','Imam Sajjad (a)'],'حدیث روز':['حديث اليوم','Hadith of the day'],
    'خداوند دل‌هاى حزين را دوست دارد.':['إن الله يحب كل قلب حزين.','God loves every sorrowful heart.'],'الکافی، جلد ۲، صفحه ۹۹، حدیث ۳۰':['الكافي، ج 2، ص 99، ح 30','Al-Kafi, vol. 2, p. 99, hadith 30'],
    /* --- راهنمای صفحه‌ی ورود / اعلان‌ها --- */
    'تا Dhuhr':['حتى الظهر','until Dhuhr']
  };
  var MON_J = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
  var MON_J_L = [['فروردين','أرديبهشت','خرداد','تير','مرداد','شهريور','مهر','آبان','آذر','دي','بهمن','إسفند'],['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar','Mehr','Aban','Azar','Dey','Bahman','Esfand']];
  var MON_G = ['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
  var MON_G_L = [['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],['January','February','March','April','May','June','July','August','September','October','November','December']];
  var MON_H = ['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'];
  var MON_H_L = [['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'],['Muharram','Safar','Rabi’ al-awwal','Rabi’ al-thani','Jumada al-awwal','Jumada al-thani','Rajab','Sha’ban','Ramadan','Shawwal','Dhu al-Qa’dah','Dhu al-Hijjah']];
  var WD = ['شنبه','یکشنبه','یک‌شنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','پنج‌شنبه','جمعه'];
  var WD_L = [['السبت','الأحد','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الخميس','الجمعة'],['Saturday','Sunday','Sunday','Monday','Tuesday','Wednesday','Thursday','Thursday','Friday']];
  var FA_D = '۰۱۲۳۴۵۶۷۸۹', AR_D = '٠١٢٣٤٥٦٧٨٩';
  function dig(s, li){ return s.replace(/[۰-۹]/g, function(c){ var n = FA_D.indexOf(c); return li === 0 ? AR_D[n] : String(n); }); }
  function esc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  MON_J.forEach(function(w, i){ D[w] = [MON_J_L[0][i], MON_J_L[1][i]]; });
  var TOK = [];   /* [regex, ar, en] برای جایگزینی واژه‌ها */
  function addTok(list, la, le){ list.forEach(function(w, i){ TOK.push([new RegExp(esc(w), 'g'), la[i], le[i]]); }); }
  /* طول‌های بلندتر اول تا «جمادی‌الثانی» پیش از «جمادی» جایگزین شود */
  addTok(MON_H.slice().reverse(), MON_H_L[0].slice().reverse(), MON_H_L[1].slice().reverse());
  addTok(MON_J, MON_J_L[0], MON_J_L[1]);
  addTok(WD, WD_L[0], WD_L[1]);
  TOK.sort(function(x, y){ return y[0].source.length - x[0].source.length; });
  var RX = [
    [/^[۰-۹:+\s]+$/, function(m, li){ return li === 1 ? dig(m[0], 1) : null; }],
    [/^([\d۰-۹]+)\s+(ژانویه|فوریه|مارس|آوریل|مه|ژوئن|ژوئیه|اوت|سپتامبر|اکتبر|نوامبر|دسامبر)\s+([\d۰-۹]+)$/, function(m, li){ return dig(m[1], li) + ' ' + MON_G_L[li][MON_G.indexOf(m[2])] + ' ' + dig(m[3], li); }],
    [/^از ([۰-۹0-9]+)$/, function(m, li){ return li === 0 ? 'من ' + dig(m[1], 0) : 'of ' + dig(m[1], 1); }],
    [/^([۰-۹0-9:]+) تا پایان امروز$/, function(m, li){ return li === 0 ? dig(m[1], 0) + ' حتى نهاية اليوم' : dig(m[1], 1) + ' until the end of today'; }],
    [/^وقت کمی تا پایان امروز مانده — ([۰-۹0-9:]+) تا پایان امروز$/, function(m, li){ return li === 0 ? 'الوقت قليل حتى نهاية اليوم — ' + dig(m[1], 0) : 'Little time left today — ' + dig(m[1], 1) + ' until the end of today'; }],
    [/^(\d+)h و (\d+)min$/, function(m, li){ return li === 0 ? m[1] + ' س ' + m[2] + ' د' : m[1] + 'h ' + m[2] + 'min'; }],
    [/^تا (\w+)$/, function(m, li){ return (li === 0 ? 'حتى ' : 'until ') + m[1]; }],
    [/^([۰-۹]+) ([^\s۰-۹]+) ([۰-۹]+)( ه‍\.ق\.?)?$/, function(m, li){ var s = m[0], r = tokens(s, li); return dig(r, li).replace(/ ه‍\.ق\.?/, li === 0 ? ' هـ' : ' AH'); }],
    [/^([۰-۹]+) سال قمری$/, function(m, li){ return li === 0 ? dig(m[1], 0) + ' سنة قمرية' : dig(m[1], 1) + ' lunar years'; }]
  ];
  function tokens(s, li){ TOK.forEach(function(t){ s = s.replace(t[0], t[li === 0 ? 1 : 2]); }); return s; }
  function tr(s, li){
    var k = s.trim(); if(!k) return null;
    var d = D[k]; if(d) return s.replace(k, d[li]);
    var i, m;
    for(i = 0; i < RX.length; i++){ m = RX[i][0].exec(k); if(m){ var r = RX[i][1](m, li); if(r) return s.replace(k, r); } }
    /* متن آمیخته (لاتین + فارسی) مثل «Wednesday، 4 آذر 1405»: فقط واژه‌های شناخته‌شده جایگزین می‌شوند */
    if(/[A-Za-z]/.test(k) && /[؀-ۿ]/.test(k)){
      var o = tokens(k, li).replace(/،/g, li === 0 ? '،' : ',');
      if(o !== k) return s.replace(k, o);
    }
    return null;
  }
  var PERS = /[؀-ۿ]/;
  var LS = new WeakMap(), AS = new WeakMap();   /* node → {o:اصلی, t:ترجمه‌شده} */
  var ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];
  var mo = null, busy = false, timer = 0, lastLang = 'fa';
  function lang(){ var l = document.documentElement.getAttribute('lang') || 'fa'; return l === 'ar' ? 0 : (l === 'en' ? 1 : -1); }
  function skip(el){ return !el || el.nodeType !== 1 ? false : (/^(SCRIPT|STYLE|TEXTAREA|INPUT|NOSCRIPT|CODE)$/.test(el.tagName) || (el.closest && el.closest('[data-no-i18n]'))); }
  function doText(n, li){
    var st = LS.get(n), cur = n.nodeValue;
    if(st && cur === st.t){ if(li < 0){ n.nodeValue = st.o; LS.delete(n); return; } var r0 = tr(st.o, li); if(r0 !== null && r0 !== cur){ st.t = r0; n.nodeValue = r0; } return; }
    if(li < 0 || !PERS.test(cur) && !/[A-Za-z]/.test(cur)) return;
    var r = tr(cur, li); if(r !== null && r !== cur){ LS.set(n, { o:cur, t:r }); n.nodeValue = r; }
  }
  function doAttr(el, li){
    for(var i = 0; i < ATTRS.length; i++){
      var a = ATTRS[i]; if(!el.hasAttribute(a)) continue;
      var m = AS.get(el); if(!m){ m = {}; AS.set(el, m); }
      var cur = el.getAttribute(a), st = m[a];
      if(st && cur === st.t){ if(li < 0){ el.setAttribute(a, st.o); delete m[a]; } else { var r0 = tr(st.o, li); if(r0 !== null && r0 !== cur){ st.t = r0; el.setAttribute(a, r0); } } continue; }
      if(li < 0 || !PERS.test(cur)) continue;
      var r = tr(cur, li); if(r !== null && r !== cur){ m[a] = { o:cur, t:r }; el.setAttribute(a, r); }
    }
  }
  function walk(root, li){
    if(root.nodeType === 3){ if(!skip(root.parentNode)) doText(root, li); return; }
    if(root.nodeType !== 1 || (root.closest && root.closest('[data-no-i18n]'))) return;
    doAttr(root, li);
    var w = document.createTreeWalker(root, 5, { acceptNode:function(x){ return x.nodeType === 1 && (x.hasAttribute('data-no-i18n') || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(x.tagName)) ? 2 : 1; } }), n;
    while((n = w.nextNode())){ if(n.nodeType === 3){ if(!/^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(n.parentNode.tagName)) doText(n, li); } else doAttr(n, li); }
  }
  function run(root){
    var li = lang(); if(li < 0 && lastLang === 'fa' && !run.dirty) return;
    busy = true;
    try{ walk(root || document.body, li); }catch(e){ if(window.console) console.warn("kzm-i18n", e); }
    busy = false; if(li >= 0) run.dirty = true; else run.dirty = false;
    lastLang = li < 0 ? 'fa' : 'x';
  }
  var pend = [];
  function sched(nodes){
    if(lang() < 0 && !run.dirty) return;
    nodes.forEach(function(n){ pend.push(n); });
    if(timer) return;
    timer = setTimeout(function(){ timer = 0; var p = pend; pend = []; var li = lang(); busy = true; try{ p.forEach(function(n){ if(n.isConnected !== false) walk(n, li); }); }catch(e){} busy = false; }, 40);
  }
  function init(){
    if(!document.body) return;
    run(document.body);
    new MutationObserver(function(){ run(document.body); }).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
    mo = new MutationObserver(function(ms){
      if(busy) return; var nodes = [];
      ms.forEach(function(m){
        if(m.type === 'childList'){ [].forEach.call(m.addedNodes, function(n){ nodes.push(n); }); }
        else if(m.type === 'characterData'){ nodes.push(m.target); }
        else if(m.type === 'attributes'){ nodes.push(m.target); }
      });
      if(nodes.length) sched(nodes);
    });
    mo.observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.KZM_I18N = { run:function(){ run(document.body); }, tr:function(s, l){ return tr(s, l === 'ar' ? 0 : 1); } };
})();

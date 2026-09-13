// كود الجافاسكريبت الاحترافي المستقل للتحكم بالسبلاش والذكاء الاصطناعي المحلي
const splashScreen = document.getElementById('splashScreen');
const splashTitle = document.getElementById('splashTitle');
const splashFileName = document.getElementById('splashFileName');
const splashProgressBar = document.getElementById('splashProgressBar');

// 1. التحكم بأداة الضغط (بايثون السحابي الخفيف)
const compressForm = document.getElementById('compressForm');
const compressInput = document.getElementById('compressInput');
const compressLabel = document.getElementById('compressLabel');

if (compressInput) {
    compressInput.addEventListener('change', function() {
        if(this.files.length > 0) compressLabel.innerText = "✅ تم اختيار: " + this.files[0].name;
    });
}

if (compressForm) {
    compressForm.addEventListener('submit', function() {
        splashTitle.innerText = "⚡ جاري ضغط مساحة الصورة وتحسينها...";
        splashFileName.innerText = `📄 ملف: ${compressInput.files[0].name}`;
        splashProgressBar.style.width = '0%';
        splashScreen.style.display = 'flex';

        let width = 0;
        const interval = setInterval(() => {
            if (width >= 90) clearInterval(interval);
            else { width += 5; splashProgressBar.style.width = width + '%'; }
        }, 150);

        window.addEventListener('focus', () => {
            setTimeout(() => {
                splashProgressBar.style.width = '100%';
                setTimeout(() => { splashScreen.style.display = 'none'; }, 500);
            }, 400);
        }, { once: true });
    });
}

// 2. تحديث نص حقل رفع أداة العزل
const bgInput = document.getElementById('bgInput');
const bgLabel = document.getElementById('bgLabel');

if (bgInput) {
    bgInput.addEventListener('change', function() {
        if(this.files.length > 0) bgLabel.innerText = "✅ تم اختيار: " + this.files[0].name;
    });
}

// 3. الدالة الاحترافية لتشغيل الذكاء الاصطناعي محلياً داخل متصفح المستخدم
async function runLocalAI() {
    const file = bgInput.files[0];
    if (!file) return;

    // إظهار شاشة السبلاش وقفل الموقع
    splashTitle.innerText = "✨ ذكاء اصطناعي محلي: جاري عزل الخلفية بدقة...";
    splashFileName.innerText = `📄 ملف: ${file.name}`;
    splashProgressBar.style.width = '10%';
    splashScreen.style.display = 'flex';

    try {
        // شريط تقدم وهمي متحرك أثناء بدء تشغيل محرك الذكاء الاصطناعي
        let progressWidth = 10;
        const progressInterval = setInterval(() => {
            if(progressWidth < 85) { progressWidth += 3; splashProgressBar.style.width = progressWidth + '%'; }
        }, 300);

        // استدعاء محرك الذكاء الاصطناعي للمتصفح لمعالجة الصورة
        const imageBlob = await imglyBackgroundRemoval(file, {
            progress: (handle, current, total) => {
                // تحديث حقيقي لشريط التقدم بناءً على تحميل الموديل (لأول مرة)
                let realProgress = Math.round((current / total) * 100);
                if (realProgress > 0) {
                    clearInterval(progressInterval);
                    splashProgressBar.style.width = realProgress + '%';
                }
            }
        });

        clearInterval(progressInterval);
        splashProgressBar.style.width = '100%';

        // إنشاء رابط تنزيل فوري للصورة الشفافة الناتجة محلياً
        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'no_bg_' + file.name.split('.')[0] + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // إخفاء شاشة السبلاش بنجاح
        setTimeout(() => { splashScreen.style.display = 'none'; }, 600);

    } catch (error) {
        console.error(error);
        alert("عذراً، حدث خطأ أثناء المعالجة المحلية. يرجى التأكد من تحديث المتصفح وتجربة صورة أخرى.");
        splashScreen.style.display = 'none';
    }
}

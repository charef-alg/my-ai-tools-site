const splashScreen = document.getElementById('splashScreen');
const splashTitle = document.getElementById('splashTitle');
const splashFileName = document.getElementById('splashFileName');
const splashProgressBar = document.getElementById('splashProgressBar');

// تحديث نصوص حقول الرفع عند اختيار الصور
const compressInput = document.getElementById('compressInput');
const compressLabel = document.getElementById('compressLabel');
if (compressInput) {
    compressInput.addEventListener('change', function() {
        if(this.files.length > 0) compressLabel.innerText = "✅ تم اختيار: " + this.files[0].name;
    });
}

const bgInput = document.getElementById('bgInput');
const bgLabel = document.getElementById('bgLabel');
if (bgInput) {
    bgInput.addEventListener('change', function() {
        if(this.files.length > 0) bgLabel.innerText = "✅ تم اختيار: " + this.files[0].name;
    });
}

// دالة ضغط الصور محلياً 100% داخل المتصفح
async function runLocalCompression() {
    const file = compressInput.files[0];
    if (!file) return;

    splashTitle.innerText = "⚡ جاري ضغط مساحة الصورة وتحسينها...";
    splashFileName.innerText = `📄 ملف: ${file.name}`;
    splashProgressBar.style.width = '10%';
    splashScreen.style.display = 'flex';

    const options = {
        maxSizeMB: 1, // الحجم الأقصى المستهدف بالـ ميغابايت
        maxWidthOrHeight: 1920, // الأبعاد القصوى للحفاظ على التفاصيل
        useWebWorker: true,
        onProgress: function(p) {
            splashProgressBar.style.width = p + '%';
        }
    };

    try {
        const compressedFile = await imageCompression(file, options);
        splashProgressBar.style.width = '100%';

        // تنزيل تلقائي فوري
        const url = URL.createObjectURL(compressedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed_' + file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setTimeout(() => { splashScreen.style.display = 'none'; }, 500);
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء ضغط الصورة.");
        splashScreen.style.display = 'none';
    }
}

// دالة عزل الخلفية بالذكاء الاصطناعي محلياً 100% داخل المتصفح
async function runLocalAI() {
    const file = bgInput.files[0];
    if (!file) return;

    splashTitle.innerText = "✨ ذكاء اصطناعي محلي: جاري عزل الخلفية بدقة...";
    splashFileName.innerText = `📄 ملف: ${file.name}`;
    splashProgressBar.style.width = '10%';
    splashScreen.style.display = 'flex';

    try {
        let progressWidth = 10;
        const progressInterval = setInterval(() => {
            if(progressWidth < 85) { progressWidth += 3; splashProgressBar.style.width = progressWidth + '%'; }
        }, 300);

        const imageBlob = await imglyBackgroundRemoval(file, {
            progress: (handle, current, total) => {
                let realProgress = Math.round((current / total) * 100);
                if (realProgress > 0) {
                    clearInterval(progressInterval);
                    splashProgressBar.style.width = realProgress + '%';
                }
            }
        });

        clearInterval(progressInterval);
        splashProgressBar.style.width = '100%';

        const url = URL.createObjectURL(imageBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'no_bg_' + file.name.split('.')[0] + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setTimeout(() => { splashScreen.style.display = 'none'; }, 600);
    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء معالجة الخلفية.");
        splashScreen.style.display = 'none';
    }
}
// ربط الدوال بنطاق المتصفح العام لكي يراها ملف الـ HTML
window.runLocalCompression = runLocalCompression;
window.runLocalAI = runLocalAI;

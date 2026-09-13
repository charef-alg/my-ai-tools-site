import os
from flask import Flask, render_template, request, send_file
from PIL import Image
from rembg import remove # استيراد دالة إزالة الخلفية
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# 1. أداة ضغط الصور (القديمة)
@app.route('/compress', methods=['POST'])
def compress_image():
    if 'image' not in request.files: return "لم يتم رفع أي صورة", 400
    file = request.files['image']
    if file.filename == '': return "اسم الملف غير صحيح", 400

    img = Image.open(file.stream)
    if img.mode in ('RGBA', 'LA'): img = img.convert('RGB')

    img_io = io.BytesIO()
    img.save(img_io, 'JPEG', quality=60, optimize=True)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg', as_attachment=True, download_name='compressed_image.jpg')

# 2. أداة إزالة الخلفية الجديدة بالذكاء الاصطناعي
@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files: return "لم يتم رفع أي صورة", 400
    file = request.files['image']
    if file.filename == '': return "اسم الملف غير صحيح", 400

    # قراءة الصورة المرفوعة
    input_image = Image.open(file.stream)
    
    # معالجة الصورة بالذكاء الاصطناعي وإزالة الخلفية تلقائياً
    output_image = remove(input_image)

    # حفظ الصورة الناتجة بصيغة PNG (لأنها تدعم الشفافية) في الذاكرة
    img_io = io.BytesIO()
    output_image.save(img_io, 'PNG')
    img_io.seek(0)

    # إرسال الصورة الشفافة للمستخدم
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='no_bg_image.png')

@app.route('/privacy-policy')
def privacy_policy():
    # عرض صفحة سياسة الخصوصية
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    # عرض صفحة شروط الاستخدام
    return render_template('terms.html')

if __name__ == '__main__':
    app.run(debug=True)

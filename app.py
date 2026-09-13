import os
from flask import Flask, render_template, request, send_file
from PIL import Image
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compress', methods=['POST'])
def compress_image():
    if 'image' not in request.files: return "لم يتم رفع أي صورة", 400
    file = request.files['image']
    if file.filename == '': return "اسم الملف غير صحيح", 400

    img = Image.open(file.stream)
    if img.mode in ('RGBA', 'LA'): img = img.convert('RGB')

    # معالجة وحفظ الصورة في الذاكرة
    img_io = io.BytesIO()
    img.save(img_io, 'JPEG', quality=60, optimize=True)
    img_io.seek(0)
    
    # التحديث السحري: إرسال الملف بطريقة البث (Stream) المباشر المتوافقة مع السيرفرات السحابية
    return send_file(
        img_io, 
        mimetype='image/jpeg', 
        as_attachment=True, 
        download_name='compressed_image.jpg',
        conditional=True # يمنح المتصفح والسيرفر استقراراً كاملاً أثناء تدفق التنزيل
    )

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files: return "لم يتم رفع أي صورة", 400
    file = request.files['image']
    if file.filename == '': return "اسم الملف غير صحيح", 400

    from rembg import remove 

    input_image = Image.open(file.stream)
    output_image = remove(input_image)

    img_io = io.BytesIO()
    output_image.save(img_io, 'PNG')
    img_io.seek(0)
    
    return send_file(
        img_io, 
        mimetype='image/png', 
        as_attachment=True, 
        download_name='no_bg_image.png',
        conditional=True # لمنع خطأ 502 عند تنزيل الصور الشفافة
    )

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

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

    img_io = io.BytesIO()
    img.save(img_io, 'JPEG', quality=60, optimize=True)
    img_io.seek(0)
    
    return send_file(
        img_io, 
        mimetype='image/jpeg', 
        as_attachment=True, 
        download_name='compressed_image.jpg',
        conditional=True
    )

@app.route('/privacy-policy')
def privacy_policy(): return render_template('privacy.html')

@app.route('/terms')
def terms(): return render_template('terms.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

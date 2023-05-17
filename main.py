from flask import Flask, render_template, request, send_from_directory
import base64, os

app = Flask(__name__)

@app.route("/", methods = ['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route("/game/", methods = ['POST'])
def game():
    return render_template('game.html')

@app.route('/game/wordlist.txt')
def serve_wordlist():
    return send_from_directory('static', 'wordlist.txt')

@app.route("/drawing/", methods = ['POST'])
def drawing():
    return render_template('drawing.html')

@app.route("/gallery/", methods = ['POST'])
def gallery():
    return render_template('gallery.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.get_json()
    base64_image = data['image']

    # Decode the base64 image data
    image_data = base64.b64decode(base64_image)

    # Count the number of items in directory
    items = os.listdir('imageUploads')
    num_items = len(items)

    # Save the image to a file
    with open('imageUploads/'+ str(num_items) + '.png', 'wb') as file:
        file.write(image_data)

    return str(num_items)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(os.getcwd(), filename)


    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/drawing/", methods = ['POST'])
def drawing():
    return render_template('drawing.html')

@app.route("/gallery/", methods = ['POST'])
def gallery():
    return render_template('gallery.html')
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
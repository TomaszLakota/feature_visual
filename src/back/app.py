import torch
import glob
import torchvision
import numpy as np
import matplotlib.pyplot as plt
import torch.backends.cudnn as cudnn
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, render_template, request, url_for, jsonify
from visualisation.core.utils import device 
from utils import *
from project_utils import *
from visualisation.core import *
from cifar_models.models_vgg import *

app = Flask(__name__)

@app.route('/class_selection')
def class_selection():
    classes = ('plane', 'car', 'bird', 'cat',
        'deer', 'dog', 'frog', 'horse', 'ship', 'truck')
    return render_template('class_selection.html', classes=classes)

@app.route('/image_randomization', methods=['GET', 'POST'])
def image_randomization():
    chosen_class = request.form.get('chosen_class')
    load_random_image(chosen_class)
    return render_template('image_randomization.html', chosen_class=chosen_class)        

@app.route('/feature_visualisation', methods=['GET', 'POST'])
def feature_visualisation():
    vis_image = request.form.get('vis_image')
    load_layer_visualisations(vis_image)
    return render_template('feature_visualisation.html', image=vis_image)

@app.route('/saliency_map', methods=['GET', 'POST'])
def saliency_map():
    vis_image = request.form.get('vis_image')
    load_saliency_map(vis_image, 1)
    return render_template("saliency_map.html", image=vis_image)

# @app.route('/get_single', methods=['GET', 'POST'])
# def get_single():
#     chosen_class = 'deer'
#     chosen_class2 = request.form.get('chosen_class')
#     print(chosen_class2)
#     image = load_random_image(chosen_class)
#     data = {"class": chosen_class, "id": 123, "image": image}
#     return jsonify(data)

@app.route('/get_single', methods=['GET'])
def get_single():
    print("zapytanie")
    args = request.args.to_dict()
    print(args)
    chosen_class = args['selected_class']
    chosen_model = args['model']
    obj = prepare_images(chosen_model, int(chosen_class))
    print(jsonify(obj))
    return jsonify(obj)

if __name__ == '__main__':
    app.run()
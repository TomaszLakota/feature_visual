import os
import errno
import torch
import glob
import torchvision
import numpy as np
import matplotlib.pyplot as plt
import torch.backends.cudnn as cudnn
import torchvision.transforms as transforms
from PIL import Image
from random import randint
from visualisation.core.utils import device 
from utils import *
from visualisation.core import *
from cifar_models.models_vgg import *

def create_dir_if_empty(filename):
    if not os.path.exists(os.path.dirname(filename)):
        try:
            os.makedirs(os.path.dirname(filename))
        except OSError as exc:
            if exc.errno != errno.EEXIST:
                raise

# def load_random_image(image_class):
#     cifar_dataset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True)
#     classes = ('plane', 'car', 'bird', 'cat',
#         'deer', 'dog', 'frog', 'horse', 'ship', 'truck')
#     while(True):
#         x = randint(0, 50000 - 1)
#         image, class_index = cifar_dataset[x]
#         if classes[class_index] == image_class:
#             save_path = 'static/img/input_images/{}/img{}.png'.format(classes[class_index], x)
#             image.save(save_path)
#             return save_path
    
def load_model(model):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    models_dict = {'resnet': ResNet18(), 'vgg': VGG('VGG19'), 'efficient': EfficientNetB0()}

    net = models_dict[model]
    net = net.to(device)
    
    if device == 'cuda':
        net = torch.nn.DataParallel(net)
        cudnn.benchmark = True
    
    checkpoint = torch.load('./checkpoints/{}_ckpt.pth'.format(model))
    net.load_state_dict(checkpoint['net'])
    return net

def load_layer_visualisations(image, folder_path, model='resnet'):
    net = load_model(model)
    input_tensor = img_to_tensor(image)
    model_traced = module2traced(net, input_tensor)
    for x in range(5):
        # if x > 0:
        #     break
        visualised_layer = model_traced[x]

        vis = Weights(net, device)
        images, info = vis(input_tensor, visualised_layer)
    
        for index, tens in enumerate(images):
            print('index', index)
            img = tensor2img(tens)
            save_path = folder_path + str(index) + '.png'
            plt.imsave(save_path, img)
    return   

def load_saliency_map(image, folder_path, model='resnet'):
    net = load_model(model)
    input_tensor = img_to_tensor(image)
    model_traced = module2traced(net, input_tensor)
    for x in range(5): 
        if x > 0:
            break;   
        visualised_layer = model_traced[x]

        vis = SaliencyMap(net, device)
        image, info = vis(input_tensor, visualised_layer, guide=True)
        
        img = tensor2img(image)
        save_path = folder_path + 'sal' + str(x) + '.png'
        plt.imsave(save_path, img)
        return

# def img_to_tensor(image):
#     transform = transforms.Compose([transforms.ToTensor(),
#      transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

#     img = Image.open(image)
#     tensor = transform(img).unsqueeze(0)
#     tensor = tensor.to(device)
#     return tensor

def img_to_tensor(image):
    transform = transforms.Compose([transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

    print(image)
    # img = Image.open(image)
    tensor = transform(image).unsqueeze(0)
    tensor = tensor.to(device)
    return tensor
    
def prepare_images(model='resnet', selected_class=-1):
    print("prepare images",model,selected_class)
    cifar_dataset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True)
    classes = ('plane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

    if selected_class == -1:
        selected_class = randint(0, 10 - 1)
    while(True):
        x = randint(0, 50000 - 1)
        image, class_index = cifar_dataset[x]
        print(class_index, selected_class )
        if class_index == selected_class:
            print(x)
            # stworz sciezke do nowego folderu
            folder_path = 'static/img/{}/'.format(x)

            #zapisz oryginalny obraz
            save_path = '{}input_image.png'.format(folder_path)
            create_dir_if_empty(save_path)
            image.save(save_path)
            print("saved image")
            #zapisz obrazy warstw TODO: zmien funkcje load_layer_visualisation tak zeby tylko zapisywala obrazy w nowym folderze, ale za to wszystkich warstw
            load_layer_visualisations(image, folder_path, model)
            print("saved layers")
            #zapisz saliency map  TODO: zmien funkcje load_saliency_map, tak zeby tylko zapisywala obraz w nowym folderze
            load_saliency_map(image, folder_path, model)
            print("completed prepare images")
            print(folder_path, selected_class)
            return dict(folder_path=folder_path, selected_class=selected_class) # TODO: zwroc obiekt
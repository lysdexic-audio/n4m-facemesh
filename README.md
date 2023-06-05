# n4m-facemesh
Wraps [MediaPipe Facemesh](https://github.com/tensorflow/tfjs-models/tree/master/facemesh) inside electron and serves the detected parts via MaxAPI.

![facemesh](https://user-images.githubusercontent.com/43569216/81710053-c39c1900-94b5-11ea-8959-6efda2d71089.gif)

Based around [Yuichi Yogo](https://github.com/yuichkun)'s great work porting Electron + Tensorflow models into [Node For Max](https://github.com/Cycling74/n4m-examples)


# Steps
1. Install npm dependencies by clicking the indicated button. Since Electron's kind of big in size, this make take a while depending on your network environment. When the message object says it's 'completed' you'll never have to do this step again.
2. Click on the toggle button to launch MediaPipe FaceMesh. 
3. The node.script emits the detected results as a dict - retrieve values using the dictionary keys (objects on the right) 

# Mesh Keypoints Map
![meshmap](https://github.com/lysdexic-audio/n4m-facemesh/blob/master/mesh_map.jpg)

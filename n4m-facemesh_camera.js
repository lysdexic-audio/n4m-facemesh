/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const SocketIOClient = require("socket.io-client");
const io = new SocketIOClient("http://localhost:3000");
statsShow = true;

const socket = io.connect();
socket.on("connect", () => {
	console.log("Connected to Max 8");
  //socket.emit("dispatch", "Socket is connected, Ready");
});

const facemesh = require("@tensorflow-models/facemesh");
const dat = require("dat.gui");
const Stats = require("stats.js");
const tf = require("@tensorflow/tfjs-core");
const tfjsWasm = require("@tensorflow/tfjs-backend-wasm");
const version = require("@tensorflow/tfjs-backend-wasm/dist/version");

tfjsWasm.setWasmPath(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${
        version.version}/dist/tfjs-backend-wasm.wasm`);

tf.setBackend('wasm').then(() => {bindPage()});

//console.log("version: ", version.version);

//import {TRIANGULATION} from './triangulation'; //syntax?

const TRIANGULATION = [
    127, 34, 139, 11, 0, 37, 232, 231, 120, 72, 37, 39, 128, 121, 47, 232, 121,
    128, 104, 69, 67, 175, 171, 148, 157, 154, 155, 118, 50, 101, 73, 39, 40, 9,
    151, 108, 48, 115, 131, 194, 204, 211, 74, 40, 185, 80, 42, 183, 40, 92,
    186, 230, 229, 118, 202, 212, 214, 83, 18, 17, 76, 61, 146, 160, 29, 30, 56,
    157, 173, 106, 204, 194, 135, 214, 192, 203, 165, 98, 21, 71, 68, 51, 45, 4,
    144, 24, 23, 77, 146, 91, 205, 50, 187, 201, 200, 18, 91, 106, 182, 90, 91,
    181, 85, 84, 17, 206, 203, 36, 148, 171, 140, 92, 40, 39, 193, 189, 244,
    159, 158, 28, 247, 246, 161, 236, 3, 196, 54, 68, 104, 193, 168, 8, 117,
    228, 31, 189, 193, 55, 98, 97, 99, 126, 47, 100, 166, 79, 218, 155, 154, 26,
    209, 49, 131, 135, 136, 150, 47, 126, 217, 223, 52, 53, 45, 51, 134, 211,
    170, 140, 67, 69, 108, 43, 106, 91, 230, 119, 120, 226, 130, 247, 63, 53,
    52, 238, 20, 242, 46, 70, 156, 78, 62, 96, 46, 53, 63, 143, 34, 227, 173,
    155, 133, 123, 117, 111, 44, 125, 19, 236, 134, 51, 216, 206, 205, 154, 153,
    22, 39, 37, 167, 200, 201, 208, 36, 142, 100, 57, 212, 202, 20, 60, 99, 28,
    158, 157, 35, 226, 113, 160, 159, 27, 204, 202, 210, 113, 225, 46, 43, 202,
    204, 62, 76, 77, 137, 123, 116, 41, 38, 72, 203, 129, 142, 64, 98, 240, 49,
    102, 64, 41, 73, 74, 212, 216, 207, 42, 74, 184, 169, 170, 211, 170, 149,
    176, 105, 66, 69, 122, 6, 168, 123, 147, 187, 96, 77, 90, 65, 55, 107, 89,
    90, 180, 101, 100, 120, 63, 105, 104, 93, 137, 227, 15, 86, 85, 129, 102,
    49, 14, 87, 86, 55, 8, 9, 100, 47, 121, 145, 23, 22, 88, 89, 179, 6, 122,
    196, 88, 95, 96, 138, 172, 136, 215, 58, 172, 115, 48, 219, 42, 80, 81, 195,
    3, 51, 43, 146, 61, 171, 175, 199, 81, 82, 38, 53, 46, 225, 144, 163, 110,
    246, 33, 7, 52, 65, 66, 229, 228, 117, 34, 127, 234, 107, 108, 69, 109, 108,
    151, 48, 64, 235, 62, 78, 191, 129, 209, 126, 111, 35, 143, 163, 161, 246,
    117, 123, 50, 222, 65, 52, 19, 125, 141, 221, 55, 65, 3, 195, 197, 25, 7,
    33, 220, 237, 44, 70, 71, 139, 122, 193, 245, 247, 130, 33, 71, 21, 162,
    153, 158, 159, 170, 169, 150, 188, 174, 196, 216, 186, 92, 144, 160, 161, 2,
    97, 167, 141, 125, 241, 164, 167, 37, 72, 38, 12, 145, 159, 160, 38, 82, 13,
    63, 68, 71, 226, 35, 111, 158, 153, 154, 101, 50, 205, 206, 92, 165, 209,
    198, 217, 165, 167, 97, 220, 115, 218, 133, 112, 243, 239, 238, 241, 214,
    135, 169, 190, 173, 133, 171, 208, 32, 125, 44, 237, 86, 87, 178, 85, 86,
    179, 84, 85, 180, 83, 84, 181, 201, 83, 182, 137, 93, 132, 76, 62, 183, 61,
    76, 184, 57, 61, 185, 212, 57, 186, 214, 207, 187, 34, 143, 156, 79, 239,
    237, 123, 137, 177, 44, 1, 4, 201, 194, 32, 64, 102, 129, 213, 215, 138, 59,
    166, 219, 242, 99, 97, 2, 94, 141, 75, 59, 235, 24, 110, 228, 25, 130, 226,
    23, 24, 229, 22, 23, 230, 26, 22, 231, 112, 26, 232, 189, 190, 243, 221, 56,
    190, 28, 56, 221, 27, 28, 222, 29, 27, 223, 30, 29, 224, 247, 30, 225, 238,
    79, 20, 166, 59, 75, 60, 75, 240, 147, 177, 215, 20, 79, 166, 187, 147, 213,
    112, 233, 244, 233, 128, 245, 128, 114, 188, 114, 217, 174, 131, 115, 220,
    217, 198, 236, 198, 131, 134, 177, 132, 58, 143, 35, 124, 110, 163, 7, 228,
    110, 25, 356, 389, 368, 11, 302, 267, 452, 350, 349, 302, 303, 269, 357,
    343, 277, 452, 453, 357, 333, 332, 297, 175, 152, 377, 384, 398, 382, 347,
    348, 330, 303, 304, 270, 9, 336, 337, 278, 279, 360, 418, 262, 431, 304,
    408, 409, 310, 415, 407, 270, 409, 410, 450, 348, 347, 422, 430, 434, 313,
    314, 17, 306, 307, 375, 387, 388, 260, 286, 414, 398, 335, 406, 418, 364,
    367, 416, 423, 358, 327, 251, 284, 298, 281, 5, 4, 373, 374, 253, 307, 320,
    321, 425, 427, 411, 421, 313, 18, 321, 405, 406, 320, 404, 405, 315, 16, 17,
    426, 425, 266, 377, 400, 369, 322, 391, 269, 417, 465, 464, 386, 257, 258,
    466, 260, 388, 456, 399, 419, 284, 332, 333, 417, 285, 8, 346, 340, 261,
    413, 441, 285, 327, 460, 328, 355, 371, 329, 392, 439, 438, 382, 341, 256,
    429, 420, 360, 364, 394, 379, 277, 343, 437, 443, 444, 283, 275, 440, 363,
    431, 262, 369, 297, 338, 337, 273, 375, 321, 450, 451, 349, 446, 342, 467,
    293, 334, 282, 458, 461, 462, 276, 353, 383, 308, 324, 325, 276, 300, 293,
    372, 345, 447, 382, 398, 362, 352, 345, 340, 274, 1, 19, 456, 248, 281, 436,
    427, 425, 381, 256, 252, 269, 391, 393, 200, 199, 428, 266, 330, 329, 287,
    273, 422, 250, 462, 328, 258, 286, 384, 265, 353, 342, 387, 259, 257, 424,
    431, 430, 342, 353, 276, 273, 335, 424, 292, 325, 307, 366, 447, 345, 271,
    303, 302, 423, 266, 371, 294, 455, 460, 279, 278, 294, 271, 272, 304, 432,
    434, 427, 272, 407, 408, 394, 430, 431, 395, 369, 400, 334, 333, 299, 351,
    417, 168, 352, 280, 411, 325, 319, 320, 295, 296, 336, 319, 403, 404, 330,
    348, 349, 293, 298, 333, 323, 454, 447, 15, 16, 315, 358, 429, 279, 14, 15,
    316, 285, 336, 9, 329, 349, 350, 374, 380, 252, 318, 402, 403, 6, 197, 419,
    318, 319, 325, 367, 364, 365, 435, 367, 397, 344, 438, 439, 272, 271, 311,
    195, 5, 281, 273, 287, 291, 396, 428, 199, 311, 271, 268, 283, 444, 445,
    373, 254, 339, 263, 466, 249, 282, 334, 296, 449, 347, 346, 264, 447, 454,
    336, 296, 299, 338, 10, 151, 278, 439, 455, 292, 407, 415, 358, 371, 355,
    340, 345, 372, 390, 249, 466, 346, 347, 280, 442, 443, 282, 19, 94, 370,
    441, 442, 295, 248, 419, 197, 263, 255, 359, 440, 275, 274, 300, 383, 368,
    351, 412, 465, 263, 467, 466, 301, 368, 389, 380, 374, 386, 395, 378, 379,
    412, 351, 419, 436, 426, 322, 373, 390, 388, 2, 164, 393, 370, 462, 461,
    164, 0, 267, 302, 11, 12, 374, 373, 387, 268, 12, 13, 293, 300, 301, 446,
    261, 340, 385, 384, 381, 330, 266, 425, 426, 423, 391, 429, 355, 437, 391,
    327, 326, 440, 457, 438, 341, 382, 362, 459, 457, 461, 434, 430, 394, 414,
    463, 362, 396, 369, 262, 354, 461, 457, 316, 403, 402, 315, 404, 403, 314,
    405, 404, 313, 406, 405, 421, 418, 406, 366, 401, 361, 306, 408, 407, 291,
    409, 408, 287, 410, 409, 432, 436, 410, 434, 416, 411, 264, 368, 383, 309,
    438, 457, 352, 376, 401, 274, 275, 4, 421, 428, 262, 294, 327, 358, 433,
    416, 367, 289, 455, 439, 462, 370, 326, 2, 326, 370, 305, 460, 455, 254,
    449, 448, 255, 261, 446, 253, 450, 449, 252, 451, 450, 256, 452, 451, 341,
    453, 452, 413, 464, 463, 441, 413, 414, 258, 442, 441, 257, 443, 442, 259,
    444, 443, 260, 445, 444, 467, 342, 445, 459, 458, 250, 289, 392, 290, 290,
    328, 460, 376, 433, 435, 250, 290, 392, 411, 416, 433, 341, 463, 464, 453,
    464, 465, 357, 465, 412, 343, 412, 399, 360, 363, 440, 437, 399, 456, 420,
    456, 363, 401, 435, 288, 372, 383, 353, 339, 255, 249, 448, 261, 255, 133,
    243, 190, 133, 155, 112, 33, 246, 247, 33, 130, 25, 398, 384, 286, 362, 398,
    414, 362, 463, 341, 263, 359, 467, 263, 249, 255, 466, 467, 260, 75, 60,
    166, 238, 239, 79, 162, 127, 139, 72, 11, 37, 121, 232, 120, 73, 72, 39,
    114, 128, 47, 233, 232, 128, 103, 104, 67, 152, 175, 148, 173, 157, 155,
    119, 118, 101, 74, 73, 40, 107, 9, 108, 49, 48, 131, 32, 194, 211, 184, 74,
    185, 191, 80, 183, 185, 40, 186, 119, 230, 118, 210, 202, 214, 84, 83, 17,
    77, 76, 146, 161, 160, 30, 190, 56, 173, 182, 106, 194, 138, 135, 192, 129,
    203, 98, 54, 21, 68, 5, 51, 4, 145, 144, 23, 90, 77, 91, 207, 205, 187, 83,
    201, 18, 181, 91, 182, 180, 90, 181, 16, 85, 17, 205, 206, 36, 176, 148,
    140, 165, 92, 39, 245, 193, 244, 27, 159, 28, 30, 247, 161, 174, 236, 196,
    103, 54, 104, 55, 193, 8, 111, 117, 31, 221, 189, 55, 240, 98, 99, 142, 126,
    100, 219, 166, 218, 112, 155, 26, 198, 209, 131, 169, 135, 150, 114, 47,
    217, 224, 223, 53, 220, 45, 134, 32, 211, 140, 109, 67, 108, 146, 43, 91,
    231, 230, 120, 113, 226, 247, 105, 63, 52, 241, 238, 242, 124, 46, 156, 95,
    78, 96, 70, 46, 63, 116, 143, 227, 116, 123, 111, 1, 44, 19, 3, 236, 51,
    207, 216, 205, 26, 154, 22, 165, 39, 167, 199, 200, 208, 101, 36, 100, 43,
    57, 202, 242, 20, 99, 56, 28, 157, 124, 35, 113, 29, 160, 27, 211, 204, 210,
    124, 113, 46, 106, 43, 204, 96, 62, 77, 227, 137, 116, 73, 41, 72, 36, 203,
    142, 235, 64, 240, 48, 49, 64, 42, 41, 74, 214, 212, 207, 183, 42, 184, 210,
    169, 211, 140, 170, 176, 104, 105, 69, 193, 122, 168, 50, 123, 187, 89, 96,
    90, 66, 65, 107, 179, 89, 180, 119, 101, 120, 68, 63, 104, 234, 93, 227, 16,
    15, 85, 209, 129, 49, 15, 14, 86, 107, 55, 9, 120, 100, 121, 153, 145, 22,
    178, 88, 179, 197, 6, 196, 89, 88, 96, 135, 138, 136, 138, 215, 172, 218,
    115, 219, 41, 42, 81, 5, 195, 51, 57, 43, 61, 208, 171, 199, 41, 81, 38,
    224, 53, 225, 24, 144, 110, 105, 52, 66, 118, 229, 117, 227, 34, 234, 66,
    107, 69, 10, 109, 151, 219, 48, 235, 183, 62, 191, 142, 129, 126, 116, 111,
    143, 7, 163, 246, 118, 117, 50, 223, 222, 52, 94, 19, 141, 222, 221, 65,
    196, 3, 197, 45, 220, 44, 156, 70, 139, 188, 122, 245, 139, 71, 162, 145,
    153, 159, 149, 170, 150, 122, 188, 196, 206, 216, 92, 163, 144, 161, 164, 2,
    167, 242, 141, 241, 0, 164, 37, 11, 72, 12, 144, 145, 160, 12, 38, 13, 70,
    63, 71, 31, 226, 111, 157, 158, 154, 36, 101, 205, 203, 206, 165, 126, 209,
    217, 98, 165, 97, 237, 220, 218, 237, 239, 241, 210, 214, 169, 140, 171, 32,
    241, 125, 237, 179, 86, 178, 180, 85, 179, 181, 84, 180, 182, 83, 181, 194,
    201, 182, 177, 137, 132, 184, 76, 183, 185, 61, 184, 186, 57, 185, 216, 212,
    186, 192, 214, 187, 139, 34, 156, 218, 79, 237, 147, 123, 177, 45, 44, 4,
    208, 201, 32, 98, 64, 129, 192, 213, 138, 235, 59, 219, 141, 242, 97, 97, 2,
    141, 240, 75, 235, 229, 24, 228, 31, 25, 226, 230, 23, 229, 231, 22, 230,
    232, 26, 231, 233, 112, 232, 244, 189, 243, 189, 221, 190, 222, 28, 221,
    223, 27, 222, 224, 29, 223, 225, 30, 224, 113, 247, 225, 99, 60, 240, 213,
    147, 215, 60, 20, 166, 192, 187, 213, 243, 112, 244, 244, 233, 245, 245,
    128, 188, 188, 114, 174, 134, 131, 220, 174, 217, 236, 236, 198, 134, 215,
    177, 58, 156, 143, 124, 25, 110, 7, 31, 228, 25, 264, 356, 368, 0, 11, 267,
    451, 452, 349, 267, 302, 269, 350, 357, 277, 350, 452, 357, 299, 333, 297,
    396, 175, 377, 381, 384, 382, 280, 347, 330, 269, 303, 270, 151, 9, 337,
    344, 278, 360, 424, 418, 431, 270, 304, 409, 272, 310, 407, 322, 270, 410,
    449, 450, 347, 432, 422, 434, 18, 313, 17, 291, 306, 375, 259, 387, 260,
    424, 335, 418, 434, 364, 416, 391, 423, 327, 301, 251, 298, 275, 281, 4,
    254, 373, 253, 375, 307, 321, 280, 425, 411, 200, 421, 18, 335, 321, 406,
    321, 320, 405, 314, 315, 17, 423, 426, 266, 396, 377, 369, 270, 322, 269,
    413, 417, 464, 385, 386, 258, 248, 456, 419, 298, 284, 333, 168, 417, 8,
    448, 346, 261, 417, 413, 285, 326, 327, 328, 277, 355, 329, 309, 392, 438,
    381, 382, 256, 279, 429, 360, 365, 364, 379, 355, 277, 437, 282, 443, 283,
    281, 275, 363, 395, 431, 369, 299, 297, 337, 335, 273, 321, 348, 450, 349,
    359, 446, 467, 283, 293, 282, 250, 458, 462, 300, 276, 383, 292, 308, 325,
    283, 276, 293, 264, 372, 447, 346, 352, 340, 354, 274, 19, 363, 456, 281,
    426, 436, 425, 380, 381, 252, 267, 269, 393, 421, 200, 428, 371, 266, 329,
    432, 287, 422, 290, 250, 328, 385, 258, 384, 446, 265, 342, 386, 387, 257,
    422, 424, 430, 445, 342, 276, 422, 273, 424, 306, 292, 307, 352, 366, 345,
    268, 271, 302, 358, 423, 371, 327, 294, 460, 331, 279, 294, 303, 271, 304,
    436, 432, 427, 304, 272, 408, 395, 394, 431, 378, 395, 400, 296, 334, 299,
    6, 351, 168, 376, 352, 411, 307, 325, 320, 285, 295, 336, 320, 319, 404,
    329, 330, 349, 334, 293, 333, 366, 323, 447, 316, 15, 315, 331, 358, 279,
    317, 14, 316, 8, 285, 9, 277, 329, 350, 253, 374, 252, 319, 318, 403, 351,
    6, 419, 324, 318, 325, 397, 367, 365, 288, 435, 397, 278, 344, 439, 310,
    272, 311, 248, 195, 281, 375, 273, 291, 175, 396, 199, 312, 311, 268, 276,
    283, 445, 390, 373, 339, 295, 282, 296, 448, 449, 346, 356, 264, 454, 337,
    336, 299, 337, 338, 151, 294, 278, 455, 308, 292, 415, 429, 358, 355, 265,
    340, 372, 388, 390, 466, 352, 346, 280, 295, 442, 282, 354, 19, 370, 285,
    441, 295, 195, 248, 197, 457, 440, 274, 301, 300, 368, 417, 351, 465, 251,
    301, 389, 385, 380, 386, 394, 395, 379, 399, 412, 419, 410, 436, 322, 387,
    373, 388, 326, 2, 393, 354, 370, 461, 393, 164, 267, 268, 302, 12, 386, 374,
    387, 312, 268, 13, 298, 293, 301, 265, 446, 340, 380, 385, 381, 280, 330,
    425, 322, 426, 391, 420, 429, 437, 393, 391, 326, 344, 440, 438, 458, 459,
    461, 364, 434, 394, 428, 396, 262, 274, 354, 457, 317, 316, 402, 316, 315,
    403, 315, 314, 404, 314, 313, 405, 313, 421, 406, 323, 366, 361, 292, 306,
    407, 306, 291, 408, 291, 287, 409, 287, 432, 410, 427, 434, 411, 372, 264,
    383, 459, 309, 457, 366, 352, 401, 1, 274, 4, 418, 421, 262, 331, 294, 358,
    435, 433, 367, 392, 289, 439, 328, 462, 326, 94, 2, 370, 289, 305, 455, 339,
    254, 448, 359, 255, 446, 254, 253, 449, 253, 252, 450, 252, 256, 451, 256,
    341, 452, 414, 413, 463, 286, 441, 414, 286, 258, 441, 258, 257, 442, 257,
    259, 443, 259, 260, 444, 260, 467, 445, 309, 459, 250, 305, 289, 290, 305,
    290, 460, 401, 376, 435, 309, 250, 392, 376, 411, 433, 453, 341, 464, 357,
    453, 465, 343, 357, 412, 437, 343, 399, 344, 360, 440, 420, 437, 456, 360,
    420, 363, 361, 401, 288, 265, 372, 353, 390, 339, 249, 339, 448, 255];

const Store = require('electron-store');

const schema = {
  storemaxContinuousChecks: {
    type: 'number',
    maximum: 960,
    minimum: 1,
    default: 5
  },
  storedetectionConfidence: {
    type: 'number',
    maximum: 1.0,
    minimum: 0.2,
    default: 0.9
  },
  storeiouThreshold: {
    type: 'number',
    maximum: 1.0,
    minimum: 0.2,
    default: 0.3
  },
  storescoreThreshold: {
    type: 'number',
    maximum: 1.0,
    minimum: 0.2,
    default: 0.75
  },
  storetriangulateMesh: {
    type: 'boolean',
    default: true
  },
  storemaxFaces: {
    type: 'number',
    maximum: 10,
    minimum: 1,
    default: 1
  },
  storeBackend: {
    type: 'string',
    default: 'wasm'
  },
  storehand_fillColour: {
    type: 'string',
    default: "#32EEDB"
  },
  storehand_strokeColour: {
    type: 'string',
    default: "#32EEDB"
  },
};

const store = new Store({schema});
var palette =
{
  fillColour: store.get("storehand_fillColour"), // CSS string
  strokeColour: store.get("storehand_strokeColour") // CSS string
};

const videoWidth = 600;
const videoHeight = 500;
const stats = new Stats();

var _fillColour = store.get("storehand_fillColour");
var _strokeColour = store.get("storehand_strokeColour");

function isAndroid() {
	return /Android/i.test(navigator.userAgent);
}

function isiOS() {
	return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
	return isAndroid() || isiOS();
}

function sendToMaxPatch(predictions) {
	socket.emit("dispatch", predictions);
}

var vector = function()
{
  this.x = arguments[0];
  this.y = arguments[1];
  this.z = arguments[2];
};

// function vecSub(v1,v2)
// {
//   var subbed = new vector();
//   subbed.x = v1.x - v2.x;
//   subbed.y = v1.y - v2.y;
//   //subbed.z = v1.z - v2.z;
//   return subbed;
// }

// function vecLength(v1)
// {
//   //var vecLen = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2) + Math.pow(v1.z, 2));
//   var vecLen = Math.sqrt( Math.pow(v1.x, 2) + Math.pow(v1.y, 2) );
//   return vecLen;
// }

// function processGesture(_array, start, end)
// {
//   //var vec1 = new vector(_array[start][0],_array[start][1],_array[start][2]);
//   var vec1 = new vector(_array[start][0],_array[start][1]);
//   //var vec2 = new vector(_array[end][0],_array[end][1],_array[end][2]);
//   var vec2 = new vector(_array[end][0],_array[end][1]);
//   var sub = vecSub(vec1, vec2);
//   var gestureLength = vecLength(sub);
//   return gestureLength;
// }

//------------------------------------

vector.prototype.normalize = function()
{
    var length = Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    this.x = this.x/length;
    this.y = this.y/length;
    this.z = this.z/length;
}

function vecSub(v1,v2)
{
  var subbed = new vector();
  subbed.x = v1.x - v2.x;
  subbed.y = v1.y - v2.y;
  subbed.z = v1.z - v2.z;
  return subbed;
}

function vecAdd(v1,v2)
{
  var added = new vector();
  added.x = v1.x + v2.x;
  added.y = v1.y + v2.y;
  added.z = v1.z + v2.z;
  return added;
}

function vecDivide(v1,n)
{
  var divided = new vector();
  divided.x = v1.x / n;
  divided.y = v1.y / n;
  divided.z = v1.z / n;
  return divided;
}

function vecLength(v1)
{
  //var vecLen = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2) + Math.pow(v1.z, 2));
  let vecLen = Math.sqrt( Math.pow(v1.x, 2) + Math.pow(v1.y, 2) + Math.pow(v1.z, 2) );
  return vecLen;
}

function vecCross(v1, v2)
{
  let cross1 = (v1.y * v2.z - v1.z * v2.y);
  let cross2 = (v1.z * v2.x - v1.x * v2.z);
  let cross3 = (v1.x * v2.y - v1.y * v2.x);
  var cross = new vector(cross1, cross2, cross3);
  //norm = Math.sqrt(Math.pow(cross[0], 2) + Math.pow(cross[1], 2) + Math.pow(cross[2], 2));
  //return [cross[0] / norm, cross[1] / norm, cross[2] / norm];
  return cross;
}

function processGesture(_array, start, end)
{
  var vec1 = new vector(..._array[start]);
  var vec2 = new vector(..._array[end]);

  var sub = vecSub(vec1, vec2);
  var gestureLength = vecLength(sub);
  return gestureLength;
}

function getOrientation(v1, v2, v3)
{
  var vec1 = vecSub(v2, v1);
  var vec2 = vecSub(v3, v1);
  var unitZ = vecCross(vec1, vec2);
  unitZ.normalize();
  var unitX = vecSub(vecDivide(vecAdd(v1,v2), 2),v3);
  unitX.normalize();
  var unitY = vecCross(unitZ, unitX);

  var pitch = Math.atan2(-unitZ.y, unitZ.z);
  pitch /= Math.PI;
  var yaw = Math.asin(unitZ.x);
  var roll = Math.atan2(unitY.x, unitX.x);

  return { pitch, yaw, roll };
}

//------------------------------------

function drawPath(ctx, points, closePath)
{
  ctx.fillStyle = _fillColour;
  ctx.strokeStyle = _strokeColour;
  const region = new Path2D();
  region.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point[0], point[1]);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera()
{
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		throw new Error(
			"Browser API navigator.mediaDevices.getUserMedia not available");
	}

	const video = document.getElementById("video");
	video.width = videoWidth;
	video.height = videoHeight;

	const mobile = isMobile();
	const stream = await navigator.mediaDevices.getUserMedia({
		"audio": false,
		"video": {
			facingMode: "user",
			width: mobile ? undefined : videoWidth,
			height: mobile ? undefined : videoHeight
		}
	});
	video.srcObject = stream;

	return new Promise((resolve) => {
		video.onloadedmetadata = () => {
			resolve(video);
		};
	});
}

async function changeVideoSource(newDevice)
{
	const video = document.getElementById("video");
	video.srcObject = null;
	const mobile = isMobile();
	const stream = await navigator.mediaDevices.getUserMedia({
		"audio": false,
		"video": {
			facingMode: "user",
			width: mobile ? undefined : videoWidth,
			height: mobile ? undefined : videoHeight,
			deviceId: newDevice
		}
	});
	video.srcObject = stream;
}

async function loadVideo()
{
	const video = await setupCamera();
	video.play();

	return video;
}

async function listVideoDevices()
{
	const allDevices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = allDevices.filter(device => device.kind === "videoinput").map(device => device.label);
	return videoDevices;
}

const guiState =
{
	devices: {
		videoDevices: []
	},
  backend: store.get("storeBackend"),
  input: {
    maxFaces: store.get("storemaxFaces"),
    maxContinuousChecks: store.get("storemaxContinuousChecks"),
    detectionConfidence: store.get("storedetectionConfidence"),
    iouThreshold: store.get("storeiouThreshold"),
    scoreThreshold: store.get("storescoreThreshold")
  },
	output: {
    showBoundingBox: true,
    showVideo: true,
    drawPoints: true,
    triangulateMesh: store.get("storetriangulateMesh")
	},
	net: null
};

/**
 * Sets up dat.gui controller on the top-right of the window
 */
async function setupGui(cameras, net)
{
	guiState.net = net;
	if (cameras.length > 0) {
		guiState.camera = cameras[0].deviceId;
	}

	const gui = new dat.GUI({width: 300});


	let devices = gui.addFolder("Devices");
	const videoDevices = await listVideoDevices();
	const videoDeviceController = devices.add(guiState.devices, "videoDevices", videoDevices);

	videoDeviceController.onChange(async function (selectedDevice)
  {
		const allDevices = await navigator.mediaDevices.enumerateDevices();
		const matchedDeviceId = allDevices.filter(device => device.label === selectedDevice).map(device => device.deviceId);
    changeVideoSource(matchedDeviceId);
	});

  gui.add(guiState, 'backend', ['wasm', 'webgl', 'cpu'])
    .onChange(async backend => {
      store.set("storeBackend", backend);
      await tf.setBackend(backend);
    });

  let input = gui.addFolder("Input");

  input.add(guiState.input, 'maxFaces').min(1).max(10).onChange(async val => {
    store.set("storemaxFaces", val);
    guiState.net = await facemesh.load({maxFaces: val});
  });

  // Params from https://github.com/tensorflow/tfjs-models/tree/master/handpose
  // - maxContinuousChecks
  // - How many frames to go without running the bounding box detector. Defaults to infinity.
  // - Set to a lower value if you want a safety net in case the mesh detector produces consistently flawed predictions.
  input.add(guiState.input, "maxContinuousChecks", [60, 120, 240, 480, 960]).onChange(async val => {
    //guiState.net.dispose();
    store.set("storemaxContinuousChecks", Number(val));
    guiState.net = await handpose.load({maxContinuousChecks: Number(val)});
  });
  // - detectionConfidence
  // - Threshold for discarding a prediction. Defaults to 0.8.
  input.add(guiState.input, "detectionConfidence").min(0.2).max(1.0).onChange(async val => {
    //guiState.net.dispose();
    store.set("storedetectionConfidence", val);
    guiState.net = await handpose.load({detectionConfidence: val});
  });
  // - iouThreshold
  // - A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression.
  // - Must be between [0, 1]. Defaults to 0.3.
  input.add(guiState.input, "iouThreshold").min(0.2).max(1.0).onChange(async val => {
    //guiState.net.dispose();
    store.set("storeiouThreshold", val);
    guiState.net = await handpose.load({iouThreshold: val});
  });
  // - scoreThreshold
  // - A threshold for deciding when to remove boxes based on score in non-maximum suppression. Defaults to 0.75.
  input.add(guiState.input, "scoreThreshold").min(0.2).max(1.0).onChange(async val => {
    //guiState.net.dispose();
    store.set("storescoreThreshold", val);
    guiState.net = await handpose.load({scoreThreshold: val});
  });
  input.close();

	let output = gui.addFolder("Output");
	output.add(guiState.output, "showVideo");
  output.add(guiState.output, "showBoundingBox");
  output.add(guiState.output, "drawPoints");
  output.add(guiState.output, 'triangulateMesh').onChange(async val => {
    //guiState.net.dispose();
    store.set("storetriangulateMesh", val);
  });
  output.addColor(palette, 'fillColour').onChange(async val => {
    _fillColour = val;
    store.set("storehand_fillColour", val);
  });
  output.addColor(palette, 'strokeColour').onChange(async val => {
    _strokeColour = val;
    store.set("storehand_strokeColour", val);
  });
	output.open();

}

/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS()
{
	stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);
}


function detectFaces(video, net)
{
  video.addEventListener('loadeddata', function() {
     // Video is loaded and can be played
  	const canvas = document.getElementById("output");
  	const ctx = canvas.getContext("2d");
  	// since images are being fed from a webcam
  	const flipHorizontal = true;

  	canvas.width = videoWidth;
  	canvas.height = videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.lineWidth = 0.5;

    async function renderPrediction()
    {
  		// Begin monitoring code for frames per second
  		if (statsShow) stats.begin();

  		ctx.clearRect(0, 0, videoWidth, videoHeight);

  		if (guiState.output.showVideo)
      {
  		  //ctx.save();
        //ctx.scale(-1, 1);
        //ctx.translate(-videoWidth, 0);
  			ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  			//ctx.restore();
  		}

      const predictions = await guiState.net.estimateFaces(video);
      let facemeshDict = {};

      if (predictions.length > 0)
      {
        predictions.forEach(prediction => {
          const keypoints = prediction.scaledMesh;

          if (guiState.output.triangulateMesh) {
            for (let i = 0; i < TRIANGULATION.length / 3; i++) {
              const points = [
                TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
                TRIANGULATION[i * 3 + 2]
              ].map(index => keypoints[index]);
              drawPath(ctx, points, true);
            }
          }

          if (guiState.output.drawPoints) {
            for (let i = 0; i < keypoints.length; i++) {
              const x = keypoints[i][0];
              const y = keypoints[i][1];
              ctx.beginPath();
              ctx.fillStyle = _fillColour;
              ctx.strokeStyle = _strokeColour;
              ctx.arc(x, y, 1, 0, 2 * Math.PI);
              ctx.fill();
            }
          }

          const annotations = prediction.annotations;

          facemeshDict["faceInViewConfidence"] = prediction.faceInViewConfidence;
          facemeshDict["boundingBox"] = prediction.boundingBox;
          if (guiState.output.showBoundingBox) {
            ctx.beginPath();
            ctx.rect(prediction.boundingBox.topLeft[0][0], prediction.boundingBox.topLeft[0][1], (prediction.boundingBox.bottomRight[0][0] - prediction.boundingBox.topLeft[0][0]), (prediction.boundingBox.bottomRight[0][1] - prediction.boundingBox.topLeft[0][1]) );
            ctx.stroke();
          }

          //facemeshDict["mesh"] = {};
          //prediction.mesh.forEach(([value1, value2, value3], idx) => facemeshDict["mesh"][idx] = [value1, value2, value3]);

          facemeshDict["scaledMesh"] = { keypoints };
          //facemeshDict["scaledMesh"] = {};
          //prediction.scaledMesh.forEach(([value1, value2, value3], idx) => facemeshDict["scaledMesh"][idx] = [value1, value2, value3]);

          facemeshDict["annotations"] = {};

          for (var key in annotations)
          {
            // check if the property/key is defined in the object itself, not in parent
            if (annotations.hasOwnProperty(key))
            {
              facemeshDict["annotations"][key] = {};
              annotations[key].forEach(([value1, value2, value3], idx) => facemeshDict["annotations"][key][idx] = [value1, value2, value3]);
            }
          }

          facemeshDict["rawPoints"] = [];
          prediction.scaledMesh.forEach(([value1, value2, value3]) => facemeshDict["rawPoints"].push(value1, value2, value3));


          const leftCheek = annotations["leftCheek"][0];
          const rightCheek = annotations["rightCheek"][0];
          const chin = prediction.scaledMesh[200];
          const noseTip = prediction.scaledMesh[4];

          facemeshDict["pose"] = {};
          var position = [ ((prediction.boundingBox.topLeft[0][0] + prediction.boundingBox.bottomRight[0][0]) / 2), ((prediction.boundingBox.topLeft[0][1] + prediction.boundingBox.bottomRight[0][1]) / 2) ];
          //facemeshDict["pose"] = { position };
          ctx.beginPath();
          ctx.fillStyle = _fillColour;
          ctx.strokeStyle = _strokeColour;
          ctx.arc(position[0], position[1], 1, 0, 2 * Math.PI);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(leftCheek[0], leftCheek[1], 2, 0, 2 * Math.PI);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(rightCheek[0], rightCheek[1], 2, 0, 2 * Math.PI);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(chin[0], chin[1], 2, 0, 2 * Math.PI);
          ctx.fill();


          var scale = processGesture(prediction.scaledMesh, 10, 152);
          var p1 = new vector(...chin);
          var p2 = new vector(...leftCheek);
          var p3 = new vector(...rightCheek);

          var orientation = getOrientation(p1, p2, p3);

          facemeshDict["pose"] = { position, scale, orientation };

          facemeshDict["gestures"] = {};
          /// left to right of mouth
          var mouthWidth = processGesture(prediction.scaledMesh, 78, 308) / scale;
          facemeshDict["gestures"]["mouthWidth"] = [mouthWidth];
          // top to bottom of inner mouth
          var mouthHeight = processGesture(prediction.scaledMesh, 13, 14) / scale;
          facemeshDict["gestures"]["mouthHeight"] = [mouthHeight];
          // center of the eye to middle of eyebrow
          var leftEyeBrow = processGesture(prediction.scaledMesh, 159, 105) / scale;
          facemeshDict["gestures"]["leftEyeBrow"] = [leftEyeBrow];
          // center of the eye to middle of eyebrow
          var rightEyeBrow = processGesture(prediction.scaledMesh, 386, 334) / scale;
          facemeshDict["gestures"]["rightEyeBrow"] = [rightEyeBrow];
          // upper inner eye to lower outer eye~
          var rightEye = processGesture(prediction.scaledMesh, 386, 374) / scale;
          facemeshDict["gestures"]["rightEye"] = [rightEye];
          // upper inner eye to lower outer eye~
          var leftEye = processGesture(prediction.scaledMesh, 159, 145) / scale;
          facemeshDict["gestures"]["leftEye"] = [leftEye];
          // nose center to chin center~
          var jawOpenness = processGesture(prediction.scaledMesh, 1, 200) / scale;
          facemeshDict["gestures"]["jawOpenness"] = [jawOpenness];
          // left side of nose to right side of nose~
          var nostrilFlare = processGesture(prediction.scaledMesh, 64, 294) / scale;
          facemeshDict["gestures"]["nostrilFlare"] = [nostrilFlare];

        });


        //send formatted vals to MaxMSP
        //sendToMaxPatch(predictions[0]);
        sendToMaxPatch(facemeshDict);
      }

  		if (statsShow) stats.end();

  		requestAnimationFrame(renderPrediction);
  	}

  	renderPrediction();
  }, false);
}

/**
 * Kicks off the demo by loading the facemesh model, finding and loading
 * available camera devices, and setting off the detectFaces function.
 */
async function bindPage()
{
  await tf.setBackend(guiState.backend);
  const net = await facemesh.load({maxFaces: guiState.maxFaces, flipHorizontal: true});

	document.getElementById("loading").style.display = "none";
	document.getElementById("main").style.display = "block";

	let video;

	try {
		video = await loadVideo();
	} catch (e) {
		let info = document.getElementById("info");
		info.textContent = "this browser does not support video capture," +
        "or this device does not have a camera";
		info.style.display = "block";
		throw e;
	}

	setupGui([], net);
	if (statsShow) setupFPS();
  detectFaces(video, net);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();

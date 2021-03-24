const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const buttonGrayscale = document.getElementById('button-grayscale');
const buttonBoxBlur = document.getElementById('button-box-blur');
const buttonGaussianBlur = document.getElementById('button-gaussian-blur');
const buttonSharpen = document.getElementById('button-sharpen');
const buttonSobelOperator = document.getElementById('button-sobel-operator');
const buttonLaplacianOperator = document.getElementById(
  'button-laplacian-operator'
);
const buttonMedianFilter = document.getElementById('button-median-filter');
const buttonMerge = document.getElementById('button-merge');
const buttonReset = document.getElementById('button-reset');
const buttonNegative = document.getElementById('button-negative');
const sliderGamma = document.getElementById('slider-gamma');

const img = new Image();
const albert = new Image();
const marilyn = new Image();

const matrices = {
  boxBlur: {
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    matrixMultiply: 1 / 9,
  },
  gaussianBlur: {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
    matrixMultiply: 1 / 16,
  },
  sobelOperatorX: {
    matrix: [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ],
    matrixMultiply: 1,
  },
  sobelOperatorY: {
    matrix: [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ],
    matrixMultiply: 1,
  },
  laplacianOperator: {
    matrix: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    matrixMultiply: 1,
  },
  sharpen: {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    matrixMultiply: 1,
  },
};

function loadImage() {
  img.src = 'img/portret.jpg';
  albert.src = 'img/albert.jpg';
  marilyn.src = 'img/marilyn.jpg';

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
  };
}

function toGrayscale(image) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const red = imgData.data[i];
    const green = imgData.data[i + 1];
    const blue = imgData.data[i + 2];

    const grayscale = red * 0.299 + green * 0.587 + blue * 0.114;

    imgData.data[i] = grayscale;
    imgData.data[i + 1] = grayscale;
    imgData.data[i + 2] = grayscale;
  }

  ctx.putImageData(imgData, 0, 0);
}

loadImage();

buttonGrayscale.onclick = () => {
  toGrayscale(img);
};

buttonNegative.onclick = () => {
  toNegative(img);
};

buttonBoxBlur.onclick = () => {
  applyMatrix(img, matrices.boxBlur);
};

buttonGaussianBlur.onclick = () => {
  applyMatrix(img, matrices.gaussianBlur);
};

buttonSobelOperator.onclick = () => {
  toGrayscale(img);
  applyMatrix(img, matrices.sobelOperatorY);
};

buttonLaplacianOperator.onclick = () => {
  toGrayscale(img);
  applyMatrix(img, matrices.laplacianOperator);
};

buttonSharpen.onclick = () => {
  applyMatrix(img, matrices.sharpen);
};

buttonMedianFilter.onclick = () => {
  applyMedian(img);
};

buttonMerge.onclick = () => {
  applyAlpha(img, 10);
};

buttonReset.onclick = () => {
  loadImage();
};

function applyMatrix(image, matrix) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  const imgDataCopy = ctx.getImageData(0, 0, image.width, image.height);
  for (let x = 1; x < image.width - 1; x++) {
    for (let y = 1; y < image.height - 1; y++) {
      const index = x * 4 + y * image.width * 4;

      const sumRed =
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4] *
          matrix.matrix[0][0] + // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4] *
          matrix.matrix[0][1] + // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4] *
          matrix.matrix[0][2] + // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4] *
          matrix.matrix[1][0] + // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4] *
          matrix.matrix[1][1] + // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4] *
          matrix.matrix[1][2] + // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4] *
          matrix.matrix[2][0] + // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4] *
          matrix.matrix[2][1] + // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4] *
          matrix.matrix[2][2]; // Low right

      const sumGreen =
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4 + 1] *
          matrix.matrix[0][0] + // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4 + 1] *
          matrix.matrix[0][1] + // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4 + 1] *
          matrix.matrix[0][2] + // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4 + 1] *
          matrix.matrix[1][0] + // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4 + 1] *
          matrix.matrix[1][1] + // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4 + 1] *
          matrix.matrix[1][2] + // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4 + 1] *
          matrix.matrix[2][0] + // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4 + 1] *
          matrix.matrix[2][1] + // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 1] *
          matrix.matrix[2][2]; // Low right

      const sumBlue =
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4 + 2] *
          matrix.matrix[0][0] + // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4 + 2] *
          matrix.matrix[0][1] + // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4 + 2] *
          matrix.matrix[0][2] + // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4 + 2] *
          matrix.matrix[1][0] + // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4 + 2] *
          matrix.matrix[1][1] + // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4 + 2] *
          matrix.matrix[1][2] + // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4 + 2] *
          matrix.matrix[2][0] + // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4 + 2] *
          matrix.matrix[2][1] + // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 2] *
          matrix.matrix[2][2]; // Low right

      imgDataCopy.data[index] = sumRed * matrix.matrixMultiply;
      imgDataCopy.data[index + 1] = sumGreen * matrix.matrixMultiply;
      imgDataCopy.data[index + 2] = sumBlue * matrix.matrixMultiply;
    }
  }
  ctx.putImageData(imgDataCopy, 0, 0);
}

function applyMedian(image) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  const imgDataCopy = ctx.getImageData(0, 0, image.width, image.height);
  for (let x = 1; x < image.width - 1; x++) {
    for (let y = 1; y < image.height - 1; y++) {
      const index = x * 4 + y * image.width * 4;

      const arrRed = [
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4], // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4], // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4], // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4], // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4], // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4], // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4], // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4], // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4], // Low right
      ];

      const arrGreen = [
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4 + 1], // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4 + 1], // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4 + 1], // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4 + 1], // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4 + 1], // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4 + 1], // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4 + 1], // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4 + 1], // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 1], // Low right
      ];

      const arrBlue = [
        imgData.data[(x - 1) * 4 + (y - 1) * image.width * 4 + 2], // Top left
        imgData.data[(x + 0) * 4 + (y - 1) * image.width * 4 + 2], // Top center
        imgData.data[(x + 1) * 4 + (y - 1) * image.width * 4 + 2], // Top right
        imgData.data[(x - 1) * 4 + (y + 0) * image.width * 4 + 2], // Mid left
        imgData.data[(x + 0) * 4 + (y + 0) * image.width * 4 + 2], // Current pixel
        imgData.data[(x + 1) * 4 + (y + 0) * image.width * 4 + 2], // Mid right
        imgData.data[(x - 1) * 4 + (y + 1) * image.width * 4 + 2], // Low left
        imgData.data[(x + 0) * 4 + (y + 1) * image.width * 4 + 2], // Low center
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 2], // Low right
      ];

      arrRed.sort((a, b) => {
        return a - b;
      });

      arrGreen.sort((a, b) => {
        return a - b;
      });

      arrBlue.sort((a, b) => {
        return a - b;
      });

      imgDataCopy.data[index] = arrRed[4];
      imgDataCopy.data[index + 1] = arrGreen[4];
      imgDataCopy.data[index + 2] = arrBlue[4];
    }
  }
  ctx.putImageData(imgDataCopy, 0, 0);
}

function applyAlpha(image, alpha) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i + 3] = alpha;
  }

  ctx.putImageData(imgData, 0, 0);
}

function toNegative(image) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const red = imgData.data[i];
    const green = imgData.data[i + 1];
    const blue = imgData.data[i + 2];

    imgData.data[i] = 255 - red;
    imgData.data[i + 1] = 255 - green;
    imgData.data[i + 2] = 255 - blue;
  }

  ctx.putImageData(imgData, 0, 0);
}

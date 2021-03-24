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
const gammaValue = document.getElementById('gamma-value');
const buttonGammaApply = document.getElementById('button-gamma-apply');

const redValue = document.getElementById('red-value');
const greenValue = document.getElementById('green-value');
const blueValue = document.getElementById('blue-value');
const sliderColorRed = document.getElementById('slider-color-red');
const sliderColorGreen = document.getElementById('slider-color-green');
const sliderColorBlue = document.getElementById('slider-color-blue');
const buttonColorApply = document.getElementById('button-color-apply');

const thresholdValue = document.getElementById('threshold-value');
const sliderThreshold = document.getElementById('slider-threshold');
const buttonThresholdApply = document.getElementById('button-threshold-apply');

const img = new Image();
const albert = new Image();
const marilyn = new Image();

const matrices = {
  boxBlur: {
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    matrixMultiply: 1 / 9
  },
  gaussianBlur: {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    matrixMultiply: 1 / 16
  },
  sobelOperatorX: {
    matrix: [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1]
    ],
    matrixMultiply: 1
  },
  sobelOperatorY: {
    matrix: [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ],
    matrixMultiply: 1
  },
  laplacianOperator: {
    matrix: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1]
    ],
    matrixMultiply: 1
  },
  sharpen: {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
    matrixMultiply: 1
  }
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

sliderGamma.oninput = () => {
  gammaValue.innerHTML = `𝛾 = ${sliderGamma.value}`;
};

sliderColorRed.oninput = () => {
  redValue.innerHTML = `Red: ${Math.round(sliderColorRed.value * 100)}%`;
};

sliderColorGreen.oninput = () => {
  greenValue.innerHTML = `Green: ${Math.round(sliderColorGreen.value * 100)}%`;
};

sliderColorBlue.oninput = () => {
  blueValue.innerHTML = `Blue: ${Math.round(sliderColorBlue.value * 100)}%`;
};

buttonColorApply.onclick = () => {
  adjustColorBalance(
    img,
    sliderColorRed.value,
    sliderColorGreen.value,
    sliderColorBlue.value
  );
};

buttonGammaApply.onclick = () => {
  correctGamma(img, sliderGamma.value);
};

sliderThreshold.oninput = () => {
  thresholdValue.innerHTML = `Threshold level: ${sliderThreshold.value}`;
};

buttonThresholdApply.onclick = () => {
  toGrayscale(img);
  adjustThreshold(img, sliderThreshold.value);
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
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4] // Low right
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
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 1] // Low right
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
        imgData.data[(x + 1) * 4 + (y + 1) * image.width * 4 + 2] // Low right
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

function correctGamma(image, gamma) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  const gammaCorrection = 1 / gamma;
  for (let i = 0; i < imgData.data.length; i += 4) {
    const red = imgData.data[i];
    const green = imgData.data[i + 1];
    const blue = imgData.data[i + 2];

    imgData.data[i] = 255 * Math.pow(red / 255, gammaCorrection);
    imgData.data[i + 1] = 255 * Math.pow(green / 255, gammaCorrection);
    imgData.data[i + 2] = 255 * Math.pow(blue / 255, gammaCorrection);
  }

  ctx.putImageData(imgData, 0, 0);
}

function adjustColorBalance(image, redValue, greenValue, blueValue) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const red = imgData.data[i];
    const green = imgData.data[i + 1];
    const blue = imgData.data[i + 2];

    imgData.data[i] = red + red * redValue;
    imgData.data[i + 1] = green + green * greenValue;
    imgData.data[i + 2] = blue + blue * blueValue;
  }

  ctx.putImageData(imgData, 0, 0);
}

function adjustThreshold(image, level) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i] >= level) {
      imgData.data[i] = 255;
      imgData.data[i + 1] = 255;
      imgData.data[i + 2] = 255;
    } else {
      imgData.data[i] = 0;
      imgData.data[i + 1] = 0;
      imgData.data[i + 2] = 0;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

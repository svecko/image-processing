const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const buttonGrayscale = document.getElementById("button-grayscale");
const buttonBoxBlur = document.getElementById("button-box-blur");
const buttonGaussianBlur = document.getElementById("button-gaussian-blur");
const buttonSharpen = document.getElementById("button-sharpen");
const buttonSobelOperator = document.getElementById("button-sobel-operator");
const buttonLaplacianOperator = document.getElementById(
  "button-laplacian-operator"
);

const img = new Image();

function loadImage() {
  img.src = "img/portret.jpg";

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

buttonBoxBlur.onclick = () => {
  const boxBlurMatrix = {
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    matrixMultiply: 1 / 9,
  };
  applyMatrix(img, boxBlurMatrix);
};

buttonGaussianBlur.onclick = () => {
  const gaussianBlurMatrix = {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
    matrixMultiply: 1 / 16,
  };
  applyMatrix(img, gaussianBlurMatrix);
};

buttonSobelOperator.onclick = () => {
  const sobelOperatorMatrixX = {
    matrix: [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ],
    matrixMultiply: 1,
  };
  const sobelOperatorMatrixY = {
    matrix: [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ],
    matrixMultiply: 1,
  };
  toGrayscale(img);
  applyMatrix(img, sobelOperatorMatrixX);
};

buttonLaplacianOperator.onclick = () => {
  const laplacianOperatorMatrix = {
    matrix: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    matrixMultiply: 1,
  };
  toGrayscale(img);
  applyMatrix(img, laplacianOperatorMatrix);
};

buttonSharpen.onclick = () => {
  const sharpenMatrix = {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    matrixMultiply: 1,
  };
  applyMatrix(img, sharpenMatrix);
};

function applyMatrix(image, matrix) {
  const imgData = ctx.getImageData(0, 0, image.width, image.height);
  const imgData1 = ctx.getImageData(0, 0, image.width, image.height);
  for (let x = 1; x < image.width - 1; x++) {
    for (let y = 1; y < image.height - 1; y++) {
      const index = x * 4 + y * image.width * 4;

      let sumRed =
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

      let sumGreen =
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

      let sumBlue =
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

      imgData1.data[index] = sumRed * matrix.matrixMultiply;
      imgData1.data[index + 1] = sumGreen * matrix.matrixMultiply;
      imgData1.data[index + 2] = sumBlue * matrix.matrixMultiply;
    }
  }
  ctx.putImageData(imgData1, 0, 0);
}

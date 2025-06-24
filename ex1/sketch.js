let allImages = [];
let sourGummyFont;

let colorOptions = [
  "#FFE700", "#0786B2", "#D1009D", "#3DF59F", "#D83131",
  "#FFD3B4", "#F6F1D1", "#A3D2CA", "#5EAAA8", "#056676",
  "#F67280", "#C06C84", "#6C5B7B", "#355C7D", "#99B898",
  "#FF847C", "#E84A5F", "#2A363B", "#FECEAB", "#45ADA8",
  "#9DE0AD", "#E5FCC2", "#E3DFBA", "#CBE86B", "#1C140D",
  "#EF6F6C", "#D9BF77", "#92A8D1", "#DDDDDD", "#FCF4D9"
];

let wordOptions = [
  "Bloom", "Drift", "Whisper", "Fragment", "Horizon",
  "Shadow", "Pulse", "Glimmer", "Dream", "Serene",
  "Wild", "Soft", "Bold", "Shattered", "Lush",
  "Vivid", "Blurred", "Crisp", "Melt", "Ripple",
  "Rise", "Fade", "Tangle", "Float", "Spark",
  "Flow", "Crush", "Stretch", "Whirl", "Chime",
  "Gaze", "Flicker", "Hover", "Slide", "Trace",
  "Crackle", "Echo", "Snap", "Wander", "Nest"
];

let noGoRules = {
  "Soft": "Avoid harsh lines or strong contrast.",
  "Bold": "Avoid muted tones or thin lines.",
  "Organic": "No rigid geometric forms.",
  "Playful": "Avoid monochrome or dull palettes.",
  "Minimal": "Limit busy textures."
};

function preload() {
  // Load all images
  for (let i = 1; i <= 30; i++) {
    allImages.push(loadImage(`assets/images/${i}.jpg`));
  }

  // Load the font
  sourGummyFont = loadFont('assets/fonts/SourGummy-Regular.ttf');
}

function setup() {
  createCanvas(800, 600); // Dummy size, will be resized dynamically
  noLoop();

  const moodSelect = document.getElementById('mood');
  const imgCountInput = document.getElementById('imgCount');
  const colorCountInput = document.getElementById('colorCount');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  generateBtn.addEventListener('click', () => {
    const mood = moodSelect.value;
    const imgCount = parseInt(imgCountInput.value);
    const colorCount = parseInt(colorCountInput.value);
    generatePrompt(mood, imgCount, colorCount);
  });

  downloadBtn.addEventListener('click', () => {
    saveCanvas('moodboard', 'png');
  });

  // Auto-generate moodboard on load
  const defaultMood = moodSelect.value || "Bold";     
  const defaultImgCount = parseInt(imgCountInput.value) || 3;
  const defaultColorCount = parseInt(colorCountInput.value) || 5;

  generatePrompt(defaultMood, defaultImgCount, defaultColorCount);
}


function generatePrompt(mood, imgCount, colorCount) {
  // Canvas Dimensions
  let boardW = min(windowWidth * 0.9, 1000);
  let usableW = boardW * 0.9;
  let imgW = (usableW - (imgCount - 1) * 10) / imgCount;
  let imgH = imgW * (4 / 3);
  let titleH = 140;
  let swatchH = 40;
  let boardH = titleH + imgH + swatchH + 95;

  resizeCanvas(boardW, boardH, 20);
  clear();
  background(240);

  let boardX = 0;
  let boardY = 0;

  // Shadow
  push();
  noStroke();
  fill(0, 25);
  rect(boardX + 8, boardY + 8, boardW, boardH - 20, 20);
  pop();

  // Card background
  fill('#FAF5EF');
  stroke(200);
  strokeWeight(2);
  rect(boardX, boardY, boardW, boardH, 15);

  // Use custom font
  textFont(sourGummyFont);
  textAlign(CENTER, TOP);
  noStroke();
  fill(0);

  let randomWord = random(wordOptions);

  textSize(boardW * 0.045);
  text(`Mood: ${mood}`, boardW / 2, boardY + 20);

  textSize(boardW * 0.035);
  text(`Word: ${randomWord}`, boardW / 2, boardY + 80);

  if (noGoRules[mood]) {
    textSize(boardW * 0.025);
    fill(50);
    text(`No-go: ${noGoRules[mood]}`, boardW / 2, boardY + boardH - 50);
  }

  // Images
  const selectedImages = shuffle(allImages).slice(0, imgCount);
  const padding = 10;
  const startX = (boardW - (imgW * imgCount + padding * (imgCount - 1))) / 2;
  const yOffset = boardY + titleH;

  for (let i = 0; i < selectedImages.length; i++) {
    let x = startX + i * (imgW + padding);
    image(selectedImages[i], x, yOffset, imgW, imgH);
  }

  // Color swatches
  const palette = shuffle(colorOptions).slice(0, colorCount);
  const swatchPadding = 12; // spacing between edge and first swatch
  const totalSpacing = swatchPadding * (palette.length + 1);
  const swatchW = (boardW - totalSpacing) / palette.length;
  const swatchY = boardY + titleH + imgH + 30;

  for (let i = 0; i < palette.length; i++) {
    let x = swatchPadding + i * (swatchW + swatchPadding);
    fill(palette[i]);
    stroke(100);
    rect(x, swatchY, swatchW, swatchH, 6);
  }
}

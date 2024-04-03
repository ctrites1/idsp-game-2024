const canvas = document.querySelector("#test-canvas");

if (canvas) {
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "blue";
    context.fillRect(10, 10, 400, 400);
    context.fill();
  }
}

const userInteract = () => {
  return true;
};

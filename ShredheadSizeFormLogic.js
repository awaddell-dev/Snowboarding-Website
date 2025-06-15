document.addEventListener('DOMContentLoaded', () => {
  const sizeForm = document.getElementById('sizeForm');
  const result = document.getElementById('result');

  if (sizeForm) {
    sizeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const height = parseFloat(document.getElementById('height').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const style = document.getElementById('style').value;

      if (
        isNaN(height) || height < 48 || height > 84 ||
        isNaN(weight) || weight < 70 || weight > 300
      ) {
        result.textContent = "Please enter a valid height (48–84 inches) and weight (70–300 lbs).";
        return;
      }

      let baseLength = height * 2.1;

      if (weight < 150) {
        baseLength -= 5;
      } else if (weight <= 180) {
        // No change
      } else if (weight <= 200) {
        baseLength += 3;
      } else if (weight <= 220) {
        baseLength += 6;
      } else {
        baseLength += 9;
      }

      // Style adjustment
      switch (style) {
        case 'terrain-park':
          baseLength -= 7;
          break;
        case 'powder':
          baseLength += 5;
          break;
        case 'all-mountain':
          // no change
          break;
        default:
          result.textContent = "Please select a riding style.";
          return;
      }

      const finalLength = Math.round(baseLength);
      result.textContent = `Recommended snowboard length: ${finalLength} cm`;
    });
  }
});

  
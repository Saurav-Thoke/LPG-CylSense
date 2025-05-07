
const { parseISO, differenceInDays, addDays } = require("date-fns");

/**
 * Predicts the date when the cylinder will be empty based on historical weight data.
 * @param {Array} entries - List of cylinder tracking entries with `trackDate` and `cylinderWeight`
 * @returns {String|null} - Predicted date in "YYYY-MM-DD" format, or null if prediction isn't possible
 */
function predictEmptyDate(entries) {
  if (!entries || entries.length < 2) {
    console.warn("❗ Not enough data to predict");
    return null;
  }

  // Sanitize and filter valid entries
  const validEntries = entries.filter(entry => {
    if (!entry.trackDate || !entry.cylinderWeight) {
      console.warn("❌ Skipping invalid entry:", entry);
      return false;
    }
    return true;
  });

  if (validEntries.length < 2) {
    console.warn("❌ Not enough valid entries after filtering");
    return null;
  }

  // Sort entries by trackDate in ascending order
  validEntries.sort((a, b) => new Date(a.trackDate) - new Date(b.trackDate));

  const startDate = parseISO(validEntries[0].trackDate);
  if (isNaN(startDate)) {
    console.error("❌ Invalid start date:", validEntries[0].trackDate);
    return null;
  }

  // Prepare x (days since start) and y (weight) data
  const x = validEntries.map(e => differenceInDays(parseISO(e.trackDate), startDate));
  const y = validEntries.map(e => parseFloat(e.cylinderWeight));

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    console.warn("⚠️ Linear regression denominator is zero");
    return null;
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Predict day when weight reaches ~0kg (you can adjust threshold if needed)
  const predictedDay = (0 - intercept) / slope;
  if (isNaN(predictedDay) || predictedDay < 0) {
    console.warn("⚠️ Invalid predicted day:", predictedDay);
    return null;
  }

  const predictedDate = addDays(startDate, Math.round(predictedDay));
  const formattedDate = predictedDate.toISOString().split("T")[0];
  console.log("✅ Predicted Empty Date:", formattedDate);

  return formattedDate;
}

module.exports = { predictEmptyDate };

// const { LinearRegression } = require('ml-regression');
// const dayjs = require('dayjs');

// /**
//  * Predict the empty date from cylinder data.
//  * @param {Array} entries - Array of { trackDate: "YYYY-MM-DD", cylinderWeight }
//  * @param {number} threshold - Gas empty threshold in kg (default 2kg)
//  * @returns {string} - Predicted empty date in "YYYY-MM-DD" format
//  */
// function predictEmptyDate(entries, threshold = 2.0) {
//   const baseDate = dayjs(entries[0].trackDate);
//   const X = [];
//   const y = [];

//   entries.forEach(entry => {
//     const dayDiff = dayjs(entry.trackDate).diff(baseDate, 'day');
//     X.push([dayDiff]);
//     y.push(entry.cylinderWeight);
//   });

//   const model = new LinearRegression(X, y);
//   const slope = model.weights[1];
//   const intercept = model.weights[0];

//   const daysToEmpty = (threshold - intercept) / slope;
//   const predictedDate = baseDate.add(Math.round(daysToEmpty), 'day');

//   return predictedDate.format('YYYY-MM-DD');
// }

// module.exports = { predictEmptyDate };


// const { parseISO, differenceInDays, addDays } = require("date-fns");

// function predictEmptyDate(entries) {
//   if (!entries || entries.length < 2) return null;

//   entries.sort((a, b) => new Date(a.trackDate) - new Date(b.trackDate));
//   const startDate = parseISO(entries[0].trackDate);

//   const x = entries.map(e => differenceInDays(parseISO(e.trackDate), startDate));
//   const y = entries.map(e => parseFloat(e.cylinderWeight));

//   const n = x.length;
//   const sumX = x.reduce((a, b) => a + b, 0);
//   const sumY = y.reduce((a, b) => a + b, 0);
//   const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
//   const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

//   const denominator = (n * sumX2 - sumX * sumX);
//   if (denominator === 0) return null;

//   const slope = (n * sumXY - sumX * sumY) / denominator;
//   const intercept = (sumY - slope * sumX) / n;

//   // Predict day when weight becomes ~0 (or threshold like 1kg)
//   const predictedDay = (0 - intercept) / slope;

//   if (isNaN(predictedDay) || predictedDay < 0) return null;

//   const predictedDate = addDays(startDate, Math.round(predictedDay));
//   return predictedDate.toISOString().split("T")[0];
// }

// module.exports = { predictEmptyDate };


// const { parseISO, differenceInDays, addDays } = require("date-fns");

// function predictEmptyDate(entries) {
//   if (!entries || entries.length < 2) {
//     console.error("Not enough data to make a prediction.");
//     return null;
//   }

//   // Sort entries by trackDate in ascending order
//   entries.sort((a, b) => new Date(a.trackDate) - new Date(b.trackDate));

//   // Logging to check trackDate format
//   entries.forEach(entry => {
//     if (!entry.trackDate) {
//       console.error("trackDate is missing or undefined:", entry);
//     }
//   });

//   // Ensure trackDate format is correct
//   const startDate = parseISO(entries[0].trackDate);

//   // Ensure that the date is valid
//   if (isNaN(startDate)) {
//     console.error("Invalid start date:", entries[0].trackDate);
//     return null;
//   }

//   // Map the data for linear regression
//   const x = entries.map(e => differenceInDays(parseISO(e.trackDate), startDate)); // Days since the first entry
//   const y = entries.map(e => parseFloat(e.cylinderWeight)); // Cylinder weight

//   const n = x.length;
//   const sumX = x.reduce((a, b) => a + b, 0);
//   const sumY = y.reduce((a, b) => a + b, 0);
//   const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
//   const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

//   // Calculate the linear regression coefficients (slope and intercept)
//   const denominator = (n * sumX2 - sumX * sumX);
//   if (denominator === 0) {
//     console.error("Denominator is 0. Can't compute the linear regression.");
//     return null;
//   }

//   const slope = (n * sumXY - sumX * sumY) / denominator;
//   const intercept = (sumY - slope * sumX) / n;

//   // Log the slope and intercept for debugging
//   console.log("Slope:", slope);
//   console.log("Intercept:", intercept);

//   // Predict the day when the weight becomes ~0 (or a threshold like 1kg)
//   const predictedDay = (0 - intercept) / slope;

//   if (isNaN(predictedDay) || predictedDay < 0) {
//     console.error("Prediction is invalid. Predicted day is negative or NaN.");
//     return null;
//   }

//   const predictedDate = addDays(startDate, Math.round(predictedDay));

//   // Logging the result
//   console.log("Predicted Empty Date:", predictedDate.toISOString().split("T")[0]);

//   // Return the predicted date in ISO format (YYYY-MM-DD)
//   return predictedDate.toISOString().split("T")[0];
// }

// // Export the function to use it in other parts of your app
// module.exports = { predictEmptyDate };


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

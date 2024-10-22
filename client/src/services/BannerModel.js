// Client/Services/BannerModel.js
import themeData from '../data/themes.json';

//DL-SOA(Dynamic Layout Search and Optimization) Algorithm

const initialLayout = {
  fontSize: 18,
  fontStyle: 'Arial', // Default font style
  alignment: 'center',
  colors: ['#FFFFFF', '#000000'], // Default colors
  text: 'Sample Banner Text',
  purpose: 'advertisement', // Default purpose
  spacing: 20,
  backgroundColor: '#FFFFFF',
}; // Define the initial layout structure

// Function to get theme details from themes.json
export const getThemeDetails = (theme) => {
  const themeDetail = themeData.find(item => item.theme === theme);
  return themeDetail ? themeDetail : initialLayout; // Fallback to initial layout if theme not found
};

// Function to generate different shades of the specified color
const generateShades = (color, numShades) => {
  const shades = [];
  let colorInt = parseInt(color.replace('#', ''), 16);
  
  for (let i = 0; i < numShades; i++) {
    colorInt = (colorInt + 0x111111) % 0xFFFFFF; // Slightly adjust color
    shades.push(`#${colorInt.toString(16).padStart(6, '0')}`);
  }
  
  return shades;
};

// Update the applyUserInputs function
const applyUserInputs = (layout, userInputs) => {
  console.log("Applying user inputs to the layout...");

  const updatedLayout = {
    ...layout,
    fontSize: userInputs.fontSize || layout.fontSize,
    text: userInputs.text || layout.text,
    purpose: userInputs.purpose || layout.purpose,
    colors: userInputs.colors || layout.colors,
    alignment: userInputs.alignment || layout.alignment,
    backgroundColor: userInputs.backgroundColor || layout.backgroundColor, // Use user input background color
    fontStyle: userInputs.fontStyle || layout.fontStyle,  
  };

  console.log("Updated Layout with User Inputs: ", updatedLayout);
  return updatedLayout;
};

// Evaluate layout scores based on metrics
const evaluateLayout = (currentLayout, userInputs, userHistory) => {
  let score = 0;

  // Calculate scores based on aesthetic metrics, engagement metrics, etc.
  score += aestheticScore(currentLayout);
  score += engagementScore(currentLayout, userHistory);

  return score;
};

const logLayoutDecision = (currentLayout, score) => {
  // Log layout decision for interpretability
  console.log(`Layout: ${JSON.stringify(currentLayout)}, Score: ${score}`);
};

const aestheticScore = (layout) => {
  let score = 0;

  // Reward good color harmony (placeholder logic)
  if (layout.colors && isColorHarmonious(layout.colors)) {
    score += 20; // Higher score for harmonious colors
  }

  // Reward proper spacing between elements
  if (layout.spacing && layout.spacing > 10 && layout.spacing < 30) {
    score += 10;
  }

  // Reward aligned elements (e.g., all text and images aligned to center)
  if (layout.alignment && layout.alignment === 'center') {
    score += 15;
  }

  // Reward font readability
  if (layout.fontSize && layout.fontSize >= 16 && layout.fontSize <= 24) {
    score += 10;
  }

  return score;
};

// Helper function for color harmony
const isColorHarmonious = (colors) => {
  // Example logic: colors should be complementary or analogous
  return true; // Simplifying for this case: Assume it's always harmonious
};

// Engagement scoring based on how engaging or effective the layout is
const engagementScore = (layout, userHistory) => {
  let score = 0;

  // Reward readability (short text is usually better for banners)
  if (layout.text && layout.text.length < 50) {
    score += 20;
  }

  // Reward past layouts with high feedback scores from the user
  if (userHistory.layoutFeedback) {
    const avgFeedback = userHistory.layoutFeedback.reduce((acc, val) => acc + val, 0) / userHistory.layoutFeedback.length;
    score += avgFeedback * 10; // Boost score based on user history
  }

  // Reward clear call to action (if the layout has buttons or promotional elements)
  if (layout.purpose && layout.purpose.includes("off")) {
    score += 10; // Promotional banners with offers are usually high engagement
  }

  return score;
};

// Updated generateNeighborLayouts to use color shades
const generateNeighborLayouts = (currentLayout) => {
  const neighborLayouts = [];

  // Define the alignments in the order you want
  const alignments = ['left', 'center', 'right'];

  // Generate variations of the user-specified background color
  const colorShades = generateShades(currentLayout.backgroundColor, 4);
  colorShades.forEach((bgColor) => {
    let newLayout = { ...currentLayout, backgroundColor: bgColor };
    neighborLayouts.push(newLayout);
  });

  // Example variations for font size
  [12, 16, 18, 22, 24, 28].forEach((fontSize) => {
    let newLayout = { ...currentLayout, fontSize };
    neighborLayouts.push(newLayout);
  });

  // Generate variations based on alignments
  alignments.forEach((alignment, index) => {
    let newLayout = { ...currentLayout, alignment }; // Set alignment based on the loop
    neighborLayouts.push(newLayout);
  });

  // Add variations for font styles
  ['Arial', 'Times New Roman', 'Helvetica', 'Courier New'].forEach((fontStyle) => {
    let newLayout = { ...currentLayout, fontStyle };
    neighborLayouts.push(newLayout);
  });

  return neighborLayouts;
};

// Function to generate the banners based on user inputs and theme data
export const generateBanner = async (data) => {
  console.log("Banner generation started...");
  console.log("User Inputs: ", data.userInputs);

  // Get theme details
  const themeDetails = getThemeDetails(data.userInputs.theme);
  
  // Apply user inputs, including background color
  let layoutWithUserInputs = applyUserInputs(themeDetails, data.userInputs);

  const openSet = new Set([layoutWithUserInputs]); // Set of potential layouts
  let bestLayouts = []; // Array to store best layouts
  const numberOfLayouts = 4; // Define how many different layouts you want to generate

  // Initialize learning parameters
  const userHistory = {}; // Fetch from a database or maintain in the current session

  let iterationCount = 0;
  const maxIterations = 1000; // Set a limit to avoid infinite looping

  const processBatch = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Iteration ${iterationCount}, openSet size: ${openSet.size}`);

        while (openSet.size > 0 && iterationCount < maxIterations && bestLayouts.length < numberOfLayouts) {
          const currentLayout = Array.from(openSet).reduce((a, b) => 
            evaluateLayout(a, data.userInputs, userHistory) < evaluateLayout(b, data.userInputs, userHistory) ? a : b
          );

          const score = evaluateLayout(currentLayout, data.userInputs, userHistory);
          logLayoutDecision(currentLayout, score);

          bestLayouts.push(currentLayout); // Add the layout to the list of best layouts

          openSet.delete(currentLayout);

          // Generate neighboring layouts
          const neighborLayouts = generateNeighborLayouts(currentLayout);

          neighborLayouts.forEach(neighbor => {
            if (!openSet.has(neighbor)) {
              openSet.add(neighbor);
            }
          });

          iterationCount++;
          if (iterationCount >= maxIterations) {
            console.log("Reached max iterations, exiting...");
            break;
          }
        }

        resolve(); // Resolve after processing this batch
      }, 0); // Let the browser stay responsive by using setTimeout
    });
  };

  await processBatch(); // Process asynchronously

  console.log("Banner generation complete.");
  console.log("Generated Layouts: ", bestLayouts);

  return bestLayouts.slice(0, numberOfLayouts); // Return the top 4 layouts
};

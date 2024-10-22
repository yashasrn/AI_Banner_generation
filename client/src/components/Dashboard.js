import React, { useState } from 'react';
import { generateBanner } from '../services/BannerModel';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import themeData from './themeData';
import patterns from './pattern';


const Dashboard = () => {
    const [prompt, setPrompt] = useState('');
    const [confirmationNeeded, setConfirmationNeeded] = useState(false);
    const [bannerSummary, setBannerSummary] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [banners, setBanners] = useState([]);
    const [fontStyle, setFontStyle] = useState('Arial'); // New state for font style
    const [fontSize, setFontSize] = useState(16); // New state for font size
    const [image, setImage] = useState(null); // New state for image input
    const [selectedFormat, setSelectedFormat] = useState('png'); // Default format
    


    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleFontSizeChange = (e) => {
        setFontSize(e.target.value); // Update font size
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update image state
    };

    const parsePrompt = (input) => {
        const themeMatch = input.match(/diwali|christmas|holi|eid|health|valentine|halloween|thanksgiving/i);
        const discountMatch = input.match(/\d+% off/i) || ['No Discount'];
        const fontStyleMatch = input.match(/times new roman|monotype corsiva|arial/i) || ['Arial'];
        const buttonMatch = input.match(/shop now|buy now/i) || ['Shop Now'];
        const colorMatch = input.match(/#[0-9a-fA-F]{6}/i) || ['#FFA500']; // Basic hex color
    
        // Define theme, default to 'default' if not found
        const theme = themeMatch ? themeMatch[0].toLowerCase() : 'default';
        
        // Extract items after "off" to handle input like "50% off cookies and clothes"
        const itemMatch = input.match(/off\s+(.*)/i);
        const item = itemMatch ? itemMatch[1].trim() : 'all items';
    
        let title = getRandomTitle(theme);
        let subtext = `${discountMatch[0]} on ${item}!`;  // Default subtext pattern
    
        // Customize subtext based on the theme
        switch (theme) {
            case 'diwali':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Enjoy special Diwali discounts!';
                break;
            case 'christmas':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Celebrate Christmas with amazing offers!';
                break;
            case 'holi':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Brighten your Holi with colorful offers!';
                break;
            case 'eid':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Celebrate Eid with exclusive delights!';
                break;
            case 'health':
                subtext = discountMatch[0] && item ? `Get healthy with ${discountMatch[0]} on ${item}!` : 'Special health and wellness discounts!';
                break;
            case 'valentine':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Show your love with Valentine offers!';
                break;
            case 'halloween':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Thrill yourself with Halloween savings!';
                break;
            case 'thanksgiving':
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Celebrate Thanksgiving with great deals!';
                break;
            default:
                subtext = discountMatch[0] && item ? `${discountMatch[0]} on ${item}!` : 'Special deals await you!';
        }
    
        // Return the extracted banner details
        return {
            title,
            subtext,
            fontStyle: fontStyleMatch[0],
            buttonText: buttonMatch[0],
            backgroundColor: colorMatch[0],
        };
    };
    
    // Random Title Generator for the Theme
    const getRandomTitle = (theme) => {
        if (themeData[theme]) {
            const randomIndex = Math.floor(Math.random() * themeData[theme].length);
            return themeData[theme][randomIndex];
        }
        return 'Special Offer!';
    };
    
    
    

    const handleSubmit = (e) => {
        e.preventDefault();

         // Validation: Ensure prompt is not empty
        if (!prompt.trim()) {
            alert("Please enter a prompt.");
            return;
        }

        const parsedBannerData = parsePrompt(prompt);
        const summary = {
            title: parsedBannerData.title,
            subtext: parsedBannerData.subtext,
            fontStyle: fontStyle, // Use font style from state
            fontSize: fontSize, // Use font size from state
            buttonText: parsedBannerData.buttonText,
            backgroundColor: parsedBannerData.backgroundColor,
            image: image, // Include the image if necessary

        };

        // Add user prompt to conversation
        setConversation((prev) => [...prev, { type: 'user', text: prompt }]);
        setBannerSummary(summary);
        setConfirmationNeeded(true);
        setPrompt(''); // Clear the input
        setImage(null); // Clear image input after submission

        // Add summary to conversation immediately
        const summaryMessage = `Summary: ${summary.title} - ${summary.subtext}`;
        setConversation((prev) => [...prev, { type: 'system', text: summaryMessage }]);
    };

    const handleConfirmation = async (isConfirmed) => {
        const confirmationPrompt = "Are you happy with this design?";

        // Add user choice (Yes/No) to the conversation
        setConversation((prev) => [
            ...prev,
            { type: 'system', text: `User chose: ${isConfirmed ? "Yes" : "No"}` },
        ]);

        if (isConfirmed) {
            const themeMatch = bannerSummary.title.match(/diwali|christmas|holi|eid|health|valentine|halloween|thanksgiving/i);
            const theme = themeMatch ? themeMatch[0].toLowerCase() : 'default';
            // If user confirms, proceed with banner generation
            const bannerData = {
                title: bannerSummary.title,
                subtext: bannerSummary.subtext,
                fontStyle: bannerSummary.fontStyle,
                buttonText: bannerSummary.buttonText,
                colors: generateColorShades(theme),
                layout: generateLayoutVariation(), // New layout variation
                fontSize: fontSize,
            };

            const layouts = await Promise.all(
                bannerData.colors.map(async (color) => {
                    const layout = await generateBanner({ userInputs: { ...bannerData, colors: [color] } });

                    // Select a random pattern for this banner
                    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];

                    return { ...bannerData, ...layout[0], backgroundPattern: randomPattern };
                })
            );

            setBanners((prevBanners) => [...prevBanners, ...layouts]);
            setConfirmationNeeded(false);
            setBannerSummary(null); // Clear summary after confirmation
        } else {
            // Generate a new summary when the user chooses "No"
            const newSummary = generateAlternativeSummary(bannerSummary);
            setBannerSummary(newSummary);

            // Add the new summary to the conversation
            const newSummaryMessage = `Summary: ${newSummary.title} - ${newSummary.subtext}`;
            setConversation((prev) => [
                ...prev,
                { type: 'system', text: newSummaryMessage },
                { type: 'system', text: confirmationPrompt }, // Ask for confirmation again
            ]);
        }
    };

    const generateColorShades = (theme) => {
        const colorPalettes = {
            diwali: ['#FFA500', '#FFB733', '#FFD166', '#FFE84D'], // Orange shades
            christmas: ['#FF0000', '#FF5733', '#FF8C00', '#FFD700'], // Red/Gold shades
            holi: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'], // Pink shades
            eid: ['#008000', '#32CD32', '#ADFF2F', '#7FFF00'], // Green shades
            health: ['#00BFFF', '#1E90FF', '#87CEEB', '#4682B4'], // Blue shades
            valentine: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'], // Pink shades
            halloween: ['#FF4500', '#FF8C00', '#FFA500', '#FFD700'], // Orange shades
            thanksgiving: ['#FFA500', '#D2691E', '#A0522D', '#CD853F'], // Brown shades
            default: ['#FFA500', '#FFB733', '#FFD166', '#FFE84D'], // Default shades
        };
    
        return colorPalettes[theme] || colorPalettes['default'];
    };

    const generateLayoutVariation = () => {
        const layouts = ['top', 'bottom', 'left', 'right', 'center'];
        return layouts[Math.floor(Math.random() * layouts.length)];
    };

    const generateAlternativeSummary = (currentSummary) => {
        const themeMatch = currentSummary.title.match(/diwali|christmas|holi|eid|health|valentine|halloween|thanksgiving/i);
        const theme = themeMatch ? themeMatch[0].toLowerCase() : 'default';
        let newTitle;
        do {
            newTitle = getRandomTitle(theme);
        } while (newTitle === currentSummary.title); // Ensure new title is different

        return {
            title: newTitle,
            subtext: currentSummary.subtext,
            fontStyle: currentSummary.fontStyle,
            buttonText: currentSummary.buttonText,
        };
    };

    const downloadBanner = (index) => {
        const banner = document.getElementById(`generated-banner-${index}`);
        const backgroundPattern = window.getComputedStyle(banner).backgroundImage;
    
        html2canvas(banner, {
            ignoreElements: (element) =>
                element.classList.contains('download-button') ||
                element.tagName === 'SELECT'
        }).then((canvas) => {
            const ctx = canvas.getContext('2d');
    
            // If there's a background pattern, manually add it to the canvas
            if (backgroundPattern && backgroundPattern.includes('url')) {
                const patternImageUrl = extractUrlFromPattern(backgroundPattern); // Extract URL from background-image
                const patternImg = new Image();
                patternImg.src = patternImageUrl;
    
                patternImg.onload = () => {
                    // Set the pattern image as a fill style
                    const pattern = ctx.createPattern(patternImg, 'repeat');
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, banner.offsetWidth, banner.offsetHeight);
                    
                    // Now save the canvas
                    downloadCanvas(canvas, index);
                };
            } else {
                // No pattern, directly download the canvas
                downloadCanvas(canvas, index);
            }
        }).catch((error) => {
            console.error('Error downloading banner:', error);
        });
    };
    
    const extractUrlFromPattern = (pattern) => {
        const urlMatch = pattern.match(/url\(["']?(.+?)["']?\)/);
        return urlMatch ? urlMatch[1] : null;
    };
    
    const downloadCanvas = (canvas, index) => {
        const link = document.createElement('a');
        const format = selectedFormat || 'png'; // Fallback to 'png' if selectedFormat is undefined
    
        link.download = `banner-${index}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
        link.remove(); // Clean up the link element
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-black to-orange-600">
            <div className="flex-grow p-10 overflow-hidden flex flex-col">
                <div className="mx-auto" style={{ width: '80%', paddingLeft: '10px', paddingRight: '10px' }}>
                    <div className="flex-grow overflow-y-auto mb-4 p-3 border border-gray-300 rounded">
                        {/* Conversation Section */}
                        <div className="mb-4">
                            {conversation.map((msg, index) => (
                                <div key={index} className={`my-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                    <span className={`block p-2 rounded ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                        {msg.text}
                                    </span>
                                    {index === conversation.length - 1 && confirmationNeeded && (
                                        <div className="mt-2 flex justify-center">
                                            <button onClick={() => handleConfirmation(true)} className="bg-green-500 text-white py-2 px-4 rounded mr-4">
                                                Yes
                                            </button>
                                            <button onClick={() => handleConfirmation(false)} className="bg-red-500 text-white py-2 px-4 rounded">
                                                No
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                       {/* Banners Section */}
                {banners.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.map((banner, index) => (
                        <motion.div
                            key={index}
                            id={`generated-banner-${index}`}
                            className="p-6 rounded-lg text-white flex relative"
                            style={{
                                backgroundColor: banner.colors[0] || banner.backgroundColor || '#ff5733',
                                backgroundImage: banner.backgroundPattern ? `${banner.backgroundPattern}` : 'none',
                                backgroundSize: 'cover',
                                fontFamily: banner.fontStyle,
                                fontSize: `${banner.fontSize}px`,
                                width: '500px', // Keep the width fixed at 500px
                                minHeight: '150px', // Minimum height, but can grow
                                overflow: 'hidden',
                                position: 'relative', // For positioning elements within the banner
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Render the image if provided */}
                            {banner.image && (
                                <img 
                                    src={URL.createObjectURL(banner.image)} 
                                    alt="Banner" 
                                    className="w-1/3 h-full object-cover rounded-l" // Adjust the width of the image
                                />
                            )}

                            {/* Text and button section */}
                            <div
                                className="flex-grow px-4 py-2"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background for better readability
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <h2 
                                    style={{ fontSize: `${banner.fontSize}px`, wordBreak: 'break-word' }} 
                                    className="text-lg font-bold"
                                >
                                    {banner.title}
                                </h2>
                                <p 
                                    style={{ fontSize: `${banner.fontSize}px`, wordBreak: 'break-word' }} 
                                    className="text-sm"
                                >
                                    {banner.subtext}
                                </p>

                                {/* Shop Now Button */}
                                <button 
                                    className="bg-blue-500 text-white py-2 px-4 rounded absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90"
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%) rotate(90deg)',
                                    }}
                                >
                                    Shop Now
                                </button>
                            </div>

                            {/* Download functionality container */}
                            <div className="absolute inset-0 flex items-center justify-left opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white bg-opacity-90 p-4 rounded shadow-lg">
                                    <select
                                        value={selectedFormat}
                                        onChange={(e) => setSelectedFormat(e.target.value)}
                                        className="bg-white text-black py-2 px-4 rounded border border-gray-400 mr-2"
                                    >
                                        <option value="png">PNG</option>
                                        <option value="jpg">JPG</option>
                                        <option value="jpeg">JPEG</option>
                                        <option value="webp">WEBP</option>
                                    </select>
                                    <button
                                        style={{ zIndex: 4 }} // Ensure it is above other elements
                                        onClick={() => downloadBanner(index)}
                                        className="download-button bg-green-500 text-black p-2 rounded"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </div>
                )}
                </div>

                    {/* Input Section */}
                    <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 z-10 flex justify-between">
                        <form onSubmit={handleSubmit} className="flex w-full">
                            <input
                                type="text"
                                value={prompt}
                                onChange={handlePromptChange}
                                placeholder="Enter your prompt here..."
                                className="flex-grow px-4 py-2 mr-2 border border-gray-400 rounded"
                            />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="mr-2 border border-gray-400 rounded"
                            />
                            <select
                                value={fontStyle}
                                onChange={(e) => setFontStyle(e.target.value)}
                                className="mr-2 border border-gray-400 rounded"
                            >
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Verdana">Verdana</option>
                                <option value="Monotype Corsiva">Monotype Corsiva</option>
                                <option value="Comic Sans MS">Comic Sans MS</option>
                                <option value="Trebuchet MS">Trebuchet MS</option>
                                <option value="Impact">Impact</option>
                                <option value="Lucida Console">Lucida Console</option>
                                <option value="Palatino Linotype">Palatino Linotype</option>
                                <option value="Tahoma">Tahoma</option>
                                <option value="Segoe UI">Segoe UI</option>
                                <option value="Brush Script MT">Brush Script MT</option>
                                <option value="Arial Black">Arial Black</option>
                                <option value="Futura">Futura</option>
                                <option value="Garamond">Garamond</option>
                                <option value="Helvetica">Helvetica</option>
                                <option value="Baskerville">Baskerville</option>
                            </select>
                            <input
                                type="number"
                                value={fontSize}
                                onChange={handleFontSizeChange}
                                placeholder="Font Size"
                                className="mr-2 border border-gray-400 rounded px-4 py-2"
                            />
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
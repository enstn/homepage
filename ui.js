// ui.js
import {regionContent, loadTextContent} from './content.js';
window.showRegionDetails = showRegionDetails;

let currentSubpage = 0;

export function setupMagneticLegend() {
    const items = document.querySelectorAll('.legend-item');
    const magnetThreshold = 100; // Detection radius in pixels
    
    function updateItems(e) {
        let closestItem = null;
        let closestDistance = Infinity;

        // First find the closest item
        items.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenterX = rect.left + rect.width / 2;
            const itemCenterY = rect.top + rect.height / 2;
            
            const distance = Math.hypot(
                e.clientX - itemCenterX,
                e.clientY - itemCenterY
            );

            if (distance < magnetThreshold && distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });

        // Then update all items
        items.forEach(item => {
            if (item === closestItem) {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const itemCenterY = rect.top + rect.height / 2;
                
                // Calculate movement
                const moveX = (e.clientX - itemCenterX) * 0.3; // 0.3 is movement strength
                const moveY = (e.clientY - itemCenterY) * 0.3;
                
                // Apply transform with transition only to closest item
                item.style.transition = 'transform 0.2s ease-out';
                item.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.2)`;
            } else {
                // Reset others immediately
                item.style.transition = 'none';
                item.style.transform = 'none';
            }
        });
    }

    // Add mousemove listener
    document.addEventListener('mousemove', updateItems);

    // Clean up
    return () => {
        document.removeEventListener('mousemove', updateItems);
    };
}

export function setupUIInteractions() {
    const legendItems = document.querySelectorAll('.legend-item');
    const infoPanel = document.getElementById('info-panel');
    const closeButton = document.getElementById('close-info-panel');
    const siteInfo = document.getElementById('site-info');

    // legend showcase logic
    legendItems.forEach(item => {
        item.addEventListener('click', () => {
            const region = item.dataset.region;
            if (item.classList.contains('active') && infoPanel.classList.contains('active')) {
                return;
            }
            legendItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            showRegionDetails(region);
        });
    });

    // site info showcase 
    siteInfo.addEventListener('click',() => {
        legendItems.forEach(item => {
            item.classList.remove('active');
        });
        showRegionDetails('info');
    });

    // close with click
    if (closeButton && infoPanel) {
        closeButton.addEventListener('click', () => {
            console.log('Close button clicked');
            infoPanel.classList.remove('active');
            legendItems.forEach(i => i.classList.remove('active'));
        });
    }}

    setupTitleRefresh();
    setupMagneticLegend();
    setupHotkeyBindings();

function setupTitleRefresh() {
    const siteTitle = document.getElementById('site-title');
    
    if (siteTitle) {
        siteTitle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            devTools.clearYourMomsCookies();
            window.location.reload();
        });
    }
}

// Development tools
export const devTools = {
    clearYourMomsCookies: function() {
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.trim().split("=")[0] + "=;" + "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        });
        
        // Clear old caches
        if ('caches' in window) {
            caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
            });
        }

        console.log('Cookies & caches cleared successfully.')

        localStorage.clear();
        localStorage.setItem('siteVersion', SITE_VERSION);
        console.log('Local storage cleared');
    }
};

// hotkeys function
function setupHotkeyBindings() {
    const infoPanel = document.getElementById('info-panel');
    const legendItems = document.querySelectorAll('.legend-item');
    
    // Bind number keys to legend items
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') handleHotkey('1');
        if (e.key === '2') handleHotkey('2');
        if (e.key === '3') handleHotkey('3');
        if (e.key === '4') handleHotkey('random');
        if (e.key === '5') handleHotkey('booklist');

        if (e.key === 'i') handleInfoHotkey();
        if (e.key === 'v') handleVersionHotkey();
        if (e.key === 'q') {
            if (currentSubpage) {
                const mainRegion = currentSubpage.split('.')[0];
                currentSubpage = null;
                showRegionDetails(mainRegion);
            } else if (infoPanel.classList.contains('active')) {
                infoPanel.classList.remove('active');
                legendItems.forEach(i => i.classList.remove('active'));
            }
        }
        
    });

    function handleHotkey(region) {
        const item = document.querySelector(`.legend-item[data-region="${region}"]`);
        if (!item) return;
        
        if (item.classList.contains('active') && infoPanel.classList.contains('active')) {
            return;
        }
        legendItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        showRegionDetails(region);
    }

    function handleInfoHotkey() {
        legendItems.forEach(item => item.classList.remove('active'));
        showRegionDetails('info');
    }

    function handleVersionHotkey() {
        legendItems.forEach(item => item.classList.remove('active'));
        showRegionDetails('info', 'info.1');
    }

}

// region content stuff
async function showRegionDetails(region, subpage = null) {

    const infoPanel = document.getElementById('info-panel');
    const detailsContainer = document.getElementById('region-details');
    detailsContainer.classList.add('changing');

    const mainContent = regionContent[region];
    const content = subpage ? mainContent.subpages[subpage] : mainContent;
    currentSubpage = subpage; // tracking for hotkey

    // Load all text content first
    for (const item of content.content) {
        if ( (item.type === 'text' || item.type === 'highlight') && item.textFile) {
            item.content = await loadTextContent(item.textFile);
        }
    }
    
    let accentColor;
    if (subpage) {
        // Use subpage accent color if it exists, otherwise fall back to main region's accent color
        accentColor = content.accentColor || mainContent.accentColor;
    } else {
        accentColor = mainContent.accentColor;
    }

    // opening legend items when clicking on subpage links
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach(item => {
        if (item.dataset.region === region) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (!content) {
        console.error(`No content found for ${subpage ? 'subpage' : 'region'}: ${subpage || region}`);
        return;
    }

    detailsContainer.classList.add('changing');

    if (!infoPanel.classList.contains('active')) {
        infoPanel.classList.add('active');
    }

    setTimeout(() => {
        let htmlContent = `
            <div class="region-header">
                ${subpage ? `
                    <div class="subpage-nav">
                        <button class="nav-back" onclick="window.showRegionDetails('${region}')">
                            ← Back to ${mainContent.title}
                        </button>
                    </div>
                ` : ''}
                <h2>${content.title}</h2>
                <div class="content-divider" style="margin: 0.5rem auto"></div>
                ${content.subtitle ? `<h3>${content.subtitle}</h3>` : ''}
            </div>
            <div class="region-content">
        `;
        // Build content based on content types
        content.content.forEach(item => {
            switch (item.type) {
                case 'image':
                    htmlContent += `
                        <div class="content-image">
                            <img src="${item.src}" alt="${item.alt}">
                        </div>
                    `;
                    break;
                case 'text':
                    htmlContent += `
                        <p class="content-text">${item.content}</p>
                    `;
                    break;
                case 'list':
                    htmlContent += `
                        <div class="content-list">
                            ${item.title ? `<h4>${item.title}</h4>` : ''}
                            <ul>
                                ${item.items.map(listItem => `<li>${listItem}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    break;
                case 'highlight':
                    htmlContent += `
                        <div class="content-highlight">
                            ${item.content}
                        </div>
                    `;
                    break;
                case 'link':
                    htmlContent += `
                        <div class="content-link">
                            <a href="${item.url}" target="_blank" rel="noopener noreferrer">
                                ${item.icon ? `<span class="link-icon">${item.icon}</span>` : ''}
                                <div class="link-content">
                                    <h4 class="link-title">${item.title}</h4>
                                    <p class="link-description">${item.description}</p>
                                </div>
                            </a>
                        </div>
                    `;
                    break;
                case 'divider':
                    const dividerStyle = item.style || {};
                    htmlContent += `
                        <div class="content-divider" 
                            style="
                                margin: ${dividerStyle.margin || '1.5rem auto'};
                                height: ${dividerStyle.height || '1px'};
                                max-width: ${dividerStyle.width || '95%'};
                                background: ${dividerStyle.color || 'currentColor'};
                            "
                        ></div>
                    `;
                    break;
                case 'custom-booklist':
                    htmlContent += `
                        <div class="book-list">
                            ${item.items.map(book => {
                                // Fix the score logic
                                const scoreClass = parseInt(book.score) >= 8 ? 'score-high' : '';
                                
                                return `
                                    <div class="book-item">
                                        <div class="book-info">
                                            <span class="region-link" data-region="${region}" data-subpage="${book.id}">${book.title}</span>
                                            <span class="book-author">by ${book.author}</span>
                                        </div>
                                        <div class="book-dots"></div>
                                        <div class="book-score ${scoreClass}">${book.score}/10</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `;
                    break;
            }
        });

        htmlContent += `</div>`;
        detailsContainer.innerHTML = htmlContent;

        // Apply accent color if specified
        if (content.accentColor) {
            detailsContainer.querySelectorAll('.region-header h2, .content-list h4').forEach(element => {
                element.style.color = content.accentColor;
            });
            detailsContainer.querySelectorAll('.content-highlight').forEach(element => {
                element.style.borderLeft = `3px solid ${content.accentColor}`;
            });
        }

        // Handle region links
        detailsContainer.querySelectorAll('.region-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetRegion = e.target.dataset.region;
                const targetSubpage = e.target.dataset.subpage;
                
                if (targetSubpage) {
                    showRegionDetails(targetRegion, targetSubpage);
                } else {
                    const targetLegendItem = document.querySelector(`.legend-item[data-region="${targetRegion}"]`);
                    if (targetLegendItem) {
                        document.querySelectorAll('.legend-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        targetLegendItem.classList.add('active');
                        showRegionDetails(targetRegion);
                    }
                }
            });
        });

        detailsContainer.classList.remove('changing');
    }, 300);
}

window.handleRegionLink = function(region) {
    showRegionDetails(region);
};


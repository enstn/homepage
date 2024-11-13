// ui.js
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

    if (closeButton && infoPanel) {
        closeButton.addEventListener('click', () => {
            console.log('Close button clicked');
            infoPanel.classList.remove('active');
            legendItems.forEach(i => i.classList.remove('active'));
        });
    }

    setupTitleRefresh();
    setupMagneticLegend();
}

function showRegionDetails(region) {
    const infoPanel = document.getElementById('info-panel');
    const detailsContainer = document.getElementById('region-details');

    detailsContainer.classList.add('changing');

    if (!infoPanel.classList.contains('active')) {
        infoPanel.classList.add('active');
    }

    setTimeout(() => {
        detailsContainer.innerHTML = `
            <h3>${region.charAt(0).toUpperCase() + region.slice(1)} whatever region</h3>
            <p>Detailed information about the ${region}</p>
        `;

        detailsContainer.classList.remove('changing');
    }, 300);
}

function setupTitleRefresh() {
    const siteTitle = document.getElementById('site-title');
    
    if (siteTitle) {
        siteTitle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
        
        localStorage.clear();
        sessionStorage.clear();
        
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        console.log('Cookies data cleared successfully!');
        return 'Site data cleared. Refresh the page to see changes.';
    }
};
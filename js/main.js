document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && !event.target.closest('.navbar-container')) {
            navMenu.classList.remove('active');
            
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current nav item based on URL
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentLocation.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if (currentLocation.endsWith('/') && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // Platform search and filter functionality
    const platformSearch = document.getElementById('platform-search');
    const zoneFilter = document.getElementById('zone-filter');
    const platformCards = document.querySelectorAll('.platform-card');
    
    if (platformSearch) {
        platformSearch.addEventListener('input', filterPlatforms);
    }
    
    if (zoneFilter) {
        zoneFilter.addEventListener('change', filterPlatforms);
    }
    
    function filterPlatforms() {
        const searchTerm = platformSearch ? platformSearch.value.toLowerCase() : '';
        const selectedZone = zoneFilter ? zoneFilter.value : '';
        
        platformCards.forEach(card => {
            const platformName = card.querySelector('h3').textContent.toLowerCase();
            const platformZone = card.getAttribute('data-zone');
            
            const matchesSearch = platformName.includes(searchTerm);
            const matchesZone = selectedZone === '' || platformZone === selectedZone;
            
            if (matchesSearch && matchesZone) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    
    if (paginationButtons.length > 0) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Here you would normally load the next page of data
                // For demo purposes, we'll just scroll to top
                window.scrollTo({
                    top: document.querySelector('.platforms-section').offsetTop - 80,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Platform card click handler - redirect to platform detail or login
    const platformDetailLinks = document.querySelectorAll('.platform-card .btn-outline');
    
    if (platformDetailLinks) {
        platformDetailLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!isAuthenticated) {
                    e.preventDefault();
                    // Store the intended destination
                    const platformName = this.closest('.platform-card').querySelector('h3').textContent;
                    localStorage.setItem('redirectAfterLogin', `platform-detail.html?platform=${platformName}`);
                    window.location.href = 'login.html';
                } else {
                    // If authenticated, update href to go to platform detail
                    const platformName = this.closest('.platform-card').querySelector('h3').textContent;
                    this.setAttribute('href', `platform-detail.html?platform=${platformName}`);
                }
            });
        });
    }
});
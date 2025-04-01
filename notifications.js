// Notification Management
class NotificationManager {
    constructor() {
        this.storageKey = 'jobNotifications';
        this.lastCheckKey = 'lastJobCheck';
        this.notificationBadge = document.querySelector('.notification-badge');
        this.notificationIcon = document.querySelector('.notifications');
        this.notificationPopup = this.createNotificationPopup();
        this.initialize();
    }

    createNotificationPopup() {
        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.style.display = 'none';
        popup.style.position = 'absolute';
        popup.style.top = '60px';
        popup.style.right = '20px';
        popup.style.background = 'white';
        popup.style.padding = '10px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        popup.style.zIndex = '1000';
        popup.style.maxHeight = '300px';
        popup.style.overflowY = 'auto';
        document.body.appendChild(popup);
        return popup;
    }

    initialize() {
        // Initialize notification count from localStorage
        this.updateNotificationBadge();
        
        // Add click listener to toggle notifications
        if (this.notificationIcon) {
            this.notificationIcon.addEventListener('click', () => this.toggleNotifications());
        }

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.notificationIcon.contains(e.target) && !this.notificationPopup.contains(e.target)) {
                this.notificationPopup.style.display = 'none';
            }
        });
    }

    getNotificationCount() {
        return parseInt(localStorage.getItem(this.storageKey)) || 0;
    }

    setNotificationCount(count) {
        localStorage.setItem(this.storageKey, count.toString());
        this.updateNotificationBadge();
    }

    getLastCheckTime() {
        return localStorage.getItem(this.lastCheckKey) || new Date(0).toISOString();
    }

    setLastCheckTime(time) {
        localStorage.setItem(this.lastCheckKey, time);
    }

    updateNotificationBadge() {
        const count = this.getNotificationCount();
        if (this.notificationBadge) {
            if (count > 0) {
                this.notificationBadge.textContent = count;
                this.notificationBadge.style.display = 'block';
            } else {
                this.notificationBadge.style.display = 'none';
            }
        }
    }

    toggleNotifications() {
        const newJobs = JSON.parse(localStorage.getItem('newJobs') || '[]');
        
        if (this.notificationPopup.style.display === 'none') {
            // Show popup with job titles
            this.notificationPopup.innerHTML = newJobs.length > 0 ?
                newJobs.map(job => `<div class="notification-item">${job.title}</div>`).join('') :
                '<div class="notification-item">No new notifications</div>';
            this.notificationPopup.style.display = 'block';
        } else {
            this.notificationPopup.style.display = 'none';
        }
        
        // Reset notifications
        this.setNotificationCount(0);
        this.setLastCheckTime(new Date().toISOString());
        localStorage.setItem('newJobs', '[]');
    }

    checkNewJobs(jobs) {
        const lastCheck = new Date(this.getLastCheckTime());
        const newJobs = jobs.filter(job => new Date(job.posted_at) > lastCheck);
        
        if (newJobs.length > 0) {
            localStorage.setItem('newJobs', JSON.stringify(newJobs));
            this.setNotificationCount(newJobs.length);
        }
    }
}

// Export the NotificationManager
window.NotificationManager = NotificationManager;
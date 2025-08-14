// Blog management system with markdown support
(function() {
    'use strict';
    
    // Blog configuration
    const BLOG_CONFIG = {
        postsDirectory: 'posts/',
        postsListFile: 'posts.json',
        containerId: 'blog-posts',
        viewerId: 'post-viewer',
        contentId: 'post-content',
        closeButtonId: 'close-post'
    };
    
    // Configure marked.js for better rendering
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
    
    // Blog post class
    class BlogPost {
        constructor(data) {
            this.id = data.id;
            this.title = data.title;
            this.excerpt = data.excerpt;
            this.date = new Date(data.date);
            this.category = data.category;
            this.filename = data.filename;
            this.content = null;
        }
        
        formatDate() {
            return this.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        async loadContent() {
            if (this.content) return this.content;
            
            try {
                const response = await fetch(`${BLOG_CONFIG.postsDirectory}${this.filename}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const markdown = await response.text();
                this.content = marked.parse(markdown);
                return this.content;
            } catch (error) {
                console.error(`Error loading post ${this.filename}:`, error);
                this.content = '<p>Error loading post content.</p>';
                return this.content;
            }
        }
    }
    
    // Blog manager
    class BlogManager {
        constructor() {
            this.posts = [];
            this.currentPost = null;
            this.container = document.getElementById(BLOG_CONFIG.containerId);
            this.viewer = document.getElementById(BLOG_CONFIG.viewerId);
            this.contentElement = document.getElementById(BLOG_CONFIG.contentId);
            this.closeButton = document.getElementById(BLOG_CONFIG.closeButtonId);
            
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.loadPosts();
        }
        
        bindEvents() {
            // Close button event
            if (this.closeButton) {
                this.closeButton.addEventListener('click', () => this.closePost());
            }
            
            // Click outside to close
            if (this.viewer) {
                this.viewer.addEventListener('click', (e) => {
                    if (e.target === this.viewer) {
                        this.closePost();
                    }
                });
            }
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.viewer.classList.contains('active')) {
                    this.closePost();
                }
            });
        }
        
        async loadPosts() {
            try {
                const response = await fetch(`${BLOG_CONFIG.postsDirectory}${BLOG_CONFIG.postsListFile}`);
                if (!response.ok) {
                    this.showNoPostsMessage();
                    return;
                }
                
                const postsData = await response.json();
                this.posts = postsData.map(postData => new BlogPost(postData));
                
                // Sort posts by date (newest first)
                this.posts.sort((a, b) => b.date - a.date);
                
                this.renderPosts();
            } catch (error) {
                console.error('Error loading posts:', error);
                this.showNoPostsMessage();
            }
        }
        
        renderPosts() {
            if (!this.container || this.posts.length === 0) {
                this.showNoPostsMessage();
                return;
            }
            
            const postsHTML = this.posts.map(post => this.createPostCard(post)).join('');
            this.container.innerHTML = postsHTML;
            
            // Add click events to read more buttons
            this.posts.forEach(post => {
                const button = document.querySelector(`[data-post-id="${post.id}"]`);
                if (button) {
                    button.addEventListener('click', () => this.openPost(post));
                }
            });
        }
        
        createPostCard(post) {
            return `
                <article class="post-card">
                    <div class="post-meta">
                        <time class="post-date">${post.formatDate()}</time>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <button class="read-more" data-post-id="${post.id}">
                        Read More
                    </button>
                </article>
            `;
        }
        
        async openPost(post) {
            if (!this.viewer || !this.contentElement) return;
            
            this.currentPost = post;
            
            // Show loading state
            this.contentElement.innerHTML = '<div class="loading">Loading post...</div>';
            this.viewer.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Load and render content
            try {
                const content = await post.loadContent();
                this.contentElement.innerHTML = `
                    <header class="post-header">
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-meta">
                            <time class="post-date">${post.formatDate()}</time>
                            <span class="post-category">${post.category}</span>
                        </div>
                    </header>
                    <div class="post-body">
                        ${content}
                    </div>
                `;
            } catch (error) {
                this.contentElement.innerHTML = '<p>Error loading post content.</p>';
            }
        }
        
        closePost() {
            if (!this.viewer) return;
            
            this.viewer.classList.remove('active');
            document.body.style.overflow = '';
            this.currentPost = null;
        }
        
        showNoPostsMessage() {
            if (!this.container) return;
            
            this.container.innerHTML = `
                <div class="no-posts-message">
                    <p>No blog posts yet. Check back soon for new content!</p>
                </div>
            `;
        }
    }
    
    // Initialize blog when DOM is ready
    function initBlog() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new BlogManager());
        } else {
            // DOM already loaded
            new BlogManager();
        }
    }
    
    // Start initialization
    initBlog();
    
})(); 
# SNV Motors - Website Documentation

## 📋 Project Overview

**Client:** SNV Motors  
**Project:** Corporate Website  
**Version:** 1.0  
**Date:** October 2, 2025  
**Description:** Professional website for SNV Motors showcasing motor manufacturing capabilities, products, and services.

---

## 📁 File Structure

```
Website Source Files/
│
├── index.html                 # Main HTML file
├── styles.css                 # All CSS styles
├── script.js                  # All JavaScript functionality
├── README.md                  # This documentation file
│
├── Final SNV Logo.png         # Main company logo
├── snv logo - white.png       # White logo for footer
│
└── Home Pages/                # Hero section background images
    ├── 3.png
    ├── home 3.png
    ├── home page 5.png
    └── home page 6.png
```

---

## 🚀 Quick Start Guide

### **1. Deployment Options**

#### **Option A: Simple Hosting (Recommended for beginners)**
1. Upload all files to your web hosting via FTP/cPanel
2. Ensure folder structure is maintained
3. Access via your domain: `https://yourdomain.com`

#### **Option B: GitHub Pages (Free)**
1. Create a GitHub repository
2. Upload all files maintaining folder structure
3. Enable GitHub Pages in repository settings
4. Access via: `https://yourusername.github.io/repository-name`

#### **Option C: Local Testing**
1. Simply open `index.html` in any modern web browser
2. All features will work locally

---

## 🎨 Website Features

### **1. Dynamic Hero Section**
- Auto-rotating background images (4 slides)
- 3-second interval between slides
- Manual navigation with dots and arrows
- Keyboard navigation (Left/Right arrow keys)
- Pause on hover
- "OUR PRODUCTS" button links to products section

### **2. About Us Section**
- Company overview and mission
- Animated statistics counter (triggers on scroll)
  - 25+ Years Experience
  - 500+ Clients Worldwide
  - 10,000+ Products Delivered
  - 99% Quality Rate
- Key features with icons
- Professional layout with image placeholder

### **3. Products & Capabilities**
- **Smart Search**: Real-time product filtering
- **Category Filters**: Filter by product type
- **6 Product Cards** with detailed specifications:
  - Stator Laminations
  - Rotor Assemblies
  - Motor Housings
  - Precision Shafts
  - Bearing Systems
  - Custom Components
- Hover animations and smooth transitions

### **4. Customer Testimonials**
- 3 professional testimonials
- Star ratings
- Company names and positions
- Responsive card layout

### **5. Contact Section**
- **Modern Form Design**:
  - First Name & Last Name
  - Email validation
  - Phone number with +91 prefix
  - Message textarea
  - Real-time validation
  - Loading states
- **Contact Information Card**:
  - Email: venusnv@stamping.com
  - WhatsApp/SMS: +91 735037 38939
  - Physical address in Bengaluru
  - Social media links
- **Form Features**:
  - Client-side validation
  - Error messages
  - Success notifications
  - Keyboard shortcuts (Ctrl/Cmd + K for search)

### **6. Interactive Elements**
- Smooth scroll navigation
- Scroll-to-top button (appears after scrolling 300px)
- Reading progress bar at top
- Loading screen with logo animation
- Section reveal animations
- Mobile hamburger menu

---

## 🎯 Navigation Structure

```
Home (Hero Section)
  ↓
About Us
  ↓
Products & Capabilities
  ↓
Customer Testimonials
  ↓
Contact Us
  ↓
Footer
```

---

## 📱 Responsive Design

### **Breakpoints:**
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

### **Mobile Features:**
- Hamburger menu
- Stacked layouts
- Touch-friendly buttons
- Optimized font sizes
- Hidden navigation arrows
- Full-width forms

---

## ⚙️ Customization Guide

### **1. Update Company Information**

#### **Contact Details** (in `index.html`, line ~488-515):
```html
<div class="info-value">venusnv@stamping.com</div>
<div class="info-value">+91 735037 38939</div>
<div class="info-value">Your Address Here</div>
```

#### **Company Statistics** (in `index.html`, line ~133-158):
```html
<span class="stat-number" data-target="25">0</span>
<span class="stat-label">Years Experience</span>
```
Change `data-target` value to update the number.

### **2. Update Images**

#### **Logo:**
- Replace `Final SNV Logo.png` (main logo)
- Replace `snv logo - white.png` (footer logo)
- Recommended size: 200x80px, PNG format with transparency

#### **Hero Backgrounds:**
- Replace images in `Home Pages/` folder
- Recommended size: 1920x1080px
- Format: PNG or JPG
- Update paths in `index.html` (line ~42-45)

### **3. Update Colors**

#### **Primary Brand Color** (Orange: #ff6b35):
In `styles.css`, search and replace `#ff6b35` with your color.

#### **Secondary Color** (Blue for contact card: #1f6aa2):
In `styles.css`, search and replace `#1f6aa2` with your color.

### **4. Add/Remove Products**

In `index.html`, find the Products section (line ~194-345) and duplicate this structure:

```html
<div class="product-card" data-category="stator">
    <div class="product-image">
        <!-- SVG icon here -->
    </div>
    <div class="product-content">
        <h3>Product Name</h3>
        <p>Description</p>
        <ul class="product-features">
            <li>Feature 1</li>
            <li>Feature 2</li>
        </ul>
        <div class="product-specs">
            <span class="spec">Specification</span>
        </div>
    </div>
</div>
```

### **5. Update Social Media Links**

In `index.html` (line ~521-526):
```html
<a href="https://linkedin.com/company/yourcompany" class="social-link">in</a>
<a href="https://facebook.com/yourcompany" class="social-link">f</a>
```

---

## 🔧 Technical Specifications

### **Technologies Used:**
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox & Grid
- **Vanilla JavaScript**: No dependencies
- **Google Fonts**: Inter font family

### **Browser Compatibility:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Performance:**
- Optimized images
- Lazy loading support
- Debounced scroll handlers
- Intersection Observer API for animations
- No external dependencies (except Google Fonts)

---

## 🐛 Troubleshooting

### **Images Not Loading:**
1. Check file paths are correct
2. Ensure images are in the correct folders
3. Check file name capitalization (case-sensitive on some servers)

### **Form Not Working:**
- Currently configured for demo (simulated submission)
- To connect to email service:
  - Use FormSpree, EmailJS, or similar service
  - Update `handleEnhancedContactSubmit()` in `script.js` (line ~591)

### **Animations Not Working:**
1. Ensure JavaScript is enabled in browser
2. Check browser console for errors (F12)
3. Verify `script.js` is loading correctly

### **Mobile Menu Not Opening:**
1. Check hamburger icon is visible
2. Verify JavaScript is loaded
3. Clear browser cache

---

## 📞 Support & Maintenance

### **Common Updates:**

#### **Change Phone Number:**
Search for `+91 735037 38939` in `index.html` and replace.

#### **Change Email:**
Search for `venusnv@stamping.com` in `index.html` and replace.

#### **Update Copyright Year:**
In `index.html` footer section (line ~663):
```html
<p>&copy; 2024 SNV Motors. All rights reserved.</p>
```

#### **Add New Testimonial:**
Copy existing testimonial card structure (line ~436-454) and modify content.

---

## 🔐 Security Notes

1. **Form Submissions**: Currently simulated. Implement server-side validation before going live.
2. **Email Protection**: Consider using contact form services to hide email from spam bots.
3. **HTTPS**: Always use HTTPS in production for security.

---

## 📈 SEO Optimization

### **Already Implemented:**
- Semantic HTML5 tags
- Meta viewport tag
- Descriptive title tag
- Alt text for images
- Clean URL structure

### **Recommended Additions:**
1. Add meta description tag
2. Add Open Graph tags for social sharing
3. Create sitemap.xml
4. Add robots.txt
5. Implement Google Analytics

---

## 🎓 Training Resources

### **For Content Updates:**
- HTML basics: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)
- Find and replace text in files using any code editor

### **For Hosting:**
- cPanel tutorial: Search "cPanel file upload tutorial"
- GitHub Pages: [pages.github.com](https://pages.github.com)

---

## 📝 Changelog

### **Version 1.0 (October 2, 2025)**
- Initial release
- Dynamic hero carousel
- Product filtering and search
- Contact form with validation
- Testimonials section
- Fully responsive design
- Smooth animations
- Error handling
- Mobile optimization

---

## 📄 License & Credits

**Developed for:** SNV Motors  
**Design & Development:** Custom built  
**Fonts:** Google Fonts (Inter)  
**Icons:** Custom SVG icons

---

## 🚨 Important Notes

1. **Before Going Live:**
   - Update all placeholder content
   - Replace demo images with actual photos
   - Test on multiple devices
   - Set up proper form handling
   - Configure analytics
   - Test all links

2. **Backup:**
   - Always keep a backup of all files
   - Version control recommended (Git)

3. **Updates:**
   - Test changes locally before uploading
   - Clear browser cache after updates
   - Check mobile view after changes

---

## 📧 Contact for Support

For technical support or questions about this website:
- Review this documentation first
- Check browser console for errors (F12)
- Ensure all files are uploaded correctly

---

**End of Documentation**

*Last Updated: October 2, 2025*

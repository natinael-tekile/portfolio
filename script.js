/**
 * PORTFOLIO CLIENT APPLICATION JAVASCRIPT
 * Engineer: Natinael Tekile | Software Engineering Student
 * Features: Dark/Light Mode Persistence, Mobile Nav Drawer, Typewriter,
 *           ScrollSpy, Clipboard Copy, Form Validation & Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
   'use strict';

   /* -----------------------------------------------------------------------
      1. Theme Management (Dark / Light Mode)
      ----------------------------------------------------------------------- */
   const themeToggleBtn = document.getElementById('theme-toggle');
   const STORAGE_THEME_KEY = 'natinael-portfolio-theme';

   // Detect initial theme preference: stored preference > system preference
   const getInitialTheme = () => {
      const stored = localStorage.getItem(STORAGE_THEME_KEY);
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   };

   const applyTheme = (theme) => {
      if (theme === 'dark') {
         document.body.classList.add('dark-mode');
         themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
      } else {
         document.body.classList.remove('dark-mode');
         themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      }
      localStorage.setItem(STORAGE_THEME_KEY, theme);
   };

   // Initialize theme
   applyTheme(getInitialTheme());

   themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      applyTheme(isDark ? 'light' : 'dark');
      showToast(isDark ? 'Switched to Light Mode' : 'Switched to Dark Mode', 'info');
   });

   /* -----------------------------------------------------------------------
      2. Mobile Navigation Drawer
      ----------------------------------------------------------------------- */
   const menuToggleBtn = document.getElementById('menu-toggle');
   const navLinks = document.getElementById('nav-links');
   const navItems = document.querySelectorAll('.nav-link');

   const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
      navLinks.classList.toggle('active', isOpen);
      menuToggleBtn.classList.toggle('active', isOpen);
      menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
   };

   if (menuToggleBtn && navLinks) {
      menuToggleBtn.addEventListener('click', (e) => {
         e.stopPropagation();
         toggleMenu();
      });

      // Close menu when clicking any nav item
      navItems.forEach(link => {
         link.addEventListener('click', () => toggleMenu(false));
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
         if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            toggleMenu(false);
         }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu(false);
         }
      });
   }

   /* -----------------------------------------------------------------------
      3. Dynamic Typing Animation
      ----------------------------------------------------------------------- */
   const typingTarget = document.getElementById('typing-text');
   const titles = [
      'C++ & Java Systems',
      'SQL & Database Architectures',
      'Responsive Web Applications',
      'Scalable Software Solutions'
   ];

   let titleIndex = 0;
   let charIndex = 0;
   let isDeleting = false;
   let typingDelay = 100;

   const executeTypewriter = () => {
      if (!typingTarget) return;

      const currentTitle = titles[titleIndex];

      if (isDeleting) {
         typingTarget.textContent = currentTitle.substring(0, charIndex - 1);
         charIndex--;
         typingDelay = 40;
      } else {
         typingTarget.textContent = currentTitle.substring(0, charIndex + 1);
         charIndex++;
         typingDelay = 90;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
         isDeleting = true;
         typingDelay = 1800; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
         isDeleting = false;
         titleIndex = (titleIndex + 1) % titles.length;
         typingDelay = 400; // Pause before new word
      }

      setTimeout(executeTypewriter, typingDelay);
   };

   executeTypewriter();

   /* -----------------------------------------------------------------------
      4. ScrollSpy: Active Section Navigation Highlight
      ----------------------------------------------------------------------- */
   const sections = document.querySelectorAll('section[id]');

   const updateActiveNavOnScroll = () => {
      const scrollY = window.pageYOffset;
      const navOffset = 120;

      sections.forEach(current => {
         const sectionHeight = current.offsetHeight;
         const sectionTop = current.offsetTop - navOffset;
         const sectionId = current.getAttribute('id');
         const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

         if (correspondingLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
               correspondingLink.classList.add('active');
            } else {
               correspondingLink.classList.remove('active');
            }
         }
      });
   };

   window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });

   /* -----------------------------------------------------------------------
      5. Back to Top Button
      ----------------------------------------------------------------------- */
   const backToTopBtn = document.getElementById('back-to-top');

   if (backToTopBtn) {
      window.addEventListener('scroll', () => {
         if (window.pageYOffset > 350) {
            backToTopBtn.classList.add('visible');
         } else {
            backToTopBtn.classList.remove('visible');
         }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
         window.scrollTo({
            top: 0,
            behavior: 'smooth'
         });
      });
   }

   /* -----------------------------------------------------------------------
      6. One-Click Copy Email
      ----------------------------------------------------------------------- */
   const copyEmailBtn = document.getElementById('copy-email-btn');
   const EMAIL_ADDRESS = 'natinaeltekile8@gmail.com';

   if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', async () => {
         try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
               await navigator.clipboard.writeText(EMAIL_ADDRESS);
            } else {
               // Fallback for older browsers
               const tempInput = document.createElement('input');
               tempInput.value = EMAIL_ADDRESS;
               document.body.appendChild(tempInput);
               tempInput.select();
               document.execCommand('copy');
               document.body.removeChild(tempInput);
            }
            showToast('Email copied to clipboard!', 'success');
         } catch (err) {
            showToast('Failed to copy. Please manually copy email.', 'error');
         }
      });
   }

   /* -----------------------------------------------------------------------
      7. Contact Form Validation & Submission
      ----------------------------------------------------------------------- */
   const contactForm = document.getElementById('contact-form');
   const nameInput = document.getElementById('name');
   const emailInput = document.getElementById('email');
   const messageInput = document.getElementById('message');
   const submitBtn = document.getElementById('submit-btn');

   const nameError = document.getElementById('name-error');
   const emailError = document.getElementById('email-error');
   const messageError = document.getElementById('message-error');

   const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   };

   const clearErrors = () => {
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';
   };

   if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
         e.preventDefault();
         clearErrors();

         const nameValue = nameInput.value.trim();
         const emailValue = emailInput.value.trim();
         const messageValue = messageInput.value.trim();

         let hasError = false;

         if (!nameValue) {
            nameError.textContent = 'Please enter your name.';
            hasError = true;
         } else if (nameValue.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters.';
            hasError = true;
         }

         if (!emailValue) {
            emailError.textContent = 'Please enter your email address.';
            hasError = true;
         } else if (!validateEmail(emailValue)) {
            emailError.textContent = 'Please provide a valid email (e.g. name@domain.com).';
            hasError = true;
         }

         if (!messageValue) {
            messageError.textContent = 'Please write a brief message.';
            hasError = true;
         } else if (messageValue.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters.';
            hasError = true;
         }

         if (hasError) return;

         // Simulate form dispatching with interactive feedback
         submitBtn.disabled = true;
         const originalBtnContent = submitBtn.innerHTML;
         submitBtn.innerHTML = `<span>Sending...</span>`;

         setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
            contactForm.reset();
            showToast('Thank you! Your message has been received.', 'success');
         }, 800);
      });

      // Clear field errors upon typing
      [nameInput, emailInput, messageInput].forEach(field => {
         if (field) {
            field.addEventListener('input', () => {
               const errorSpan = document.getElementById(`${field.id}-error`);
               if (errorSpan) errorSpan.textContent = '';
            });
         }
      });
   }

   /* -----------------------------------------------------------------------
      8. Toast Notification Utility
      ----------------------------------------------------------------------- */
   function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
      toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${message}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
         toast.classList.add('fade-out');
         toast.addEventListener('animationend', () => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
         });
      }, 3500);
   }

   /* -----------------------------------------------------------------------
      9. Dynamic Footer Year
      ----------------------------------------------------------------------- */
   const yearElem = document.getElementById('current-year');
   if (yearElem) {
      yearElem.textContent = new Date().getFullYear();
   }
});

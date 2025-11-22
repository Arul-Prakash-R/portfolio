document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    // High-DPI rendering (4k support)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance on 4k screens

    // Cyber Sphere Group
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // 1. Core Sphere (Dense Particles)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10; // Initial spread
    }

    // Create a sphere shape
    const sphereRadius = 4;
    for (let i = 0; i < particlesCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = sphereRadius + (Math.random() - 0.5) * 0.5; // Slight fuzziness

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00cc00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    sphereGroup.add(particlesMesh);

    // 2. Outer Orbit Rings
    const ringGeometry = new THREE.TorusGeometry(5.5, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00b7eb, transparent: true, opacity: 0.3 });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
    const ring3 = new THREE.Mesh(ringGeometry, ringMaterial);

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.y = -Math.PI / 4;

    sphereGroup.add(ring1);
    sphereGroup.add(ring2);
    sphereGroup.add(ring3);
    camera.position.z = 10;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let isExploding = false;
    let explosionFactor = 0;

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;

        // Update normalized device coordinates for raycaster
        mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    canvas.addEventListener('click', () => {
        isExploding = true;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    // Store original colors
    const colors = new Float32Array(particlesCount * 3);
    const originalColor = new THREE.Color(0x00cc00);
    const hoverColor = new THREE.Color(0xffffff); // White hot

    for (let i = 0; i < particlesCount; i++) {
        colors[i * 3] = originalColor.r;
        colors[i * 3 + 1] = originalColor.g;
        colors[i * 3 + 2] = originalColor.b;
    }
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    material.vertexColors = true;

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Explosion Logic
        if (isExploding) {
            explosionFactor += 0.05;
            if (explosionFactor > 2) isExploding = false; // Reset trigger
        } else {
            explosionFactor = Math.max(0, explosionFactor - 0.02); // Return to normal
        }

        // Raycasting for "Magnetic" Effect
        raycaster.setFromCamera(mouseVector, camera);

        const positions = particlesGeometry.attributes.position.array;
        const colorAttribute = particlesGeometry.attributes.color;

        // Update particles
        for (let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Calculate screen position of this particle for "Focus" effect
            // (Simplified distance check for performance)
            const vector = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
            vector.applyMatrix4(particlesMesh.matrixWorld);
            vector.project(camera);

            const dx = vector.x - mouseVector.x;
            const dy = vector.y - mouseVector.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Interaction Radius
            if (dist < 0.15) {
                colorAttribute.setXYZ(i, hoverColor.r, hoverColor.g, hoverColor.b);
            } else {
                colorAttribute.setXYZ(i, originalColor.r, originalColor.g, originalColor.b);
            }
        }
        colorAttribute.needsUpdate = true;

        // Warp Effect
        const scale = 1 + explosionFactor * 2;
        particlesMesh.scale.set(scale, scale, scale);
        particlesMesh.rotation.y = elapsedTime * (0.1 + explosionFactor); // Spin faster

        // Rotate rings
        ring1.rotation.z = elapsedTime * 0.2;
        ring2.rotation.z = elapsedTime * 0.15;
        ring3.rotation.z = elapsedTime * 0.1;

        // Expand rings on explosion
        ring1.scale.setScalar(1 + explosionFactor);
        ring2.scale.setScalar(1 + explosionFactor);
        ring3.scale.setScalar(1 + explosionFactor);

        // Mouse interaction (tilt entire group)
        sphereGroup.rotation.y += 0.005 * (mouseX - sphereGroup.rotation.y);
        sphereGroup.rotation.x += 0.005 * (mouseY - sphereGroup.rotation.x);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
});

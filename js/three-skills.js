document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-bg-skills');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    const container = document.querySelector('#skills');

    function updateSize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High-DPI
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    updateSize();

    // Complex Geometry Group
    const shapes = [];

    // Create a "Cyber Artifact" class/function
    function createCyberArtifact(x, y, z) {
        const group = new THREE.Group();

        // Outer Wireframe
        const geometry1 = new THREE.IcosahedronGeometry(1, 0);
        const material1 = new THREE.MeshBasicMaterial({
            color: 0x00b7eb, // Cyan
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const mesh1 = new THREE.Mesh(geometry1, material1);
        group.add(mesh1);

        // Inner Solid Core
        const geometry2 = new THREE.OctahedronGeometry(0.5, 0);
        const material2 = new THREE.MeshBasicMaterial({
            color: 0x00cc00, // Green
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const mesh2 = new THREE.Mesh(geometry2, material2);
        group.add(mesh2);

        group.position.set(x, y, z);

        // Random rotation speeds
        group.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02,
            floatSpeed: (Math.random() * 0.01) + 0.005,
            yOffset: Math.random() * Math.PI * 2,
            initialY: y
        };

        scene.add(group);
        shapes.push({ group, mesh1, mesh2 });
    }

    // Spawn artifacts
    for (let i = 0; i < 8; i++) {
        createCyberArtifact(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 5
        );
    }

    camera.position.z = 8;

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        shapes.forEach(item => {
            const { group, mesh1, mesh2 } = item;

            // Rotate entire group
            group.rotation.x += group.userData.rotSpeedX;
            group.rotation.y += group.userData.rotSpeedY;

            // Rotate inner mesh opposite
            mesh2.rotation.x -= group.userData.rotSpeedX * 2;
            mesh2.rotation.z += group.userData.rotSpeedY * 2;

            // Float
            group.position.y = group.userData.initialY + Math.sin(time + group.userData.yOffset) * 0.5;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', updateSize);
});

import cv2
import numpy as np

def remove_black_bg(input_path, output_path):
    try:
        # Load image
        img = cv2.imread(input_path)
        if img is None:
            print(f"Error: Could not read image {input_path}")
            return

        # Convert to RGBA (add alpha channel)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

        # Define black threshold (since v2 has a black background)
        # Pixels with B, G, R < 30 will be considered background
        lower_black = np.array([0, 0, 0, 0], dtype=np.uint8)
        upper_black = np.array([30, 30, 30, 255], dtype=np.uint8)

        # Create mask
        rgb = img[:, :, :3]
        mask = cv2.inRange(rgb, np.array([0, 0, 0]), np.array([30, 30, 30]))

        # Invert mask: 0 for black (bg), 255 for non-black (fg)
        mask_inv = cv2.bitwise_not(mask)

        # Set alpha channel
        img[:, :, 3] = mask_inv

        # Save
        cv2.imwrite(output_path, img)
        print(f"Successfully saved transparent image to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    remove_black_bg("arul_cyber_v2.png", "arul_cyber_v2_transparent.png")

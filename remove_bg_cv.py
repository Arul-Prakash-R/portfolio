import cv2
import numpy as np

def remove_white_bg(input_path, output_path):
    try:
        # Load image
        img = cv2.imread(input_path)
        if img is None:
            print(f"Error: Could not read image {input_path}")
            return

        # Convert to RGBA (add alpha channel)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

        # Define white threshold
        # Pixels with B, G, R > 230 will be considered background
        lower_white = np.array([230, 230, 230, 0], dtype=np.uint8)
        upper_white = np.array([255, 255, 255, 255], dtype=np.uint8)

        # Create mask
        # We only care about RGB for the mask
        rgb = img[:, :, :3]
        mask = cv2.inRange(rgb, np.array([230, 230, 230]), np.array([255, 255, 255]))

        # Invert mask: 0 for white (bg), 255 for non-white (fg)
        mask_inv = cv2.bitwise_not(mask)

        # Set alpha channel
        # Where mask is white (background), set alpha to 0
        img[:, :, 3] = mask_inv

        # Optional: Smooth edges
        # kernel = np.ones((3,3), np.uint8)
        # img[:, :, 3] = cv2.erode(img[:, :, 3], kernel, iterations=1)

        # Save
        cv2.imwrite(output_path, img)
        print(f"Successfully saved transparent image to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    remove_white_bg("arul_latest.png", "arul_transparent_cv.png")

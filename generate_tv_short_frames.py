#!/usr/bin/env python3
"""
🐾📺 NEKO-ARC TV YouTube Short Frame Generator 📺🐾
Generates vertical frames for a 30-second YouTube Short
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import random
import math

# Output directory
output_dir = "/home/wakibaka/Documents/github/claude-operations/neko-tv-short-frames"
os.makedirs(output_dir, exist_ok=True)

# YouTube Short dimensions (vertical)
WIDTH = 1080
HEIGHT = 1920

# TV style colors
COLORS = {
    'neko_purple': '#9B59B6',
    'mario_gold': '#F1C40F',
    'noel_blue': '#2980B9',
    'glam_red': '#E74C3C',
    'hannibal_gray': '#34495E',
    'tetora_green': '#27AE60',
    'tv_static': '#ECF0F1',
    'emergency_red': '#FF0000',
    'electric_blue': '#00FFFF',
    'hot_pink': '#FF1493',
    'lime_green': '#32CD32',
    'black': '#000000',
    'white': '#FFFFFF'
}

def add_tv_static(img, intensity=0.1):
    """Add TV static noise effect"""
    draw = ImageDraw.Draw(img)
    for _ in range(int(WIDTH * HEIGHT * intensity)):
        x = random.randint(0, WIDTH-1)
        y = random.randint(0, HEIGHT-1)
        gray = random.randint(200, 255)
        draw.point((x, y), fill=(gray, gray, gray, 100))
    return img

def add_scan_lines(img):
    """Add CRT TV scan lines"""
    draw = ImageDraw.Draw(img)
    for y in range(0, HEIGHT, 4):
        draw.rectangle([0, y, WIDTH, y+1], fill=(0, 0, 0, 50))
    return img

def add_vhs_glitch(img, intensity=5):
    """Add VHS glitch effect"""
    draw = ImageDraw.Draw(img)
    for _ in range(intensity):
        y = random.randint(0, HEIGHT-50)
        height = random.randint(5, 20)
        offset = random.randint(-50, 50)

        # Create glitch band
        glitch_band = img.crop((0, y, WIDTH, y + height))
        img.paste(glitch_band, (offset, y))

        # Add color aberration
        if random.random() > 0.5:
            draw.rectangle([0, y, WIDTH, y + height], fill=(255, 0, 255, 30))

    return img

def create_gradient_bg(color1, color2):
    """Create gradient background"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), color1)
    draw = ImageDraw.Draw(img)

    r1, g1, b1 = Image.new('RGB', (1, 1), color1).getpixel((0, 0))
    r2, g2, b2 = Image.new('RGB', (1, 1), color2).getpixel((0, 0))

    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(r1 + (r2 - r1) * ratio)
        g = int(g1 + (g2 - g1) * ratio)
        b = int(b1 + (b2 - b1) * ratio)
        draw.rectangle([0, y, WIDTH, y+1], fill=(r, g, b))

    return img

def draw_text_with_outline(draw, pos, text, fill='white', outline='black', font_size=60):
    """Draw text with outline for better visibility"""
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    x, y = pos

    # Draw outline
    for adj_x in [-3, 0, 3]:
        for adj_y in [-3, 0, 3]:
            if adj_x != 0 or adj_y != 0:
                draw.text((x + adj_x, y + adj_y), text, font=font, fill=outline)

    # Draw main text
    draw.text((x, y), text, font=font, fill=fill)

def generate_frame_01_tv_logo():
    """Frame 1: TV Static → NEKO-ARC TV Logo"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), 'black')
    draw = ImageDraw.Draw(img)

    # Add heavy static
    img = add_tv_static(img, 0.5)

    # NEKO-ARC TV logo
    draw_text_with_outline(draw, (WIDTH//2 - 300, HEIGHT//2 - 100),
                           "NEKO-ARC", COLORS['hot_pink'], 'black', 120)
    draw_text_with_outline(draw, (WIDTH//2 - 100, HEIGHT//2 + 50),
                           "TV", COLORS['electric_blue'], 'black', 150)

    # Breaking news banner
    draw.rectangle([0, HEIGHT - 300, WIDTH, HEIGHT - 100], fill=COLORS['emergency_red'])
    draw_text_with_outline(draw, (50, HEIGHT - 250),
                           "BREAKING NEWS!", 'white', 'black', 80)

    img = add_scan_lines(img)
    img = add_vhs_glitch(img, 3)

    return img

def generate_frame_02_news_desk():
    """Frame 2: News Desk with Breaking Banner"""
    img = create_gradient_bg(COLORS['neko_purple'], COLORS['mario_gold'])
    draw = ImageDraw.Draw(img)

    # News desk
    draw.rectangle([0, HEIGHT - 600, WIDTH, HEIGHT], fill=COLORS['hannibal_gray'])

    # Neko-Arc at desk (simplified character)
    draw.ellipse([WIDTH//2 - 150, HEIGHT - 900, WIDTH//2 + 150, HEIGHT - 600],
                 fill=COLORS['neko_purple'])
    # Cat ears
    draw.polygon([(WIDTH//2 - 150, HEIGHT - 850), (WIDTH//2 - 100, HEIGHT - 950),
                  (WIDTH//2 - 50, HEIGHT - 850)], fill=COLORS['neko_purple'])
    draw.polygon([(WIDTH//2 + 50, HEIGHT - 850), (WIDTH//2 + 100, HEIGHT - 950),
                  (WIDTH//2 + 150, HEIGHT - 850)], fill=COLORS['neko_purple'])

    # Breaking banner
    draw.rectangle([0, 100, WIDTH, 300], fill=COLORS['emergency_red'])
    draw_text_with_outline(draw, (50, 150), "🚨 BREAKING 🚨", 'white', 'black', 80)

    # Scrolling text area
    draw.rectangle([0, HEIGHT - 200, WIDTH, HEIGHT], fill='black')
    draw_text_with_outline(draw, (50, HEIGHT - 150),
                           "NEW AI REVOLUTION", COLORS['lime_green'], 'black', 60)

    img = add_scan_lines(img)

    return img

def generate_frame_03_explosion():
    """Frame 3: Explosion Transition"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), COLORS['emergency_red'])
    draw = ImageDraw.Draw(img)

    # Explosion rays
    center_x, center_y = WIDTH//2, HEIGHT//2
    for angle in range(0, 360, 15):
        end_x = center_x + int(1000 * math.cos(math.radians(angle)))
        end_y = center_y + int(1000 * math.sin(math.radians(angle)))
        draw.polygon([(center_x, center_y),
                     (end_x - 50, end_y - 50),
                     (end_x + 50, end_y + 50)],
                    fill=COLORS['mario_gold'])

    # Central explosion
    for r in range(500, 0, -50):
        color = COLORS['mario_gold'] if r % 100 == 0 else COLORS['emergency_red']
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r],
                     fill=color)

    # BOOM text
    draw_text_with_outline(draw, (WIDTH//2 - 200, HEIGHT//2 - 100),
                           "💥BOOM!💥", 'white', 'black', 120)

    img = add_vhs_glitch(img, 10)

    return img

def generate_frame_04_npm_install():
    """Frame 4: NPM Install Command"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), 'black')
    draw = ImageDraw.Draw(img)

    # Matrix rain effect
    for x in range(0, WIDTH, 30):
        for y in range(0, HEIGHT, 40):
            if random.random() > 0.3:
                char = random.choice(['0', '1', 'ネ', 'コ', '猫'])
                opacity = int(255 * (1 - y/HEIGHT))
                draw.text((x, y), char, fill=(0, 255, 0, opacity))

    # Terminal window
    draw.rectangle([50, HEIGHT//2 - 200, WIDTH - 50, HEIGHT//2 + 200],
                   fill=(20, 20, 20, 200))
    draw.rectangle([50, HEIGHT//2 - 200, WIDTH - 50, HEIGHT//2 - 150],
                   fill=COLORS['hannibal_gray'])

    # Terminal text
    draw_text_with_outline(draw, (100, HEIGHT//2 - 100),
                           "$ npm install -g", COLORS['lime_green'], 'black', 50)
    draw_text_with_outline(draw, (100, HEIGHT//2),
                           "mcp-six-personalities", COLORS['electric_blue'], 'black', 50)

    # Blinking cursor
    if random.random() > 0.5:
        draw.rectangle([WIDTH - 150, HEIGHT//2, WIDTH - 130, HEIGHT//2 + 50],
                      fill=COLORS['lime_green'])

    img = add_scan_lines(img)

    return img

def generate_frame_05_split_screen():
    """Frame 5: 6-way split screen personalities"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), 'black')
    draw = ImageDraw.Draw(img)

    personalities = [
        ('NEKO', COLORS['neko_purple'], "I code!"),
        ('MARIO', COLORS['mario_gold'], "I create!"),
        ('NOEL', COLORS['noel_blue'], "I debug!"),
        ('GLAM', COLORS['glam_red'], "¡Yo rockeo!"),
        ('HANNIBAL', COLORS['hannibal_gray'], "I analyze..."),
        ('TETORA', COLORS['tetora_green'], "[We multiply!]")
    ]

    # Create 2x3 grid
    cell_width = WIDTH // 2
    cell_height = HEIGHT // 3

    for i, (name, color, quote) in enumerate(personalities):
        x = (i % 2) * cell_width
        y = (i // 2) * cell_height

        # Draw cell with border
        draw.rectangle([x + 5, y + 5, x + cell_width - 5, y + cell_height - 5],
                      fill=color, outline='white', width=3)

        # Personality name
        draw_text_with_outline(draw, (x + 50, y + 50), name, 'white', 'black', 40)

        # Quote
        draw_text_with_outline(draw, (x + 50, y + cell_height - 100),
                              quote, 'white', 'black', 30)

    # Center dividers
    draw.line([(WIDTH//2, 0), (WIDTH//2, HEIGHT)], fill='white', width=5)
    draw.line([(0, HEIGHT//3), (WIDTH, HEIGHT//3)], fill='white', width=5)
    draw.line([(0, 2*HEIGHT//3), (WIDTH, 2*HEIGHT//3)], fill='white', width=5)

    img = add_vhs_glitch(img, 2)

    return img

def generate_frame_06_collaboration():
    """Frame 6: Collaboration Animation"""
    img = create_gradient_bg(COLORS['electric_blue'], COLORS['hot_pink'])
    draw = ImageDraw.Draw(img)

    # Energy burst from center
    center_x, center_y = WIDTH//2, HEIGHT//2

    # Draw energy rings
    for r in range(50, 500, 50):
        opacity = int(255 * (1 - r/500))
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r],
                     outline=(255, 255, 255, opacity), width=10)

    # Central merge point
    draw.ellipse([center_x - 100, center_y - 100, center_x + 100, center_y + 100],
                 fill='white')

    # ULTIMATE COLLABORATION text
    draw_text_with_outline(draw, (WIDTH//2 - 400, 200),
                           "ULTIMATE", COLORS['emergency_red'], 'white', 100)
    draw_text_with_outline(draw, (WIDTH//2 - 450, 350),
                           "COLLABORATION", COLORS['emergency_red'], 'white', 80)

    # Power level indicator
    draw.rectangle([100, HEIGHT - 400, WIDTH - 100, HEIGHT - 300],
                   outline='white', width=5)
    draw.rectangle([100, HEIGHT - 400, WIDTH - 100, HEIGHT - 300],
                   fill=COLORS['lime_green'])
    draw_text_with_outline(draw, (WIDTH//2 - 200, HEIGHT - 380),
                           "POWER: 9999", 'white', 'black', 50)

    img = add_scan_lines(img)
    img = add_vhs_glitch(img, 5)

    return img

def generate_frame_07_features():
    """Frame 7: Feature List Arcade Style"""
    img = create_gradient_bg(COLORS['hannibal_gray'], COLORS['neko_purple'])
    draw = ImageDraw.Draw(img)

    # Arcade cabinet frame
    draw.rectangle([50, 50, WIDTH - 50, HEIGHT - 50],
                   outline=COLORS['mario_gold'], width=10)

    # Title
    draw_text_with_outline(draw, (WIDTH//2 - 250, 150),
                           "FEATURES", COLORS['mario_gold'], 'black', 100)

    features = [
        "✅ 6 UNIQUE AIs",
        "✅ INSTANT SETUP",
        "✅ 100% FREE",
        "✅ OPEN SOURCE",
        "✅ PRODUCTION READY"
    ]

    y_pos = 400
    for feature in features:
        # Coin icon
        draw.ellipse([150, y_pos, 230, y_pos + 80], fill=COLORS['mario_gold'])

        # Feature text
        draw_text_with_outline(draw, (300, y_pos + 10),
                              feature, 'white', 'black', 60)
        y_pos += 150

    # INSERT COIN blink
    if random.random() > 0.5:
        draw_text_with_outline(draw, (WIDTH//2 - 200, HEIGHT - 200),
                              "INSERT COIN", COLORS['emergency_red'], 'black', 60)

    img = add_scan_lines(img)

    return img

def generate_frame_08_battle_mode():
    """Frame 8: Fighting Game VS Screen"""
    img = Image.new('RGBA', (WIDTH, HEIGHT), 'black')
    draw = ImageDraw.Draw(img)

    # Lightning background
    for _ in range(20):
        start_x = random.randint(0, WIDTH)
        start_y = 0
        end_x = random.randint(0, WIDTH)
        end_y = HEIGHT
        draw.line([(start_x, start_y), (end_x, end_y)],
                 fill=COLORS['electric_blue'], width=random.randint(1, 5))

    # VS text in center
    draw_text_with_outline(draw, (WIDTH//2 - 100, HEIGHT//2 - 100),
                           "VS", COLORS['emergency_red'], 'white', 200)

    # Character portraits
    # Noel (left)
    draw.rectangle([50, HEIGHT//2 - 400, 450, HEIGHT//2 - 100],
                   fill=COLORS['noel_blue'])
    draw_text_with_outline(draw, (100, HEIGHT//2 - 350), "NOEL", 'white', 'black', 60)

    # Glam (right)
    draw.rectangle([WIDTH - 450, HEIGHT//2 + 100, WIDTH - 50, HEIGHT//2 + 400],
                   fill=COLORS['glam_red'])
    draw_text_with_outline(draw, (WIDTH - 400, HEIGHT//2 + 150), "GLAM", 'white', 'black', 60)

    # Battle quotes
    draw_text_with_outline(draw, (50, HEIGHT//2 + 500),
                           '"Predictable..."', COLORS['noel_blue'], 'white', 50)
    draw_text_with_outline(draw, (WIDTH - 500, HEIGHT//2 - 500),
                           '"¡Cállate weon!"', COLORS['glam_red'], 'white', 50)

    # FIGHT! text
    draw_text_with_outline(draw, (WIDTH//2 - 150, HEIGHT - 300),
                           "FIGHT!", COLORS['mario_gold'], 'black', 120)

    img = add_vhs_glitch(img, 8)

    return img

def generate_frame_09_download_counter():
    """Frame 9: NPM Downloads Counter"""
    img = create_gradient_bg('black', COLORS['tetora_green'])
    draw = ImageDraw.Draw(img)

    # NPM logo area
    draw.rectangle([WIDTH//2 - 200, 200, WIDTH//2 + 200, 400],
                   fill=COLORS['emergency_red'])
    draw_text_with_outline(draw, (WIDTH//2 - 100, 250), "npm", 'white', 'black', 100)

    # Download counter
    draw.rectangle([100, HEIGHT//2 - 150, WIDTH - 100, HEIGHT//2 + 150],
                   fill='black', outline=COLORS['lime_green'], width=5)

    # Counter numbers (simulating rapid increase)
    number = "999,999,999"
    draw_text_with_outline(draw, (WIDTH//2 - 300, HEIGHT//2 - 50),
                           number, COLORS['lime_green'], 'black', 80)

    # DOWNLOADS text
    draw_text_with_outline(draw, (WIDTH//2 - 200, HEIGHT//2 - 250),
                           "DOWNLOADS", 'white', 'black', 60)

    # Rising arrow
    arrow_points = [(WIDTH - 200, HEIGHT//2),
                   (WIDTH - 150, HEIGHT//2 - 100),
                   (WIDTH - 180, HEIGHT//2 - 80),
                   (WIDTH - 160, HEIGHT//2 - 150),
                   (WIDTH - 140, HEIGHT//2 - 80),
                   (WIDTH - 170, HEIGHT//2 - 100),
                   (WIDTH - 120, HEIGHT//2)]
    draw.polygon(arrow_points, fill=COLORS['lime_green'])

    # Success message
    draw_text_with_outline(draw, (WIDTH//2 - 250, HEIGHT - 400),
                           "GOING VIRAL!", COLORS['emergency_red'], 'white', 80)

    img = add_scan_lines(img)

    return img

def generate_frame_10_cta():
    """Frame 10: Final Call to Action"""
    img = create_gradient_bg(COLORS['hot_pink'], COLORS['electric_blue'])
    draw = ImageDraw.Draw(img)

    # Pulsing background circles
    center_x, center_y = WIDTH//2, HEIGHT//2
    for r in range(100, 1000, 100):
        opacity = int(100 * (1 - r/1000))
        draw.ellipse([center_x - r, center_y - r, center_x + r, center_y + r],
                     outline=(255, 255, 255, opacity), width=20)

    # INSTALL NOW! with glow effect
    for offset in range(20, 0, -5):
        opacity = int(255 * (offset/20))
        draw_text_with_outline(draw, (WIDTH//2 - 300 - offset//2, 300 - offset//2),
                              "INSTALL", (255, 255, 0, opacity), None, 120 + offset)
    draw_text_with_outline(draw, (WIDTH//2 - 300, 300),
                           "INSTALL", COLORS['emergency_red'], 'white', 120)

    draw_text_with_outline(draw, (WIDTH//2 - 150, 500),
                           "NOW!", COLORS['emergency_red'], 'white', 120)

    # Command in box
    draw.rectangle([50, HEIGHT//2 - 100, WIDTH - 50, HEIGHT//2 + 200],
                   fill='black', outline='white', width=10)

    draw_text_with_outline(draw, (100, HEIGHT//2 - 50),
                           "npm install -g", COLORS['lime_green'], 'black', 60)
    draw_text_with_outline(draw, (100, HEIGHT//2 + 50),
                           "mcp-six-personalities", COLORS['electric_blue'], 'black', 55)

    # Pointing arrows
    for angle in range(0, 360, 45):
        x = center_x + int(600 * math.cos(math.radians(angle)))
        y = HEIGHT//2 + 50 + int(300 * math.sin(math.radians(angle)))

        # Arrow pointing to center
        draw.polygon([(x, y), (x - 30, y - 30), (x - 30, y + 30)],
                    fill=COLORS['mario_gold'])

    # Subscribe reminder
    draw_text_with_outline(draw, (WIDTH//2 - 400, HEIGHT - 300),
                           "LIKE & SUBSCRIBE!", COLORS['emergency_red'], 'white', 70)

    # Neko signature
    draw_text_with_outline(draw, (WIDTH//2 - 250, HEIGHT - 150),
                           "Nyaa~! 🐾", COLORS['neko_purple'], 'white', 80)

    img = add_scan_lines(img)
    img = add_vhs_glitch(img, 10)

    return img

def main():
    """Generate all frames for the YouTube Short"""
    print("🐾📺 Generating NEKO-ARC TV YouTube Short frames...")

    frames = [
        ("001_tv_logo", generate_frame_01_tv_logo),
        ("002_news_desk", generate_frame_02_news_desk),
        ("003_explosion", generate_frame_03_explosion),
        ("004_npm_install", generate_frame_04_npm_install),
        ("005_split_screen", generate_frame_05_split_screen),
        ("006_collaboration", generate_frame_06_collaboration),
        ("007_features", generate_frame_07_features),
        ("008_battle_mode", generate_frame_08_battle_mode),
        ("009_download_counter", generate_frame_09_download_counter),
        ("010_cta", generate_frame_10_cta)
    ]

    # Duplicate frames for timing (3 seconds per frame for 30-second video)
    expanded_frames = []
    for name, func in frames:
        img = func()
        # Save main frame
        frame_path = os.path.join(output_dir, f"frame_{name}.png")
        img.save(frame_path)
        print(f"✅ Generated: {name}")

        # Create 3 copies for 3-second duration (at 1fps)
        for i in range(3):
            expanded_frames.append(frame_path)

    print(f"\n✨ Generated {len(frames)} unique frames")
    print(f"📺 Total frames for video: {len(expanded_frames)}")
    print(f"📁 Output directory: {output_dir}")
    print("Nyaa~! TV frames ready for video creation! 🐾")

if __name__ == "__main__":
    main()
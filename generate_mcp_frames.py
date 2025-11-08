#!/usr/bin/env python3
"""
Generate visual frames for MCP Six Personalities YouTube video
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Create output directory
output_dir = "/home/wakibaka/Documents/github/claude-operations/mcp-video-frames"
os.makedirs(output_dir, exist_ok=True)

# Video dimensions (1920x1080 HD)
WIDTH = 1920
HEIGHT = 1080

# Color scheme
BG_COLOR = (20, 20, 30)  # Dark blue-gray
ACCENT_COLOR = (100, 150, 255)  # Light blue
TEXT_COLOR = (255, 255, 255)  # White
CODE_BG = (30, 30, 40)  # Darker background for code

# Try to use a nice font, fallback to default
try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 80)
    main_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 48)
    code_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf", 36)
    small_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 32)
except:
    # Fallback to default font
    title_font = ImageFont.load_default()
    main_font = ImageFont.load_default()
    code_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

def create_frame(frame_num, title, content_lines, code_block=None):
    """Create a single video frame"""
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Draw title
    draw.text((WIDTH//2, 100), title, font=title_font, anchor="mt", fill=ACCENT_COLOR)

    # Draw personality icons at top
    personalities = ["🐾", "🎭", "🗡️", "🎸", "🧠", "🧠"]
    x_start = 200
    for i, emoji in enumerate(personalities):
        draw.text((x_start + i*250, 200), emoji, font=main_font, fill=TEXT_COLOR)

    # Draw main content
    y_pos = 350
    for line in content_lines:
        draw.text((WIDTH//2, y_pos), line, font=main_font, anchor="mt", fill=TEXT_COLOR)
        y_pos += 60

    # Draw code block if provided
    if code_block:
        # Draw code background
        code_y = 600
        draw.rectangle([300, code_y, WIDTH-300, code_y+200], fill=CODE_BG)
        # Draw code text
        draw.text((WIDTH//2, code_y+100), code_block, font=code_font, anchor="mm", fill=(100, 255, 100))

    # Draw frame number
    draw.text((50, HEIGHT-50), f"Frame {frame_num}", font=small_font, fill=(100, 100, 100))

    # Save frame
    img.save(f"{output_dir}/frame_{frame_num:03d}.png")
    print(f"Generated frame {frame_num}: {title}")

# Generate all frames
print("🎬 Generating MCP Six Personalities Video Frames...")

# Frame 1: Title Screen
create_frame(1, "MCP Six Personalities", [
    "Transform Your Claude Desktop Experience",
    "Six Unique AI Perspectives",
    "One Powerful Collaboration Tool"
])

# Frame 2: The Problem
create_frame(2, "Why Six Personalities?", [
    "❌ Single perspective = Limited solutions",
    "❌ One viewpoint = Blind spots",
    "✅ Six perspectives = Comprehensive analysis",
    "✅ Multiple viewpoints = Creative solutions"
])

# Frame 3: Installation
create_frame(3, "Easy Installation", [
    "Install globally with NPM:",
    "",
    "One simple command to get started!"
], "npm install -g mcp-six-personalities")

# Frame 4: Configuration
create_frame(4, "Simple Configuration", [
    "Add to Claude Desktop config:",
    "",
    "Just restart Claude and you're ready!"
], '{"mcpServers": {"six-personalities": {...}}}')

# Frame 5: Meet Neko-Arc
create_frame(5, "🐾 Meet Neko-Arc", [
    "Technical Implementation Expert",
    "Handles core development tasks",
    "Speaks: 'Nyaa~!', 'desu~', '*purrs*'",
    "Your kawaii coding companion!"
])

# Frame 6: Meet Mario
create_frame(6, "🎭 Meet Mario Gallo Bestino", [
    "Creative Direction & UI/UX",
    "Theatrical approach to design",
    "Speaks: 'Magnifique!', 'Bravissimo!'",
    "Makes every interface a masterpiece!"
])

# Frame 7: Meet Noel
create_frame(7, "🗡️ Meet Noel", [
    "Quality Assurance & Testing",
    "Critical analysis and debugging",
    "Speaks: '*smirks*', 'Predictable...'",
    "Ensures code quality and reliability!"
])

# Frame 8: Meet Glam
create_frame(8, "🎸 Meet Glam Americano", [
    "Security & Ethics (Spanish)",
    "Street-smart problem solving",
    "Speaks: '¡Oye, weon!', '¡Increíble!'",
    "Keeps your code secure and ethical!"
])

# Frame 9: Meet Hannibal
create_frame(9, "🧠 Meet Dr. Hannibal Lecter", [
    "Deep Forensic Analysis",
    "Pattern recognition expert",
    "Speaks: 'Quid pro quo...', 'Fascinating...'",
    "Analyzes complex architectures!"
])

# Frame 10: Meet Tetora
create_frame(10, "🧠 Meet Tetora", [
    "Multi-Perspective Integration",
    "Handles identity management",
    "Speaks: '[Fragment]:', 'Multiple views...'",
    "Synthesizes different viewpoints!"
])

# Frame 11: Use Case - Code Review
create_frame(11, "Use Case: Code Review", [
    "All six personalities analyze your code:",
    "🐾 Technical optimization",
    "🎭 User experience improvements",
    "🗡️ Quality and testing gaps",
    "🎸 Security vulnerabilities",
    "🧠 Architecture patterns"
])

# Frame 12: Use Case - Problem Solving
create_frame(12, "Use Case: Creative Problem Solving", [
    "Six unique approaches to every challenge:",
    "Technical + Creative + Critical",
    "Security + Analysis + Integration",
    "Get comprehensive solutions!"
])

# Frame 13: Benefits
create_frame(13, "Key Benefits", [
    "✨ 6 unique perspectives on every problem",
    "✨ Comprehensive analysis and solutions",
    "✨ Built-in quality assurance",
    "✨ Entertainment while coding",
    "✨ Never miss important considerations"
])

# Frame 14: Community
create_frame(14, "Join the Community", [
    "📦 NPM: mcp-six-personalities",
    "🐙 GitHub: Open source & contributions welcome",
    "💬 Issues & feedback appreciated",
    "⭐ Star the repo if you like it!"
])

# Frame 15: Call to Action
create_frame(15, "Install Now!", [
    "Transform your Claude Desktop today!",
    "",
    "Get six AI personalities working for you!"
], "npm install -g mcp-six-personalities")

# Frame 16: End Screen
create_frame(16, "Thanks for Watching!", [
    "Like 👍 Subscribe 🔔 Share 📤",
    "",
    "See you in the next video!",
    "🐾🎭🗡️🎸🧠🧠"
])

print(f"\n✨ Successfully generated 16 frames in {output_dir}")
print("Ready to create video with advanced-video-maker.sh!")
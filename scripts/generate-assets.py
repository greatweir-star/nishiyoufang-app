from PIL import Image, ImageDraw, ImageFont
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '../assets')
os.makedirs(ASSETS_DIR, exist_ok=True)

CINNABAR = (192, 57, 43)
CINNABAR_DARK = (169, 50, 38)
WHITE = (255, 255, 255)
GOLD = (212, 175, 55)
PAPER = (247, 245, 240)
INK = (44, 44, 44)

def draw_rounded_rect(draw, xy, radius, fill):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)

def create_app_icon(size):
    img = Image.new('RGBA', (size, size), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    r = size // 8
    # 背景
    draw.rounded_rectangle([0, 0, size, size], radius=r, fill=CINNABAR)
    # 内框
    margin = size // 12
    draw.rounded_rectangle([margin, margin, size-margin, size-margin], radius=r//2, outline=GOLD, width=max(2, size//120))

    # 方字
    font_size = size // 2
    try:
        # 尝试用系统自带中文字体
        font = ImageFont.truetype("/System/Library/Fonts/STHeiti Light.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", font_size)
        except:
            font = ImageFont.load_default()

    text = "方"
    bbox = draw.textbbox((0,0), text, font=font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] - size // 40
    draw.text((x, y), text, font=font, fill=WHITE)
    return img

def create_splash(width, height):
    img = Image.new('RGB', (width, height), PAPER)
    draw = ImageDraw.Draw(img)

    # 印章
    seal_size = min(width, height) // 4
    seal = create_app_icon(seal_size)
    sx = (width - seal_size) // 2
    sy = height // 3 - seal_size // 2
    img.paste(seal, (sx, sy), seal)

    # 标题
    title_font_size = width // 10
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/STHeiti Light.ttc", title_font_size)
    except:
        try:
            font_title = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", title_font_size)
        except:
            font_title = ImageFont.load_default()

    title = "倪师有方"
    bbox = draw.textbbox((0,0), title, font=font_title)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text(((width-tw)/2, sy + seal_size + height//20), title, font=font_title, fill=INK)

    # 副标题
    sub_font_size = width // 28
    try:
        font_sub = ImageFont.truetype("/System/Library/Fonts/STHeiti Light.ttc", sub_font_size)
    except:
        try:
            font_sub = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", sub_font_size)
        except:
            font_sub = ImageFont.load_default()

    sub = "口袋经方中医 AI"
    bbox = draw.textbbox((0,0), sub, font=font_sub)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text(((width-tw)/2, sy + seal_size + height//20 + title_font_size + 16), sub, font=font_sub, fill=(120,120,120))

    return img

# 生成图标
icon_1024 = create_app_icon(1024)
icon_1024.save(os.path.join(ASSETS_DIR, 'icon-1024.png'))

sizes = [180, 120, 114, 87, 80, 60, 58, 40, 29, 20, 192, 144, 96, 72, 48, 36]
for s in sizes:
    create_app_icon(s).convert('RGBA').save(os.path.join(ASSETS_DIR, f'icon-{s}.png'))

# 生成启动图
splash_1242_2688 = create_splash(1242, 2688)
splash_1242_2688.save(os.path.join(ASSETS_DIR, 'splash-1242x2688.png'))

splash_1080_1920 = create_splash(1080, 1920)
splash_1080_1920.save(os.path.join(ASSETS_DIR, 'splash-1080x1920.png'))

print("Generated assets:")
for f in sorted(os.listdir(ASSETS_DIR)):
    print(f"  {f}")

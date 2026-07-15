import os
import shutil
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), '..')
ASSETS = os.path.join(BASE, 'assets')
RES = os.path.join(BASE, 'android/app/src/main/res')

# Android 图标尺寸映射
mipmap_map = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

for folder, size in mipmap_map.items():
    src = os.path.join(ASSETS, f'icon-{size}.png')
    dst_folder = os.path.join(RES, folder)
    for name in ['ic_launcher.png', 'ic_launcher_foreground.png', 'ic_launcher_round.png']:
        shutil.copy(src, os.path.join(dst_folder, name))
    print(f"Copied {size}px icon to {folder}")

# 启动图尺寸映射
splash_map = {
    'drawable-land-mdpi': (320, 200),
    'drawable-land-hdpi': (480, 320),
    'drawable-land-xhdpi': (640, 480),
    'drawable-land-xxhdpi': (960, 640),
    'drawable-land-xxxhdpi': (1280, 960),
    'drawable-port-mdpi': (200, 320),
    'drawable-port-hdpi': (320, 480),
    'drawable-port-xhdpi': (480, 640),
    'drawable-port-xxhdpi': (640, 960),
    'drawable-port-xxxhdpi': (960, 1280),
}

splash_src = Image.open(os.path.join(ASSETS, 'splash-1080x1920.png'))
for folder, (w, h) in splash_map.items():
    resized = splash_src.resize((w, h), Image.LANCZOS)
    dst = os.path.join(RES, folder, 'splash.png')
    resized.save(dst)
    print(f"Generated splash {w}x{h} for {folder}")

# drawable/splash.png (默认)
default_splash = splash_src.resize((480, 640), Image.LANCZOS)
default_splash.save(os.path.join(RES, 'drawable', 'splash.png'))
print("Generated default splash")

print("Android assets setup complete.")

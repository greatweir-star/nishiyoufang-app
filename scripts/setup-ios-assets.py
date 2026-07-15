import os
import shutil
from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), '..')
ASSETS = os.path.join(BASE, 'assets')
IOS_ASSETS = os.path.join(BASE, 'ios/App/App/Assets.xcassets')

# 图标
icon_src = os.path.join(ASSETS, 'icon-1024.png')
icon_dst = os.path.join(IOS_ASSETS, 'AppIcon.appiconset/AppIcon-512@2x.png')
shutil.copy(icon_src, icon_dst)
print(f"Copied iOS app icon: {icon_dst}")

# 启动图
splash_src = Image.open(os.path.join(ASSETS, 'splash-1242x2688.png'))
splash_2732 = splash_src.resize((2732, 2732), Image.LANCZOS)

splash_dir = os.path.join(IOS_ASSETS, 'Splash.imageset')
for name in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    splash_2732.save(os.path.join(splash_dir, name))
    print(f"Generated iOS splash: {name}")

print("iOS assets setup complete.")

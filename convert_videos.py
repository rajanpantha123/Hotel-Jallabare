import os
import subprocess
import imageio_ffmpeg

exe = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs('videos', exist_ok=True)

videos = [
    ('New assets/IMG_4418.MOV', 'videos/hero-bg-1.mp4'),
    ('New assets/IMG_4443.MOV', 'videos/hero-bg-2.mp4')
]

for src, dst in videos:
    print(f"Transcoding {src} -> {dst}...")
    # Also let's check rotation and preserve resolution/aspect ratio
    cmd = [
        exe, '-y',
        '-i', src,
        '-c:v', 'libx264',
        '-profile:v', 'main',
        '-level', '4.0',
        '-pix_fmt', 'yuv420p',
        '-crf', '22',
        '-preset', 'medium',
        '-vf', 'scale=1080:-2',
        '-an',
        '-movflags', '+faststart',
        dst
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        size_mb = os.path.getsize(dst) / (1024 * 1024)
        print(f"  OK Created {dst} ({size_mb:.2f} MB)")
    else:
        print(f"  FAILED {src}:")
        print(res.stderr[-500:])

print("Video transcoding complete!")
